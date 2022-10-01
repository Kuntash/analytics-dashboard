import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: {
  value: string;
  selected: boolean;
}[] = [
  { value: "Date", selected: true },
  { value: "App", selected: true },
  { value: "Clicks", selected: true },
  { value: "Ad Requests", selected: true },
  { value: "Ad Response", selected: true },
  { value: "Impression", selected: true },
  { value: "Revenue", selected: true },
  { value: "Fill Rate", selected: true },
  { value: "CTR", selected: true }
];
export const columnsSlice = createSlice({
  name: "selectedColumns",
  initialState,
  reducers: {
    setColumns: (
      state,
      action: PayloadAction<{ value: string; selected: boolean }[]>
    ) => {
      console.log("payload: ", action.payload);
      return action.payload;
    }
  }
});

export const { setColumns } = columnsSlice.actions;

export const getColumns = (state: RootState) => state.columns;
export default columnsSlice.reducer;
