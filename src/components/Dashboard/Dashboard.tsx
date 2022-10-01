import React, { useState } from "react";
import DatePicker from "../DateRangePicker/DatePicker";
import SettingButton from "../Settings/SettingButton";
import SettingMenu from "../Settings/SettingMenu";
import "./Dashboard.css";
const Dashboard = () => {
  /* boolean state to toggle Setting Menu's visibility */
  const [isSettingMenuOpen, setIsSettingMenuOpen] = useState(true);
  return (
    <div className="dashboard">
      <h1>Analytics</h1>
      <div className="buttons-container">
        {/* Date Range Picker */}
        <DatePicker />
        {/* Setting Button */}
        <SettingButton setIsSettingMenuOpen={setIsSettingMenuOpen} />
      </div>
      {isSettingMenuOpen && (
        <SettingMenu setIsSettingMenuOpen={setIsSettingMenuOpen} />
      )}
    </div>
  );
};

export default Dashboard;
