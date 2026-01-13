import { IconHome, Button, ButtonVariant } from "hds-react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Page from "../../common/a11y/Page";
import useLanguage from "../../common/hooks/useLanguage";

function NotFound() {
  const { t } = useTranslation();
  const history = useHistory();
  const language = useLanguage();

  const handleGoHome = () => {
    history.push(`/${language}/`);
  };

  return (
    <Page
      title={t("APP.NOT_FOUND.TITLE")}
      description={t("APP.NOT_FOUND.DESCRIPTION")}
      className="not-found"
    >
      <div className="not-found__container">
        <div className="not-found__content">
          <h1 className="not-found__title">404</h1>
          <h2 className="not-found__subtitle">{t("APP.NOT_FOUND.TITLE")}</h2>
          <p className="not-found__description">{t("APP.NOT_FOUND.DESCRIPTION")}</p>
          
          <div className="not-found__actions">
            <Button
              iconStart={<IconHome aria-hidden="true" />}
              onClick={handleGoHome}
              variant={ButtonVariant.Secondary}
            >
              {t("APP.NOT_FOUND.GO_HOME")}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default NotFound;