import { mount } from "../../enzymeHelpers";
import ApplicationHeader from "../AppHeader";

const getWrapper = () => mount(<ApplicationHeader />);

describe("<ApplicationHeader />", () => {
  describe("title", () => {
    it("should contain the application header", () => {
      const wrapper = getWrapper();

      expect(wrapper.find("header").length).toEqual(1);
    });
    it("should render application title", () => {
      const wrapper = getWrapper();
      const title = wrapper.find("h1");

      expect(title.length).toEqual(1);
      expect(title.text()).toEqual("Ulkoliikuntakartta");
    });
  });
  describe("language controls", () => {
    it("should apply lang attribute to language controls", () => {
      const wrapper = getWrapper();
      const swedishLink = wrapper.find('[alt="Svenska"]').parent();
      const englishLink = wrapper.find('[alt="English"]').parent();

      expect(swedishLink.prop("lang")).toEqual("sv");
      expect(englishLink.prop("lang")).toEqual("en");
    });
  });
});
