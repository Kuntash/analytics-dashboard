import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = [
  "Date",
  "App",
  "Clicks",
  "Ad Requests",
  "Ad Response",
  "Impression",
  "Revenue",
  "Fill Rate",
  "CTR"
];
export const selectedColumnsSlice = createSlice({
  name: "selectedColumns",
  initialState,
  reducers: {
    setSelectedColumns: (state, action: PayloadAction<string[]>) => {
      console.log("payload: ", action.payload);
      return action.payload;
    },
    removeFromSelectedColumns: (state, action: PayloadAction<string>) => {
      state = state.filter((column, index) => column !== action.payload);
    }
  }
});

export const { setSelectedColumns, removeFromSelectedColumns } =
  selectedColumnsSlice.actions;

export const getSelectedColumns = (state: RootState) => state.selectedColumns;
export default selectedColumnsSlice.reducer;
