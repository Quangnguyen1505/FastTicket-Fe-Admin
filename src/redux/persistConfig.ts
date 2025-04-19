import storage from "redux-persist/lib/storage";
import { PersistConfig } from "redux-persist";
import { RootState } from "./rootReducer"; // hoặc đúng path của bạn

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

export default persistConfig;