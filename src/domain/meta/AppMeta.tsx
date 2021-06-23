import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function AppMeta() {
  const { t } = useTranslation();

  return (
    <Helmet>
      {/* OpenGraph app level meta */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t("APP.NAME")} />

      {/* Force summary card */}
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
}

export default AppMeta;
