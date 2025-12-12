import {Button, Dialog, IconInfoCircle} from "hds-react";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";

import { MODAL_WIDTH } from "../constants";
import AccessibilityStatementEn from "./accessibilityStatement/AccessibilityStatementEn";
import AccessibilityStatementFi from "./accessibilityStatement/AccessibilityStatementFi";
import AccessibilityStatementSv from "./accessibilityStatement/AccessibilityStatementSv";

type AccessibilityStatementLanguage = "fi" | "sv" | "en";

const modalContentMap = {
  fi: AccessibilityStatementFi,
  sv: AccessibilityStatementSv,
  en: AccessibilityStatementEn,
} as const;

type Props = {
  focusAfterCloseRef?: RefObject<HTMLElement>;
  onClose: () => void;
  show: boolean;
};

function AppAccessibilityModal({ focusAfterCloseRef, onClose, show }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const titleId = "accessibility-dialog-title";

  const Content = modalContentMap[
    language as AccessibilityStatementLanguage
  ] ?? (
    <span lang="en">
      Could not find accessibility statement for selected language
    </span>
  );

  return (
      <Dialog
          id="accessibility-dialog"
          aria-labelledby={titleId}
          isOpen={show}
          close={onClose}
          closeButtonLabelText={t("APP.MODAL.CLOSE")}
          focusAfterCloseRef={focusAfterCloseRef}
          style={{width: MODAL_WIDTH}}
        >
          <Dialog.Header
            id={titleId}  
            title={t("APP.INFO_MENU.ACCESSIBILITY")}
            iconStart={<IconInfoCircle />}
          />
          <Dialog.Content className="outdoor-exercise-map-modal-content">
            <Content />
          </Dialog.Content>
          <Dialog.ActionButtons>
            <Button onClick={onClose}>
              {t("APP.MODAL.CLOSE")}
            </Button>
          </Dialog.ActionButtons>
        </Dialog>
    );
}

export default AppAccessibilityModal;
