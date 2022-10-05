import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getColumns } from "../../app/features/columnsSlice";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { FaFilter } from "react-icons/fa";
import "./ReportsTable.css";
import { selectReports } from "../../app/features/reportsSlice";
import { format } from "date-fns";
import { selectApps } from "../../app/features/appSlice";
import { Report } from "../../app/type";
import { useSearchParams } from "react-router-dom";

export type IReportsTableProps = {
  dateDifference: number;
  setFilterColumn: Dispatch<SetStateAction<string>>;
};

const ReportsTable = ({
  dateDifference,
  setFilterColumn
}: IReportsTableProps) => {
  const [searchParams] = useSearchParams();
  const reportsColumns = useAppSelector((state: RootState) =>
    getColumns(state)
  );
  const reports = useAppSelector((state: RootState) => selectReports(state));
  const apps = useAppSelector((state: RootState) => selectApps(state));
  const [displayReports, setDisplayReports] = useState(reports);
  /* Check if any filters are there in the search params */
  useEffect(() => {
    /* Check for app_name params*/
    let tempReports = reports;
    let appNameParam = searchParams.get("app_name");
    searchParams.delete("start_date");
    searchParams.delete("end_date");
    searchParams.forEach((value, param) => {
      if (param === "app_name" && value !== null) {
        const allAppIds = apps
          .filter((app, index) =>
            app.app_name.startsWith(value.split("+").join(" ") as string)
          )
          .map((app, index) => app.app_id);
        tempReports = tempReports.filter((report, index) =>
          allAppIds.includes(report.app_id)
        );
      } else if (param === "fill_rate") {
        tempReports = tempReports.filter(
          (report, index) =>
            (report.requests / report.responses) * 100 <
            Number(value.split("-")[1])
        );
      } else if (param === "ctr") {
        tempReports = tempReports.filter(
          (report, index) =>
            (report.clicks / report.impressions) * 100 <
            Number(value.split("-")[1])
        );
      } else {
        console.log(param);
        tempReports = tempReports.filter(
          (report, index) => report[param] < Number(value.split("-")[1])
        );
      }
    });
    if (appNameParam !== null) {
      appNameParam = appNameParam.split("+").join(" ");
      console.log(appNameParam);
      const allAppIds = apps
        .filter((app, index) => app.app_name.startsWith(appNameParam as string))
        .map((app, index) => app.app_id);
      console.log(allAppIds);
      tempReports = tempReports.filter((report, index) =>
        allAppIds.includes(report.app_id)
      );
      console.log(tempReports);
    }
    setDisplayReports(tempReports);
  }, [searchParams, reports, apps]);
  /* Calculating value for each cell data*/
  const getCellData = (columnId: string, reportIndex: number) => {
    const numberFormatter = new Intl.NumberFormat("en-IN");
    switch (columnId) {
      case "date":
        return format(
          new Date(displayReports[reportIndex].date),
          "dd MMM yyyy"
        );
      case "app_name":
        const appName = apps.find(
          (app, index) => app.app_id === displayReports[reportIndex].app_id
        )?.app_name;
        if (appName === undefined) return "";
        if (appName.length > 10) {
          return `${appName?.slice(0, 10)}...`;
        } else {
          return appName;
        }
      case "clicks":
        return numberFormatter.format(displayReports[reportIndex].clicks);
      case "requests":
        return numberFormatter.format(displayReports[reportIndex].requests);
      case "responses":
        return numberFormatter.format(displayReports[reportIndex].responses);
      case "impressions":
        return numberFormatter.format(displayReports[reportIndex].impressions);
      case "revenue":
        return `$${displayReports[reportIndex].revenue.toFixed(2)}`;
      case "fill_rate":
        return `${(
          (displayReports[reportIndex].requests /
            displayReports[reportIndex].responses) *
          100
        ).toFixed(2)}%`;
      case "ctr":
        return `${(
          (displayReports[reportIndex].clicks /
            displayReports[reportIndex].impressions) *
          100
        ).toFixed(2)}%`;
    }
  };

  /* Getting column heading value */
  const getHeadingCellData = (columnId: string) => {
    switch (columnId) {
      case "date":
        return dateDifference + 1;
      case "app_name":
        return displayReports.length;
      case "clicks":
        return `${(
          (displayReports as Report[]).reduce(
            (accumulator: number, previousValue: Report) => {
              return accumulator + previousValue.clicks;
            },
            0
          ) / 1e6
        ).toFixed(2)}M`;
      case "requests":
        return `${(
          (displayReports as Report[]).reduce(
            (accumulator: number, previousValue: Report) => {
              return accumulator + previousValue.requests;
            },
            0
          ) / 1e6
        ).toFixed(2)}M`;
      case "responses":
        return `${(
          (displayReports as Report[]).reduce(
            (accumulator: number, previousValue: Report) => {
              return accumulator + previousValue.responses;
            },
            0
          ) / 1e6
        ).toFixed(2)}M`;
      case "impressions":
        return `${(
          (displayReports as Report[]).reduce(
            (accumulator: number, previousValue: Report) => {
              return accumulator + previousValue.impressions;
            },
            0
          ) / 1e6
        ).toFixed(2)}M`;
      case "revenue":
        const numberFormatter = new Intl.NumberFormat("en-IN");
        return `$${numberFormatter.format(
          Math.round(
            (displayReports as Report[]).reduce(
              (accumulator: number, previousValue: Report) => {
                return accumulator + previousValue.revenue;
              },
              0
            )
          )
        )}`;
      case "fill_rate":
        const totalFillRate =
          (displayReports as Report[]).reduce(
            (accumulator: number, previousValue: Report) => {
              return (
                accumulator +
                (previousValue.requests / previousValue.responses) * 100
              );
            },
            0
          ) / displayReports.length;
        if (isNaN(totalFillRate)) return `${0}%`;
        else return `${totalFillRate.toFixed(2)}`;
      case "ctr":
        const totalClickThroughRate =
          (displayReports as Report[]).reduce(
            (accumulator: number, previousValue: Report) => {
              return (
                accumulator +
                (previousValue.clicks / previousValue.impressions) * 100
              );
            },
            0
          ) / displayReports.length;
        if (isNaN(totalClickThroughRate)) return `${0}%`;
        else return `${totalClickThroughRate.toFixed(2)}%`;
    }
  };

  return (
    <table className="reports-table">
      <thead>
        <tr className="reports-table-row reports-table-heading-row">
          {reportsColumns
            .filter((column) => column.selected)
            .map((selectedColumn, index) => (
              <th
                className="reports-table-heading-cell"
                key={index}
                onClick={() => {
                  if (selectedColumn.id === "date") return;
                  setFilterColumn(selectedColumn.id);
                }}
              >
                <FaFilter className="filter-icon" />
                <h1 data-column-heading={selectedColumn.id}>
                  {selectedColumn.value}
                </h1>
                <p>{getHeadingCellData(selectedColumn.id)}</p>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {displayReports.map((report, reportIndex) => (
          <tr key={reportIndex} className="reports-table-row">
            {reportsColumns
              .filter((column) => column.selected)
              .map((selectedColumn, index) => (
                <td key={index} className="reports-table-cell">
                  {getCellData(selectedColumn.id, reportIndex)}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportsTable;
