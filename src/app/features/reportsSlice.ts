import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Report } from "../type";
import { RootState } from "../store";

const initialState: Report[] | [] = [];
export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      return action.payload;
    },
    resetReports: (state) => {
      return [];
    }
  }
});

export const { setReports, resetReports } = reportsSlice.actions;

export const selectReports = (state: RootState) => state.reports;
export default reportsSlice.reducer;
