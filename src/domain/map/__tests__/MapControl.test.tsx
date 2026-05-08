import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { createElement as reactCreateElement, ReactElement } from "react";
import type { Root } from "react-dom/client";

// Local mirror of MapControl.ts types (not exported from source)
type Props = {
  handleClick: (e: Event) => void;
  className?: string;
  children: ReactElement;
  position?: string;
};
type ControlWithRoot = { _reactRoot?: Root; onAdd?: () => HTMLElement };

// All captured state must be in vi.hoisted so it's available when vi.mock factories run
const {
  mockRender,
  mockCreateRoot,
  mockLeafletContext,
  captured,
} = vi.hoisted(() => {
  const mockRender = vi.fn();
  const mockCreateRoot = vi.fn(() => ({ render: mockRender }));
  const mockLeafletContext = { map: {}, layerContainer: undefined };
  // Mutable container for functions captured from createElementHook
  const captured: {
    // context typed as unknown: our minimal mock doesn't satisfy the full LeafletContextInterface
    createElement: ((props: Props, context: unknown) => unknown) | null;
    updateElement: ((instance: ControlWithRoot, props: Props) => void) | null;
  } = { createElement: null, updateElement: null };
  return { mockRender, mockCreateRoot, mockLeafletContext, captured };
});

vi.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

vi.mock("@react-leaflet/core", () => ({
  createElementHook: vi.fn((createElement, updateElement) => {
    captured.createElement = createElement;
    captured.updateElement = updateElement;
    return vi.fn();
  }),
  createElementObject: vi.fn((instance, context) => ({ instance, context })),
  createControlHook: vi.fn(() => vi.fn()),
  createLeafComponent: vi.fn(() => vi.fn()),
  LeafletContextInterface: {},
}));

// Minimal Leaflet mock
const mockLink = {
  on: vi.fn(),
};
const mockDiv = {};
const mockDomEventChain = { on: vi.fn() };
mockDomEventChain.on.mockReturnValue(mockDomEventChain);

vi.mock("leaflet", () => {
  const Control = vi.fn(function (this: Record<string, unknown>, options: unknown) {
    this.options = options;
    this.onAdd = vi.fn();
  });

  return {
    default: {
      Control,
      DomUtil: {
        create: vi.fn((tag: string, className: string, parent?: HTMLElement) => {
          if (tag === "div") return mockDiv;
          if (tag === "button") return mockLink;
          return {};
        }),
      },
      DomEvent: {
        on: vi.fn(() => mockDomEventChain),
        stop: vi.fn(),
        stopPropagation: vi.fn(),
      },
    },
  };
});

// Import the module under test AFTER mocks are set up
import "../MapControl";
import L from "leaflet";
import { createElementObject } from "@react-leaflet/core";

