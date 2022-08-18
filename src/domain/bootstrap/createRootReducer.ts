import { combineReducers } from "redux";

import appWideNotificationReducer from "../app/appWideNotification/reducer";
import languageReducer from "../i18n/state/reducer";
import mapReducer from "../map/state/reducer";
import serviceReducer from "../service/reducer";
import unitReducer from "../unit/state/reducer";
import searchReducer from "../unit/state/search/reducer";

const createRootReducer = () =>
  combineReducers({
    language: languageReducer,
    unit: unitReducer,
    map: mapReducer,
    search: searchReducer,
    service: serviceReducer,
    appWideNotification: appWideNotificationReducer,
  });

export default createRootReducer;
