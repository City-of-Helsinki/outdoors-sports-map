import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";

type Props = {
  onClose: () => void;
  show: boolean;
};

function AppAccessibilityModal({ onClose, show }: Props) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onClose} size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h2>{t("APP.INFO_MENU.GIVE_FEEDBACK")}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
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
