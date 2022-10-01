import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./features/reportsSlice";
import appReducer from "./features/appSlice";
import columnsReducer from "./features/columnsSlice";
export const store = configureStore({
  reducer: {
    reports: reportReducer,
    apps: appReducer,
    columns: columnsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
