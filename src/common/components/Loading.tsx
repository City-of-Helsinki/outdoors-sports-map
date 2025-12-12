import { LoadingSpinner } from "hds-react";
import { useTranslation } from "react-i18next";

function Loading() {
  const { t } = useTranslation();
  const loadingText = t("GENERAL.LOADING");
  const loadingFinishedText = t("GENERAL.LOADING_FINISHED");

  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        <LoadingSpinner
          loadingText={loadingText}
          loadingFinishedText={loadingFinishedText}
          small
        />
        {loadingText}
      </div>
    </div>
  );
}

export default Loading;
