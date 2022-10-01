export type AllReports = {
  cache_time: number;
  data: Report[];
};

export type Report = {
  date: string;
  app_id: number;
  requests: number;
  responses: number;
  impression: number;
  clicks: number;
  revenue: number;
};

export type AllApps = {
  cache_time: number;
  data: App[];
};

export type App = {
  app_id: number;
  app_name: string;
};
