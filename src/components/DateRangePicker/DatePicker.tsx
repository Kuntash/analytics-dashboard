import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaCalendarAlt } from "react-icons/fa";
import "./DatePicker.css";
import { DateRangeType } from "../../app/type";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

export type IProps = {
  selectionRange: DateRangeType;
  setSelectionRange: Dispatch<SetStateAction<DateRangeType>>;
};
const DatePicker = ({ selectionRange, setSelectionRange }: IProps) => {
  const [dateRangeDisplay, setDateRangeDisplay] = useState(
    "Please select a date range"
  );
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [countDateChange, setCountDateChange] = useState(0);
  const toggleDateRangePicker = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };
  const handleDateRangeChange = (ranges: RangeKeyDict) => {
    const {
      selectionRange: { endDate, startDate }
    } = ranges;
    if (endDate === undefined || startDate === undefined) {
      return;
    }
    setSelectionRange({
      startDate: startDate,
      endDate: endDate,
      key: "selectionRange"
    });
    searchParams.delete("start_date");
    searchParams.delete("end_date");
    searchParams.append("start_date", format(startDate, "yyyy-MM-dd"));
    searchParams.append("end_date", format(endDate, "yyyy-MM-dd"));
    setSearchParams(searchParams);
    /* TODO: Dispatch the api call whenever a new date range is selected */
    /* Mechanism to open and close the date range picker */
    if (countDateChange % 2 === 1) {
      toggleDateRangePicker();
    }
    setCountDateChange(countDateChange + 1);
  };
  useEffect(() => {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long"
    });
    const startDateString = dateFormatter.format(selectionRange.startDate);
    const endDateString = dateFormatter.format(selectionRange.endDate);
    setDateRangeDisplay(`${startDateString} - ${endDateString}`);
  }, [selectionRange]);
  return (
    <>
      <div className="date-range-container" onClick={toggleDateRangePicker}>
        <FaCalendarAlt className="date-range-icon" />
        <p>{dateRangeDisplay}</p>
      </div>
      {showDateRangePicker && (
        <DateRange
          minDate={new Date(2021, 5, 1)}
          maxDate={new Date(2021, 5, 30)}
          ranges={[selectionRange]}
          fixedHeight={true}
          className="date-range-picker"
          onChange={handleDateRangeChange}
          retainEndDateOnFirstSelection={true}
        />
      )}
    </>
  );
};

export default DatePicker;
