import { IconAngleRight } from "hds-react";
import {
  CSSProperties,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import "./_appMapToolsPanel.scss";

const MENU_ID = "map-tools-menu";
const TITLE_ID = "map-tools-panel-title";
const MENU_ITEM_SELECTOR = '[role="menuitem"]';

type Props = {
  onClose: () => void;
  onOpenEmbedTool: () => void;
  focusAfterCloseRef?: RefObject<HTMLElement>;
};

function AppMapToolsPanel({ onClose, onOpenEmbedTool, focusAfterCloseRef }: Readonly<Props>) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CSSProperties>();

  // Drop the menu directly below the trigger button (like an HDS dropdown),
  // keeping it aligned to the right edge of the viewport.
  useLayoutEffect(() => {
    const trigger = focusAfterCloseRef?.current;
    if (!trigger) return;

    const updatePosition = () => {
      const rect = trigger.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        right: Math.max(0, window.innerWidth - rect.right),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [focusAfterCloseRef]);

  // Move focus into the menu on open
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>(MENU_ITEM_SELECTOR)?.focus();
  }, []);

  // Return focus to the trigger on close, unless something else (e.g. the embed
  // modal) has already claimed focus by the time this runs
  useEffect(() => {
    const panel = panelRef.current;
    const trigger = focusAfterCloseRef?.current;
    return () => {
      if (panel?.contains(document.activeElement)) {
        trigger?.focus();
      }
    };
  }, [focusAfterCloseRef]);

  // Arrow/Home/End menu navigation and Escape-to-close (ARIA menu keyboard pattern)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR));
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number | null = null;
      if (e.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      else if (e.key === "ArrowUp") nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = items.length - 1;

      if (nextIndex !== null) {
        e.preventDefault();
        items[nextIndex].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close when clicking outside the panel (excluding the trigger, which toggles itself)
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (focusAfterCloseRef?.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose, focusAfterCloseRef]);

  return (
    <div className="map-tools-panel" ref={panelRef} style={position}>
      <div className="map-tools-panel__header">
        <span className="map-tools-panel__title" id={TITLE_ID}>{t("MAP_TOOLS.TITLE")}</span>
      </div>
      <ul className="map-tools-panel__list" role="menu" id={MENU_ID} aria-labelledby={TITLE_ID}>
        <li role="none">
          <button
            type="button"
            role="menuitem"
            className="map-tools-panel__item"
            onClick={onOpenEmbedTool}
          >
            <IconAngleRight aria-hidden />
            {t("MAP_TOOLS.EMBEDDING_TOOL")}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default AppMapToolsPanel;
