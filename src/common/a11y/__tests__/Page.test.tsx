import { render, screen } from "../../../domain/testinLibraryUtils";
import Page from "../Page";

const renderComponent = (props: any) => render(<Page {...props} />);

describe("<Page />", () => {
  it("should render children within <main />", () => {
    const children = <div data-testid="test" />;

    renderComponent({
      children,
    });

    expect(screen.getByRole("main")).toContainElement(
      screen.getByTestId("test")
    );
  });
  it("should set title", async () => {
    const title = "Title";

    renderComponent({
      title,
      children: <div data-testid="test" />,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(document.title).toEqual(title);
  });
});
