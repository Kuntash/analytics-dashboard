import React, { useEffect, useLayoutEffect, useState } from "react";
import { useGetAllAppsQuery, useGetReportsByDateQuery } from "../../app/api";
import { DateRangeType } from "../../app/type";
import DatePicker from "../DateRangePicker/DatePicker";
import SettingButton from "../Settings/SettingButton";
import SettingMenu from "../Settings/SettingMenu";
import { differenceInDays, format } from "date-fns";
import "./Dashboard.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectReports, setReports } from "../../app/features/reportsSlice";
import { selectApps, setApps } from "../../app/features/appSlice";
import ReportsTable from "../ReportsTable/ReportsTable";
import { RootState } from "../../app/store";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  /* boolean state to toggle Setting Menu's visibility */
  const dispatch = useAppDispatch();
  const [isSettingMenuOpen, setIsSettingMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectionRange, setSelectionRange] = useState<DateRangeType>({
    startDate: new Date(2021, 5, 1),
    endDate: new Date(2021, 5, 5),
    key: "selectionRange"
  });
  useEffect(() => {
    const paramStartDate = searchParams.get("start_date");
    const paramEndDate = searchParams.get("end_date");
    if (paramStartDate !== null && paramEndDate !== null) {
      setSelectionRange({
        startDate: new Date(paramStartDate),
        endDate: new Date(paramEndDate),
        key: "selectionRange"
      });
    }
  }, [searchParams]);
  const [filter, setFilter] = useState("");

  const { data: reportsData, isLoading: isReportsLoading } =
    useGetReportsByDateQuery({
      startDate: format(selectionRange.startDate, "yyyy-MM-dd"),
      endDate: format(selectionRange.endDate, "yyyy-MM-dd")
    });
  const { data: appsData, isLoading: isAppsLoading } = useGetAllAppsQuery();

  useEffect(() => {
    if (isReportsLoading || reportsData === undefined) {
      return;
    }
    dispatch(setReports(reportsData.data));
  }, [isReportsLoading, reportsData, dispatch]);

  useEffect(() => {
    if (isAppsLoading || appsData === undefined) {
      return;
    }
    dispatch(setApps(appsData.data));
  }, [isAppsLoading, appsData, dispatch]);
  return (
    <div className={`dashboard ${filter !== "" ? "dashboard-overlay" : ""}`}>
      <h1>Analytics</h1>
      <div className="buttons-container">
        {/* Date Range Picker */}
        <DatePicker
          selectionRange={selectionRange}
          setSelectionRange={setSelectionRange}
        />
        {/* Setting Button */}
        <SettingButton setIsSettingMenuOpen={setIsSettingMenuOpen} />
      </div>
      {isSettingMenuOpen && (
        <SettingMenu setIsSettingMenuOpen={setIsSettingMenuOpen} />
      )}

      <ReportsTable
        dateDifference={differenceInDays(
          selectionRange.endDate,
          selectionRange.startDate
        )}
        setFilterColumn={setFilter}
      />
      {filter !== "" &&
        {
          app_name: <SelectFilters columnId={filter} setColumnId={setFilter} />,
          requests: <SlideFilters columnId={filter} setColumnId={setFilter} />,
          responses: <SlideFilters columnId={filter} setColumnId={setFilter} />,
          impressions: (
            <SlideFilters columnId={filter} setColumnId={setFilter} />
          ),
          revenue: <SlideFilters columnId={filter} setColumnId={setFilter} />,
          fill_rate: <SlideFilters columnId={filter} setColumnId={setFilter} />,
          ctr: <SlideFilters columnId={filter} setColumnId={setFilter} />,
          clicks: <SlideFilters columnId={filter} setColumnId={setFilter} />
        }[filter]}
    </div>
  );
};

export default Dashboard;

export type SelectFilterProps = {
  columnId: string;
  setColumnId: React.Dispatch<React.SetStateAction<string>>;
};

