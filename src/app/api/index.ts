import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AllApps, AllReports } from "../type";

export const greedyGameApi = createApi({
  reducerPath: "greedyGameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://go-dev.greedygame.com/v3/dummy/"
  }),

  endpoints: (builder) => ({
    getReportsByDate: builder.query<
      AllReports,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `report?startDate=${startDate}&endDate=${endDate}`
    }),
    getAllApps: builder.query<AllApps, void>({
      query: () => `apps`
    })
  })
});

export const { useGetReportsByDateQuery, useGetAllAppsQuery } = greedyGameApi;
