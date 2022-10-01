import React, { Dispatch, SetStateAction } from "react";
import "./Settings.css";
import { IoMdSettings } from "react-icons/io";

export type IProps = {
  setIsSettingMenuOpen: Dispatch<SetStateAction<boolean>>;
};
const SettingButton = ({ setIsSettingMenuOpen }: IProps) => {
  return (
    <button
      className="settings-button"
      onClick={() => {
        setIsSettingMenuOpen((prev) => !prev);
      }}
    >
      <IoMdSettings className="settings-icon" />
      <p>Settings</p>
    </button>
  );
};

export default SettingButton;