const SelectFilters = (props: SelectFilterProps) => {
  const apps = useAppSelector((state: RootState) => selectApps(state));
  const [searchedApps, setSearchedApps] = useState(apps);
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [filterPosition, setFilterPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const appNameParam = searchParams.get("app_name");
    if (appNameParam === null) setInputValue("");
    else setInputValue(appNameParam);
  }, [searchParams]);

  useEffect(() => {
    setSearchedApps(apps);
  }, [apps]);

  useEffect(() => {
    const tempSearchedApps = apps.filter((app, index) =>
      app.app_name.startsWith(inputValue)
    );
    setSearchedApps(tempSearchedApps);
  }, [inputValue, apps]);

  useLayoutEffect(() => {
    const columnHeadingElement = document.querySelector(
      `[data-column-heading=${props.columnId}]`
    );
    if (columnHeadingElement === null) {
      return;
    }
    const columnHeadingBox = columnHeadingElement.getBoundingClientRect();
    const x = columnHeadingBox.left + 10;
    const y = columnHeadingBox.bottom + 10;
    if (window.innerWidth - columnHeadingBox.left < 300)
      setFilterPosition({
        x: columnHeadingBox.left - columnHeadingBox.width + 10,
        y: columnHeadingBox.bottom + 10
      });
    else
      setFilterPosition({
        x: x,
        y: y
      });
  }, [props.columnId]);
  return (
    <div
      className="select-filter"
      style={{ top: filterPosition.y, left: filterPosition.x }}
    >
      <h1>Select App</h1>
      <div className="search-container">
        <input
          value={inputValue}
          className="search-input"
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search"
        />
        <div className="searched-apps">
          {searchedApps.map((app, index) => (
            <div className="app" key={index}>
              <h5>{app.app_name}</h5>
              <p>{app.app_id}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        className="apply-filter-button"
        onClick={(e) => {
          if (inputValue === "") {
            searchParams.delete("app_name");
            setSearchParams(searchParams);
          } else {
            searchParams.delete("app_name");
            searchParams.append("app_name", inputValue);
            setSearchParams(searchParams);
          }
          props.setColumnId("");
        }}
      >
        Apply
      </button>
    </div>
  );
};

export type RangeFilterProps = {
  columnId: string;
  setColumnId: React.Dispatch<React.SetStateAction<string>>;
};
const SlideFilters = (props: RangeFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rangeValue, setRangeValue] = useState(0);
  const [maxColumnValue, setMaxColumnValue] = useState(0);
  const [sliderPosition, setSliderPosition] = useState({ x: 0, y: 0 });
  const reports = useAppSelector((state: RootState) => selectReports(state));

  /* Calculate max column value */

  useEffect(() => {
    let max = Number.MIN_SAFE_INTEGER;
    switch (props.columnId) {
      case "fill_rate":
        reports.forEach((report, index) => {
          if (max < (report.requests / report.responses) * 100) {
            max = (report.requests / report.responses) * 100;
          }
        });
        break;
      case "ctr":
        reports.forEach((report, index) => {
          if (max < (report.clicks / report.impressions) * 100) {
            max = (report.clicks / report.impressions) * 100;
          }
        });
        break;
      default:
        console.log(props.columnId);
        reports.forEach((report, index) => {
          console.log(report[props.columnId]);
          if (max < (report[props.columnId] as number)) {
            max = report[props.columnId] as number;
          }
        });
    }
    setMaxColumnValue(Math.round(max));
  }, [props.columnId, reports]);

  useEffect(() => {
    const rangeParam = searchParams.get(props.columnId);
    if (rangeParam === null) setRangeValue(maxColumnValue);
    else setRangeValue(Number(rangeParam.split("-")[1]));
  }, [searchParams, props.columnId, maxColumnValue]);

  useLayoutEffect(() => {
    const columnHeadingElement = document.querySelector(
      `[data-column-heading=${props.columnId}]`
    );
    if (columnHeadingElement === null) {
      return;
    }
    const columnHeadingBox = columnHeadingElement.getBoundingClientRect();
    const x = columnHeadingBox.left + 10;
    const y = columnHeadingBox.bottom + 10;

    if (window.innerWidth - columnHeadingBox.left < 300)
      setSliderPosition({
        x: columnHeadingBox.left - columnHeadingBox.width + 10,
        y: columnHeadingBox.bottom + 10
      });
    else
      setSliderPosition({
        x: x,
        y: y
      });
  }, [props.columnId]);
  return (
    <div
      className="slide-filter"
      style={{
        left: sliderPosition.x,
        top: sliderPosition.y
      }}
    >
      <input
        className="slide-input"
        type="range"
        min={0}
        value={rangeValue}
        onChange={(e) => {
          setRangeValue(Number(e.target.value));
        }}
        max={maxColumnValue}
      />
      <div className="range-values">
        <p>0</p>
        <p>{Intl.NumberFormat("en-IN").format(rangeValue)}</p>
      </div>
      <div className="slide-buttons">
        <button
          className="reset-slide"
          onClick={() => {
            searchParams.delete(props.columnId);
            setSearchParams(searchParams);
            props.setColumnId("");
          }}
        >
          Reset
        </button>
        <button
          className="apply-filter-button"
          onClick={() => {
            searchParams.delete(props.columnId);
            searchParams.append(props.columnId, `0-${rangeValue}`);
            setSearchParams(searchParams);
            props.setColumnId("");
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
/* 
  Implementing filters
  - Have a component that takes column_id as props
*/
