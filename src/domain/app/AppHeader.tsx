import { Header, IconInfoCircle, IconMap } from "hds-react";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import AppAboutModal from "./AppAboutModal";
import AppAccessibilityModal from "./AppAccessibilityModal";
import AppFeedbackModal from "./AppFeedbackModal";
import AppInfoModal from "./AppInfoModal";
import HeaderButton from "../../common/components/HeaderButton";
import { replaceLanguageInPath } from "../../common/utils/pathUtils";
import { SUPPORTED_LANGUAGES } from "../i18n/i18nConstants";
import useLocale from "./hooks/useLocale";
import { MAIN_CONTENT_ID } from "../../common/a11y/Page";
import useIsMobile from "../../common/hooks/useIsMobile";

const DROPDOWN_ID = "app-info-dropdown";
const HEADER_ID = "app-header";

const languages = Object.entries(SUPPORTED_LANGUAGES).map(
  ([languageKey, languageValue]) => ({
    label: languageKey,
    value: languageValue,
    isPrimary: true,
  }),
);

type ModalType = "about" | "feedback" | "accessibility" | "info";

type ApplicationHeaderProps = {
  isExpanded?: boolean;
  onHeaderHeightChange?: (height: number) => void;
  panelId?: string;
  toggleIsExpanded?: () => void;
};

function ApplicationHeader({
  isExpanded,
  onHeaderHeightChange,
  panelId,
  toggleIsExpanded,
}: Readonly<ApplicationHeaderProps>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const isMobile = useIsMobile();

  const history = useHistory();
  const { pathname } = useLocation();

  // Reference to the link which was clicked before opening a modal, to return
  // focus to it when the modal is closed.
  const openDialogLinkRef = useRef<HTMLElement | null>(null);

  // Opened modal state
  const [modal, setModal] = useState<ModalType | null>(null);

  const createMenuLinkClickHandler = useCallback(
    (modal: any): MouseEventHandler<HTMLElement> =>
      (event) => {
        // Set the element that opened the dialog, so focus can be returned to it
        // when the dialog is closed.
        openDialogLinkRef.current = event.currentTarget;

        // Open the modal
        setModal(modal);
      },
    [],
  );

  const handleModalOnClose = useCallback(() => {
    setModal(null);

    // After closing the modal, reopen the dropdown
    const dropdownEl = document.getElementById(DROPDOWN_ID);
    if (dropdownEl) {
      const aboutText = t("APP.ABOUT");
      const aboutButton = Array.from(
        dropdownEl.querySelectorAll("button"),
      ).find(
        (button) =>
          button.textContent?.includes(aboutText) ||
          button.getAttribute("aria-label")?.includes(aboutText),
      );
      aboutButton?.click();
    }

    // After opening the dropdown, focus the link that opened the modal
    setTimeout(() => {
      openDialogLinkRef.current?.focus();
    }, 100);
  }, [t]);

  // Measure header height and update when screen size changes
  useEffect(() => {
    const measureHeaderHeight = () => {
      const headerElement = document.getElementById(HEADER_ID);
      if (headerElement) {
        const height = headerElement.offsetHeight;
        onHeaderHeightChange?.(height);
      }
    };

    // Initial measurement
    measureHeaderHeight();

    // Create ResizeObserver to watch for header size changes
    const resizeObserver = new ResizeObserver(() => {
      measureHeaderHeight();
    });

    // Observe the header element
    const headerElement = document.getElementById(HEADER_ID);
    if (headerElement) {
      resizeObserver.observe(headerElement);
    }

    // Also listen for window resize events as a fallback
    const handleWindowResize = () => {
      measureHeaderHeight();
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [onHeaderHeightChange]);

  return (
    <>
      <Header
        id={HEADER_ID}
        lang={locale}
        className="app-header"
        languages={languages}
        onDidChangeLanguage={(lng) => {
          const newPath = replaceLanguageInPath(pathname, lng);
          history.push({ pathname: newPath });
        }}
      >
        <Header.SkipLink
          skipTo={`#${MAIN_CONTENT_ID}`}
          label={t("JUMP_LINK.LABEL")}
        />
        <Header.ActionBar
          title={t("APP.NAME")}
          frontPageLabel={t("APP.NAME")}
          titleAriaLabel={t("APP.NAME")}
          titleHref={`/${locale}`}
          // Logo will be hidden with CSS, but HDS Header requires these props
          logo={<div />}
          logoAriaLabel={"logo"}
          logoHref={`/${locale}`}
        >
          {isMobile && (
            <HeaderButton
              id="action-bar-map-toggle"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              icon={<IconMap />}
              label={
                isExpanded
                  ? t("APP.MAP_BUTTON.OPEN")
                  : t("APP.MAP_BUTTON.CLOSE")
              }
              onClick={toggleIsExpanded}
            />
          )}

          <Header.SimpleLanguageOptions languages={languages} />
          <Header.ActionBarItem
            id={DROPDOWN_ID}
            icon={<IconInfoCircle />}
            closeIcon={<IconInfoCircle />}
            aria-label={t("APP.ABOUT")}
          >
            <Header.ActionBarSubItemGroup label={t("APP.ABOUT")}>
              <Header.ActionBarSubItem
                label={t("APP.INFO_MENU.SERVICE_INFO")}
                onClick={createMenuLinkClickHandler("info")}
              />
              <Header.ActionBarSubItem
                label={t("APP.INFO_MENU.GIVE_FEEDBACK")}
                onClick={createMenuLinkClickHandler("feedback")}
              />
              <Header.ActionBarSubItem
                label={t("APP.INFO_MENU.ABOUT_SERVICE")}
                onClick={createMenuLinkClickHandler("about")}
              />
              <Header.ActionBarSubItem
                label={t("APP.INFO_MENU.ACCESSIBILITY")}
                onClick={createMenuLinkClickHandler("accessibility")}
              />
              <Header.ActionBarSubItem
                label={t("APP.MAP_ATTRIBUTION")}
                href="https://osm.org/copyright"
                external
              />
            </Header.ActionBarSubItemGroup>
          </Header.ActionBarItem>
        </Header.ActionBar>
      </Header>

      <AppAboutModal
        focusAfterCloseRef={openDialogLinkRef}
        show={modal === "about"}
        onClose={handleModalOnClose}
      />
      <AppInfoModal
        focusAfterCloseRef={openDialogLinkRef}
        show={modal === "info"}
        onClose={handleModalOnClose}
      />
      <AppFeedbackModal
        focusAfterCloseRef={openDialogLinkRef}
        show={modal === "feedback"}
        onClose={handleModalOnClose}
      />
      <AppAccessibilityModal
        focusAfterCloseRef={openDialogLinkRef}
        show={modal === "accessibility"}
        onClose={handleModalOnClose}
      />
    </>
  );
}

export default ApplicationHeader;
