import { Notification } from "hds-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { fetchAppWideNotifications } from "./actions";
import { getData } from "./selectors";

const IS_OPEN_KEY = "ulkoliikunta:isAppWideNotificationOpen";

type NotificationProps = {
  initialState?: boolean;
};

export function AppWideNotification({initialState}: NotificationProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAppWideNotifications({}));
  }, [dispatch])

  const data = useSelector(getData);
  const notification = data && data[0];
  
  const notificationContentTranslations: Record<string, string | undefined> = {
    fi: notification ? notification.content.fi : '',
    sv: notification ? notification.content.sv : '',
    en: notification ? notification.content.en : '',
  };
  const notificationContentTitleTranslations: Record<string, string | undefined> = {
    fi: notification ? notification.title.fi : '',
    sv: notification ? notification.title.sv : '',
    en: notification ? notification.title.en : '',
  };

  const isNotificationEnabled = notification ? true : false;

  const [isOpen, setOpen] = useState(initialState);

  useEffect(() => {
    if (isNotificationEnabled && sessionStorage.getItem(IS_OPEN_KEY) !== notification.id.toString()) {
      setOpen(true); 
    }
  }, [isNotificationEnabled, notification])

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const lang = language.split("-")[0];
  const notificationContent = notificationContentTranslations[lang];
  const notificationTitle = notificationContentTitleTranslations[lang];

  if (!isNotificationEnabled && notificationContent) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(IS_OPEN_KEY, notification.id.toString());
  };

  return isOpen ? (
    <Notification
      label={notificationTitle}
      type="info"
      size="default"
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
