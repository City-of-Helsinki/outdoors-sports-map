import { useCallback, useState } from "react";
import { Dropdown } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

import OutboundLink from "../../common/a11y/OutboundLink";
import SMIcon from "../../common/components/SMIcon";
import AppAboutModal from "./AppAboutModal";
import AppFeedbackModal from "./AppFeedbackModal";

function AppInfoDropdown() {
  const { t } = useTranslation();
  const [modal, setModal] = useState<"about" | "feedback" | null>(null);

  const handleOnClose = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <>
      <Dropdown className="app-info-dropdown" role="contentinfo">
        <Dropdown.Toggle>
          <SMIcon icon="info" aria-label={t("APP.ABOUT")} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setModal("feedback")}>
            <SMIcon
              icon="info"
              className="app-info-dropdown__icon"
              aria-hidden="true"
            />
            {t("MAP.INFO_MENU.GIVE_FEEDBACK")}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setModal("about")}>
            <SMIcon
              icon="info"
              className="app-info-dropdown__icon"
              aria-hidden="true"
            />
            {t("MAP.INFO_MENU.ABOUT_SERVICE")}
          </Dropdown.Item>
          <Dropdown.Item as={OutboundLink} href="http://osm.org/copyright">
            <span className="app-info-dropdown__icon">{"\u00a9"}</span>
            {`${t("MAP.ATTRIBUTION")} `}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {ReactDOM.createPortal(
        <>
          {modal === "about" && <AppAboutModal onClose={handleOnClose} />}
          {modal === "feedback" && <AppFeedbackModal onClose={handleOnClose} />}
        </>,
        // @ts-ignore
        document.getElementById("modals")
      )}
    </>
  );
}

export default AppInfoDropdown;
