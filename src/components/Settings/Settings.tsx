import React from "react";
import "./Settings.css";
import { IoMdSettings } from "react-icons/io";
const Settings = () => {
  return (
    <div className="settings-button">
      <IoMdSettings className="settings-icon" />
      <p>Settings</p>
    </div>
  );
};

export default Settings;
