import React, { useEffect, useRef, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaCalendarAlt } from "react-icons/fa";
import "./DatePicker.css";
const DatePicker = () => {
  const [dateRangeDisplay, setDateRangeDisplay] = useState(
    "Please select a date range"
  );
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(2021, 5, 1),
    endDate: new Date(2021, 5, 30),
    key: "selectionRange"
  });
  const [countDateChange, setCountDateChange] = useState(0);
  const toggleDateRangePicker = (e: React.MouseEvent) => {
    console.log();
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

    /* TODO: Dispatch the api call whenever a new date range is selected */
    /* Mechanism to open and close the date range picker */
    if (countDateChange % 2 === 1) {
      setShowDateRangePicker(!showDateRangePicker);
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
