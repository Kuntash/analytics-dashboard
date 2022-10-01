import React from "react";
import DatePicker from "../DateRangePicker/DatePicker";
import Settings from "../Settings/Settings";
import "./Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Analytics</h1>
      <div className="buttons-container">
        {/* Date Range Picker */}
        <DatePicker />
        {/* Setting Button */}
        <Settings />
      </div>
    </div>
  );
};

export default Dashboard;
