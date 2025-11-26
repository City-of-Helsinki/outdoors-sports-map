import moment from "moment";
import { useTranslation } from "react-i18next";

import { render, screen, userEvent } from "../../testingLibraryUtils";
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

const renderComponent = () =>
  render(
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
  it("should change HTML document language and moment language when language changes", async() => {
    expect(moment.locale()).toEqual("fi");

    const user = userEvent.setup();
    renderComponent();

    // Change to Swedish
    const svButton = screen.getAllByRole("button")[1];
    await user.click(svButton);

    // Verify that moment locale and document language have changed
    expect(moment.locale()).toEqual("sv");
    expect(document.documentElement.lang).toEqual("sv");
  });
});
