import { mount } from "../../enzymeHelpers";
import SearchBar from "../SearchBar";

const getWrapper = (props) => mount(<SearchBar {...props} />);

describe("<SearchBar />", () => {
  it("should have an input for making a search", () => {
    const value = "Test value";
    const onInput = jest.fn();
    const wrapper = getWrapper({ onInput });
    const input = wrapper.find('input[aria-label="Etsi"]').at(0);

    expect(input).toBeTruthy();

    input.simulate("change", { target: { value } });

    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith(value);
  });

  it("should have a submit button", () => {
    const preventDefault = jest.fn();
    const onSubmit = jest.fn();
    const wrapper = getWrapper({ onSubmit });
    const submitButton = wrapper.find('button[type="submit"]').at(0);

    expect(submitButton).toBeTruthy();

    // Simulate submit click by clicking submit on invoking form's
    // onSubmit. Enzyme does not have event propagation.
    submitButton.simulate("click", { preventDefault });
    submitButton.parents("form").prop("onSubmit")({ preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should have a clear button when the input has content and the searchActive prop is active", () => {
    const wrapper = getWrapper({
      input: "Search",
      searchActive: true,
    });

    expect(wrapper.find(".search-bar__input-clear").length).toEqual(1);
  });

  it("should show a loading indicator when disabled is true", () => {
    const wrapper = getWrapper({
      disabled: true,
    });

    expect(wrapper.find('[aria-label="Ladataan"]').length).toBeGreaterThan(0);
  });
});
