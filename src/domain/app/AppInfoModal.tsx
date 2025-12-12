import {Button, Dialog, IconInfoCircle} from "hds-react";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";

import { MODAL_WIDTH } from "../constants";

type Props = {
  focusAfterCloseRef?: RefObject<HTMLElement>;
  show: boolean;
  onClose: () => void;
};

function AppInfoModal({ focusAfterCloseRef, show = false, onClose }: Props) {
  const { t } = useTranslation();

  const titleId = "info-dialog-title";

  return (
    <Dialog
        id="info-dialog"
        aria-labelledby={titleId}
        isOpen={show}
        close={onClose}
        closeButtonLabelText={t("APP.MODAL.CLOSE")}
        focusAfterCloseRef={focusAfterCloseRef}
        style={{width: MODAL_WIDTH}}
      >
        <Dialog.Header
          id={titleId}  
          title={t("APP.INFO_MENU.SERVICE_INFO")}
          iconStart={<IconInfoCircle />}
        />
        <Dialog.Content className="outdoor-exercise-map-modal-content">
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t("APP.INFO_MODAL"),
            }}
          />
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button onClick={onClose}>
            {t("APP.MODAL.CLOSE")}
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
  );
}

export default AppInfoModal;
