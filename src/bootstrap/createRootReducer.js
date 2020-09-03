import { combineReducers } from 'redux';
import unitReducer from '../modules/unit/reducer';
import mapReducer from '../modules/map/reducer';
import languageReducer from '../modules/language/reducer';
import searchReducer from '../modules/search/reducer';
import serviceReducer from '../modules/service/reducer';

const createRootReducer = () => combineReducers({
  language: languageReducer,
  unit: unitReducer,
  map: mapReducer,
  search: searchReducer,
  service: serviceReducer,
});

export default createRootReducer;
