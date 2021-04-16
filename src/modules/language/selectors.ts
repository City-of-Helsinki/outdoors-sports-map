import { RootState } from "../../bootstrap/createStore";

const getLanguage = (state: RootState) => state.language;

export default getLanguage;