describe("MapControl", () => {
  const mockHandleClick = vi.fn();
  const mockChildren = reactCreateElement("span", { "aria-label": "locate" });
  const defaultProps = {
    handleClick: mockHandleClick,
    className: "leaflet-control-locate",
    children: mockChildren,
    position: "bottomright" as L.ControlPosition,
  };

  // Snapshot createElementHook's call record before beforeEach/clearAllMocks wipes it.
  // createElementHook is invoked at module-load time (when MapControl.ts is imported).
  let wiringCalls: [Function, Function][] = [];
  beforeAll(async () => {
    const { createElementHook } = await import("@react-leaflet/core");
    wiringCalls = (createElementHook as ReturnType<typeof vi.fn>).mock.calls as [Function, Function][];
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockDomEventChain.on.mockReturnValue(mockDomEventChain);
  });

  describe("createElementHook wiring", () => {
    it("is called exactly once (at module load)", () => {
      expect(wiringCalls).toHaveLength(1);
    });

    it("receives createElement as the first argument", () => {
      expect(wiringCalls[0][0]).toBeTypeOf("function");
    });

    it("receives updateElement as the second argument", () => {
      expect(wiringCalls[0][1]).toBeTypeOf("function");
    });
  });

  describe("createElement (onAdd behaviour)", () => {
    it("creates an L.Control with the given position", () => {
      captured.createElement!(defaultProps, mockLeafletContext);
      expect(L.Control).toHaveBeenCalledWith({ position: "bottomright" });
    });

    it("falls back to bottomright when position is not provided", () => {
      const props = { ...defaultProps, position: undefined };
      captured.createElement!(props, mockLeafletContext);
      expect(L.Control).toHaveBeenCalledWith({ position: "bottomright" });
    });

    it("returns a LeafletElement via createElementObject", () => {
      const result = captured.createElement!(defaultProps, mockLeafletContext);
      expect(createElementObject).toHaveBeenCalled();
      expect(result).toHaveProperty("instance");
    });

    describe("after onAdd is invoked", () => {
      function invokeOnAdd(props = defaultProps) {
        // createElement registers onAdd on the control instance
        const elementObject = captured.createElement!(props, mockLeafletContext) as {
          instance: { onAdd: () => HTMLElement };
        };
        return { elementObject, container: elementObject.instance.onAdd() };
      }

      it("creates a wrapper div with the correct class", () => {
        invokeOnAdd();
        expect(L.DomUtil.create).toHaveBeenCalledWith(
          "div",
          "custom-control leaflet-control-locate",
        );
      });

      it("creates a button inside the wrapper div", () => {
        invokeOnAdd();
        expect(L.DomUtil.create).toHaveBeenCalledWith(
          "button",
          "custom-control-button",
          mockDiv,
        );
      });

      it("renders children into the button via createRoot", () => {
        invokeOnAdd();
        expect(mockCreateRoot).toHaveBeenCalledWith(mockLink);
        expect(mockRender).toHaveBeenCalledWith(mockChildren);
      });

      it("stores the React root on the control instance as _reactRoot", () => {
        const { elementObject } = invokeOnAdd();
        const instance = elementObject.instance as { _reactRoot?: { render: typeof mockRender } };
        expect(instance._reactRoot).toBeDefined();
        expect(instance._reactRoot?.render).toBe(mockRender);
      });

      it("stops mousedown and dblclick propagation", () => {
        invokeOnAdd();
        expect(L.DomEvent.on).toHaveBeenCalledWith(
          mockLink,
          "mousedown dblclick",
          L.DomEvent.stopPropagation,
        );
      });

      it("calls handleClick when the button is clicked", () => {
        invokeOnAdd();
        // .on chain signature: (element, eventName, handler)
        // → call[0]=element, call[1]=eventName, call[2]=handler
        const onCalls = mockDomEventChain.on.mock.calls;
        const clickHandlerCall = onCalls.find(
          (call: unknown[]) => call[1] === "click" && call[2] !== L.DomEvent.stop,
        );
        const clickHandler = clickHandlerCall?.[2] as ((e: Event) => void) | undefined;
        const fakeEvent = new Event("click");
        clickHandler?.(fakeEvent);
        expect(mockHandleClick).toHaveBeenCalledWith(fakeEvent);
      });
    });
  });

  describe("updateElement (language switch behaviour)", () => {
    it("calls _reactRoot.render with new children when children prop changes", () => {
      // Set up a mock instance with a stored root
      const newChildren = reactCreateElement("span", { "aria-label": "locate-updated" });
      const mockInstance = { _reactRoot: { render: mockRender, unmount: vi.fn() } };
      captured.updateElement!(mockInstance as unknown as ControlWithRoot, { ...defaultProps, children: newChildren });
      expect(mockRender).toHaveBeenCalledWith(newChildren);
    });

    it("does nothing when _reactRoot is undefined", () => {
      const mockInstance = {};
      expect(() =>
        captured.updateElement!(mockInstance, defaultProps),
      ).not.toThrow();
      expect(mockRender).not.toHaveBeenCalled();
    });
  });
});
