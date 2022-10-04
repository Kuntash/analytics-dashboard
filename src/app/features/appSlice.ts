import { createSlice } from "@reduxjs/toolkit";
import { App } from "../type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
const initialState: App[] | [] = [];

const appsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {
    setApps: (state, action: PayloadAction<App[]>) => {
      return action.payload;
    }
  }
});

export const { setApps } = appsSlice.actions;
export const selectAppById = (state: RootState, appId: number) =>
  state.apps.find((app, index) => app.app_id === appId);
export const selectApps = (state: RootState) => state.apps;
export default appsSlice.reducer;
