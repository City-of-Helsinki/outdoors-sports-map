import { Notification } from "hds-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const IS_OPEN_KEY = "ulkoliikunta:isAppWideNotificationOpen";

function getInitialValue(
  sessionStorageValue: string | null,
  isNotificationEnabled: boolean | null
) {
  if (sessionStorageValue) {
    return sessionStorage.getItem(IS_OPEN_KEY) === "true";
  }

  return isNotificationEnabled === true;
}

export function AppWideNotification() {
  const notificationContentTranslations: Record<string, string | undefined> = {
    fi: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_FI,
    sv: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_SV,
    en: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_EN,
  };
  const isNotificationEnabledEnvVariable =
    process.env.REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED;
  const isNotificationEnabled = isNotificationEnabledEnvVariable
    ? Boolean(JSON.parse(isNotificationEnabledEnvVariable))
    : null;

  const [isOpen, setOpen] = useState(
    getInitialValue(sessionStorage.getItem(IS_OPEN_KEY), isNotificationEnabled)
  );
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const notificationContent = notificationContentTranslations[language];

  if (!isNotificationEnabled && notificationContent) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(IS_OPEN_KEY, false.toString());
  };

  return isOpen ? (
    <Notification
      label={t("APP.NOTIFICATION_TITLE")}
      type="alert"
      size="small"
      dismissible
      closeButtonLabelText={t("APP.NOTIFICATION_CLOSE") as string}
      className="app-wide-notification"
      onClose={handleClose}
    >
      {notificationContent}
    </Notification>
  ) : null;
}

export default AppWideNotification;
