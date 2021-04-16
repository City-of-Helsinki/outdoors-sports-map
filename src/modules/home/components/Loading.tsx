import { useTranslation } from "react-i18next";

function Loading() {
  const { t } = useTranslation();

  return <div className="loading">{t("GENERAL.LOADING")}</div>;
}

export default Loading;
