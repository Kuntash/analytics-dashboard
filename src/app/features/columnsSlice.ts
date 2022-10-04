import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: {
  value: string;
  selected: boolean;
  id: string;
}[] = [
  { value: "Date", selected: true, id: "date" },
  { value: "App", selected: true, id: "app_name" },
  { value: "Clicks", selected: true, id: "clicks" },
  { value: "Ad Requests", selected: true, id: "requests" },
  { value: "Ad Response", selected: true, id: "responses" },
  { value: "Impressions", selected: true, id: "impressions" },
  { value: "Revenue", selected: true, id: "revenue" },
  { value: "Fill Rate", selected: true, id: "fill_rate" },
  { value: "CTR", selected: true, id: "ctr" }
];
export const columnsSlice = createSlice({
  name: "selectedColumns",
  initialState,
  reducers: {
    setColumns: (
      state,
      action: PayloadAction<{ value: string; selected: boolean; id: string }[]>
    ) => {
      console.log("payload: ", action.payload);
      return action.payload;
    }
  }
});

export const { setColumns } = columnsSlice.actions;

export const getColumns = (state: RootState) => state.columns;
export default columnsSlice.reducer;
