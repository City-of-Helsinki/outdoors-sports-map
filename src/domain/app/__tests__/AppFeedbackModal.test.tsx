import {
  render,
  screen,
  fireEvent,
  userEvent,
} from "../../testingLibraryUtils";
import AppFeedbackModal from "../AppFeedbackModal";

// Mock the RTK Query mutation hook
const mockSendFeedback = vi.fn();
vi.mock("../state/appSlice", () => ({
  useSendFeedbackMutation: () => [mockSendFeedback, {}],
}));

describe("<AppFeedbackModal />", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getFeedbackTextarea = () =>
    screen.getByRole("textbox", { name: /Palaute/i });
  const getSubmitButton = () => screen.getByRole("button", { name: "Lähetä" });
  const getAnswerCheckbox = () =>
    screen.getByRole("checkbox", { name: /Haluan vastauksen sähköpostiini/i });
  const getEmailInput = () =>
    screen.getByRole("textbox", { name: /sähköposti/i });

  it("renders feedback textarea and send button", () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    expect(getFeedbackTextarea()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
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

  it("shows email input when checkbox is checked", () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    fireEvent.click(getAnswerCheckbox());
    expect(getEmailInput()).toBeInTheDocument();
  });

  it("does not submit if feedback is empty", async () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    const user = userEvent.setup();
    
    // Try to submit with empty feedback
    await user.click(getSubmitButton());
    
    // Check that form validation prevents submission
    const textarea = getFeedbackTextarea();
    expect(textarea).toBeInvalid(); // HTML5 validation should mark it as invalid
    expect(mockSendFeedback).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    
    // Form should still be visible
    expect(getFeedbackTextarea()).toBeInTheDocument();
  });

  it("email input is invalid with empty value", async () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    const user = userEvent.setup();
    await user.click(getAnswerCheckbox());
    await user.type(getFeedbackTextarea(), "Test feedback");

    expect((getEmailInput() as HTMLInputElement).checkValidity()).toBe(false);
  });

  it("email input is invalid with wrong value", async () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    const user = userEvent.setup();
    await user.click(getAnswerCheckbox());
    await user.type(getEmailInput(), "invalid-email");
    await user.type(getFeedbackTextarea(), "Test feedback");

    expect((getEmailInput() as HTMLInputElement).checkValidity()).toBe(false);
  });

  it("submits feedback without triggering real saga", async () => {
    render(<AppFeedbackModal show={true} onClose={onClose} />);
    const user = userEvent.setup();
    await user.type(getFeedbackTextarea(), "Test feedback");
    fireEvent.click(getSubmitButton());

    // Check that sendFeedback mutation was called with correct params
    expect(mockSendFeedback).toHaveBeenCalledWith({
      feedback: "Test feedback",
      email: "",
    });

    // You can check that onClose was called
    expect(onClose).toHaveBeenCalled();
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
