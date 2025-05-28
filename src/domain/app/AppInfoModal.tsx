import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";

type Props = {
  show: boolean;
  onClose: () => void;
};

function AppInfoModal({ show = false, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onClose} size="lg" animation={false}>
      <Modal.Header closeButton closeLabel={t("APP.MODAL.CLOSE")}>
        <Modal.Title>
          <h2>{t("APP.INFO_MENU.SERVICE_INFO")}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("APP.INFO_MODAL"),
          }}
        />
      </Modal.Body>
    </Modal>
  );
}

export default AppInfoModal;
