import {
  render,
  screen,
  act,
  fireEvent,
  userEvent,
} from "../../testingLibraryUtils";
import AppFeedbackModal from "../AppFeedbackModal";

// Mutable state object so individual tests can set isLoading = true.
// Declared before vi.mock so the factory closure captures it by reference.
const mockMutationState = { isLoading: false };
const mockSendFeedback = vi.fn();

vi.mock("../state/appSlice", () => ({
  useSendFeedbackMutation: () => [mockSendFeedback, mockMutationState],
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

const getFeedbackTextarea = () =>
  screen.getByRole("textbox", { name: /Palaute/i });
const getSubmitButton = () =>
  screen.getByRole("button", { name: /Lähetä/i });
const getCloseButton = () =>
  screen.getByRole("button", { name: /Sulje/i });
const getAnswerCheckbox = () =>
  screen.getByRole("checkbox", { name: /Haluan vastauksen sähköpostiini/i });
const getEmailInput = () =>
  screen.getByRole("textbox", { name: /sähköposti/i });

// ─── suite ────────────────────────────────────────────────────────────────────

describe("<AppFeedbackModal />", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutationState.isLoading = false;
    // Default: successful API call
    mockSendFeedback.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  // ── idle state ──────────────────────────────────────────────────────────────

  it("renders feedback textarea and enabled send button when idle", () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    expect(getFeedbackTextarea()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
    expect(getSubmitButton()).not.toBeDisabled();
  });

  it("renders required fields note explaining the asterisk", () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);

    // The full Finnish translation (default language in tests)
    const note = screen.getByText("Pakolliset kentät on merkitty *-merkillä");
    expect(note).toBeInTheDocument();

    // Must be a <p> tag and contain the asterisk character
    expect(note.tagName).toBe("P");
    expect(note.textContent).toContain("*");

    // The note must appear before the feedback textarea in the DOM
    const textarea = getFeedbackTextarea();
    expect(
      note.compareDocumentPosition(textarea) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("shows email input when checkbox is checked", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.click(getAnswerCheckbox());
    expect(getEmailInput()).toBeInTheDocument();
  });

  it("hides email input when checkbox is unchecked again", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.click(getAnswerCheckbox());
    await user.click(getAnswerCheckbox());
    expect(screen.queryByRole("textbox", { name: /sähköposti/i })).not.toBeInTheDocument();
  });

  it("does not call mutation if feedback is empty", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.click(getSubmitButton());
    expect(getFeedbackTextarea()).toBeInvalid();
    expect(mockSendFeedback).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    
    // Form should still be visible
    expect(getFeedbackTextarea()).toBeInTheDocument();
  });

  it("email input is invalid when empty with checkbox checked", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.click(getAnswerCheckbox());
    await user.type(getFeedbackTextarea(), "Test feedback");
    expect((getEmailInput() as HTMLInputElement).checkValidity()).toBe(false);
  });

  it("email input is invalid with malformed value", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.click(getAnswerCheckbox());
    await user.type(getEmailInput(), "invalid-email");
    await user.type(getFeedbackTextarea(), "Test feedback");
    expect((getEmailInput() as HTMLInputElement).checkValidity()).toBe(false);
  });

  // ── loading state ───────────────────────────────────────────────────────────

  it("disables send button while mutation is loading", () => {
    mockMutationState.isLoading = true;
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    expect(getSubmitButton()).toBeDisabled();
  });

  // ── submission params ───────────────────────────────────────────────────────

  it("calls mutation with feedback text and empty email by default", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.type(getFeedbackTextarea(), "Test feedback");
    await user.click(getSubmitButton());
    expect(mockSendFeedback).toHaveBeenCalledWith({
      feedback: "Test feedback",
      email: "",
    });
  });

  it("calls mutation with email when checkbox is checked", async () => {
    const user = userEvent.setup();
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await user.click(getAnswerCheckbox());
    await user.type(getEmailInput(), "user@example.com");
    await user.type(getFeedbackTextarea(), "Test feedback");
    await user.click(getSubmitButton());
    expect(mockSendFeedback).toHaveBeenCalledWith({
      feedback: "Test feedback",
      email: "user@example.com",
    });
  });

  // ── successful submission ───────────────────────────────────────────────────

  describe("after a successful submission", () => {
    const submitAndWaitForSuccess = async () => {
      const user = userEvent.setup();
      render(<AppFeedbackModal show={true} onClose={onClose} />);
      await user.type(getFeedbackTextarea(), "Test feedback");
      await user.click(getSubmitButton());
      expect(
        screen.getByText("Palautteesi lähetettiin onnistuneesti.")
      ).toBeInTheDocument();
    };

    it("shows the success notification", async () => {
      await submitAndWaitForSuccess();
      expect(
        screen.getByText("Palautteesi lähetettiin onnistuneesti.")
      ).toBeInTheDocument();
    });

    it("hides form fields", async () => {
      await submitAndWaitForSuccess();
      expect(
        screen.queryByRole("textbox", { name: /Palaute/i })
      ).not.toBeInTheDocument();
    });

    it("disables send button", async () => {
      await submitAndWaitForSuccess();
      expect(getSubmitButton()).toBeDisabled();
    });
  });

  // ── failed submission ───────────────────────────────────────────────────────

  describe("after a failed submission", () => {
    beforeEach(() => {
      mockSendFeedback.mockReturnValue({
        unwrap: () => Promise.reject(new Error("Network error")),
      });
    });

    const submitAndWaitForError = async () => {
      const user = userEvent.setup();
      render(<AppFeedbackModal show={true} onClose={onClose} />);
      await user.type(getFeedbackTextarea(), "Test feedback");
      await user.click(getSubmitButton());
      expect(
        screen.getByText(
          "Palautteen lähetys epäonnistui. Yritä myöhemmin uudelleen."
        )
      ).toBeInTheDocument();
    };

    it("shows the error notification", async () => {
      await submitAndWaitForError();
      expect(
        screen.getByText(
          "Palautteen lähetys epäonnistui. Yritä myöhemmin uudelleen."
        )
      ).toBeInTheDocument();
    });

    it("disables send button", async () => {
      await submitAndWaitForError();
      expect(getSubmitButton()).toBeDisabled();
    });
  });

  // ── close behaviour ─────────────────────────────────────────────────────────

  it("calls onClose when the dialog X button is clicked", async () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    await userEvent.click(getCloseButton());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("logs error when form is submitted with empty feedback bypassing HTML5 validation", () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    // Bypass HTML5 required validation by submitting the form directly
    const form = document.querySelector("form")!;
    fireEvent.submit(form);

    expect(consoleSpy).toHaveBeenCalledWith(
      "User attempted to send feedback without providing feedback",
    );
    expect(mockSendFeedback).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
