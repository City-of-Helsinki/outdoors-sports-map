import moment from "moment";
import { useTranslation } from "react-i18next";

import { mount } from "../../enzymeHelpers";
import TranslationProvider from "../I18nTranslationProvider";
import i18n from "../i18n";

function ChangeLanguageButtons() {
  const { i18n: scopedI18n } = useTranslation();

  return (
    <div>
      <button type="button" onClick={() => scopedI18n.changeLanguage("en")}>
        English
      </button>
      <button type="button" onClick={() => scopedI18n.changeLanguage("sv")}>
        Swedish
      </button>
    </div>
  );
}

const getWrapper = () =>
  mount(
    <TranslationProvider>
      <ChangeLanguageButtons />
    </TranslationProvider>
  );

describe("<TranslationProvider />", () => {
  it("should ensure that HTML document language, moment locale and language are in sync", () => {
    const language = i18n.languages[0];

    expect(moment.locale()).toEqual(language);
    expect(document.documentElement.lang).toEqual(language);
  });
  it("should change HTML document language and moment language when language changes", () => {
    expect(moment.locale()).toEqual("fi");

    const wrapper = getWrapper();

    wrapper.find("button").at(1).simulate("click");
    expect(moment.locale()).toEqual("sv");
    expect(document.documentElement.lang).toEqual("sv");
  });
});
