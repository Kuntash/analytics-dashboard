import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./features/reportsSlice";
import appReducer from "./features/appSlice";
import selectedColumnsReducer from "./features/selectedColumnsSlice";
export const store = configureStore({
  reducer: {
    reports: reportReducer,
    apps: appReducer,
    selectedColumns: selectedColumnsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
