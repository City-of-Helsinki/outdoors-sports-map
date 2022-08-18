import { Notification } from "hds-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector,
//  useSelector
} from "react-redux";

import { fetchAppWideNotifications } from "./actions";
import { getData } from "./selectors";
//import { getAll } from "./selectors";

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAppWideNotifications({}));
  }, [])

  const notification = useSelector(getData);
  console.log('AppWideNotification', notification);

  const notificationContentTranslations: Record<string, string | undefined> = {
    fi: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_FI,
    sv: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_SV,
    en: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_EN,
  };
  const notificationContentTitleTranslations: Record<string, string | undefined> = {
    fi: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_FI,
    sv: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_SV,
    en: process.env.REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_EN,
  };
  const isNotificationEnabledEnvVariable =
    process.env.REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED;
  const isNotificationEnabled = isNotificationEnabledEnvVariable
    ? Boolean(JSON.parse(isNotificationEnabledEnvVariable))
    : null;

  const [isOpen, setOpen] = useState(() =>
    getInitialValue(sessionStorage.getItem(IS_OPEN_KEY), isNotificationEnabled)
  );

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
    sessionStorage.setItem(IS_OPEN_KEY, false.toString());
  };

  // return <button onClick={() => console.log(useSelector(getData))}></button>

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
