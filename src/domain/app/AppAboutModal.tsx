import Modal from "react-bootstrap/modal";
import { useTranslation } from "react-i18next";

type Props = {
  show: boolean;
  onClose: () => void;
};

function AppAboutModal({ show = false, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onClose} size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h2>{t("APP.NAME")}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("APP.ABOUT_MODAL"),
          }}
        />
      </Modal.Body>
    </Modal>
  );
}

export default AppAboutModal;
