import { useTranslation } from "react-i18next";

import SMIcon from "../../common/components/SMIcon";

type Props = {
  onClose: () => void;
};

function AppAboutModal({ onClose }: Props) {
  const { t } = useTranslation();

  return (
    <div className="about-modal-backdrop">
      <div className="about-modal-box">
        <div className="about-modal-controls">
          <SMIcon icon="close" onClick={onClose} />
        </div>
        <div
          className="about-modal-content" // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("MAP.ABOUT"),
          }}
        />
      </div>
    </div>
  );
}

export default AppAboutModal;
