import {
  render,
  screen,
  waitFor
} from "../../../testingLibraryUtils";
import { useGetAppWideNotificationsQuery } from "../../state/appWideNotificationSlice";
import AppWideNotification from "../AppWideNotification";

// Mock the API hook to prevent real network requests
vi.mock("../../state/appWideNotificationSlice", () => ({
  useGetAppWideNotificationsQuery: vi.fn(),
}));

const mockUseGetAppWideNotificationsQuery = useGetAppWideNotificationsQuery as ReturnType<typeof vi.fn>;

describe("<AppWideNotification />", () => {
  beforeEach(() => {
    // Setup the mock to return no data (empty response)
    mockUseGetAppWideNotificationsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("dialog should exist", async () => {
    const { container } = render(<AppWideNotification initialState={true} />);

    // Wait for any internal state updates to finish
    await screen.findByLabelText("Notification");

    expect(container.firstChild).toBeInTheDocument();
  });

  
  it("dialog should not exist", async () => {
    render(<AppWideNotification initialState={false} />);

    // Wait for all internal effects to settle
    await waitFor(() => {
      expect(screen.queryByLabelText("Notification")).not.toBeInTheDocument();
    });
  });

  
  it("dialog should exist and have a close button", async () => {
    await render(<AppWideNotification initialState={true} />);

    // Wait for the component to finish any async state updates 
    const closeButton = await screen.findByRole("button");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.title).toEqual("Sulje");
  });
});
