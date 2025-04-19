import { combineReducers } from "@reduxjs/toolkit";
import auth from "./slices/user";

const rootReducer = combineReducers({
  auth, 
});

export default rootReducer;
export type RootReducerType = typeof rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
