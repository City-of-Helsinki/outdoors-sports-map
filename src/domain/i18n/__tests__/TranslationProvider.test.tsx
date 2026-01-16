import { useTranslation } from "react-i18next";
import { fi, sv } from "date-fns/locale";

import { render, screen, userEvent } from "../../testingLibraryUtils";
import TranslationProvider from "../I18nTranslationProvider";
import i18n, { getDateFnsLocale } from "../i18n";

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
  it("should ensure that HTML document language and date-fns locale are in sync", () => {
    const language = i18n.languages[0];
    const dateFnsLocale = getDateFnsLocale();

    expect(dateFnsLocale).toEqual(fi); // Should default to Finnish
    expect(document.documentElement.lang).toEqual(language);
  });
  it("should change HTML document language and date-fns locale when language changes", async() => {
    expect(getDateFnsLocale()).toEqual(fi);

    const user = userEvent.setup();
    renderComponent();

    // Change to Swedish
    const svButton = screen.getAllByRole("button")[1];
    await user.click(svButton);

    // Verify that date-fns locale and document language have changed
    expect(getDateFnsLocale()).toEqual(sv);
    expect(document.documentElement.lang).toEqual("sv");
  });
});
