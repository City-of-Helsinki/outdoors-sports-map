import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";

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
  onClose: () => void;
  show: boolean;
};

function AppAccessibilityModal({ onClose, show }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const Content = modalContentMap[
    language as AccessibilityStatementLanguage
  ] ?? (
    <span lang="en">
      Could not find accessibility statement for selected language
    </span>
  );

  return (
    <Modal show={show} onHide={onClose} size="lg" animation={false}>
      <Modal.Header closeButton closeLabel={t("APP.MODAL.CLOSE")}>
        <Modal.Title>
          <h2>{t("APP.INFO_MENU.ACCESSIBILITY")}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Content />
      </Modal.Body>
      <Modal.Footer>
        {/* Give screen reader users a control for closing the modal after */}
        {/* they've gone through the content. */}
        <Button variant="primary" onClick={onClose}>
          {t("APP.MODAL.CLOSE")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AppAccessibilityModal;
