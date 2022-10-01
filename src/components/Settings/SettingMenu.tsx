import React, { Dispatch, DragEvent, SetStateAction, useRef } from "react";
import {
  getSelectedColumns,
  setSelectedColumns
} from "../../app/features/selectedColumnsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

export type IProps = {
  setIsSettingMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const allColumns = [
  "Date",
  "App",
  "Clicks",
  "Ad Requests",
  "Ad Response",
  "Impression",
  "Revenue",
  "Fill Rate",
  "CTR"
];
const SettingMenu = ({ setIsSettingMenuOpen }: IProps) => {
  const columnContainerRef = useRef<HTMLUListElement | null>(null);
  const selectedColumns = useAppSelector((state: RootState) =>
    getSelectedColumns(state)
  );
  const dispatch = useAppDispatch();
  const handleDrag = (e: DragEvent<HTMLLIElement>) => {
    const draggedColumn = e.target;
    const { clientX: x, clientY: y } = e;
  };
  const handleOnDragStart = (e: DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).classList.add("dragging");
  };

  const handleOnDragEnd = (e: DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).classList.remove("dragging");
  };

  const handleOnDragOver = (e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    const draggedElement = document.querySelector(".dragging");

    /* 
      Steps to change order:
      - Get all the columns that are not in the dragging state.
      - Find the closest adjacent element in terms of clientX value.
      - If the clientX value is same, compare the clientY value. 
    */
    const adjacentElement = document.querySelectorAll(
      ".menu-column-container:"
    );
  };

  const toggleSelectedColumn = (e: React.MouseEvent<HTMLLIElement>) => {
    const clickedColumn = e.target as HTMLLIElement;
    clickedColumn.classList.toggle("selected");
  };

  const saveSettingMenuChanges = () => {
    /* Save the selected columns */

    /* 
      Steps: 
      - Convert HTMLCollection to Array.
      - Filter those element that contains 'selected' className
      - return the textContent.
    */
    const tempSelectedColumns = Array.from(
      (columnContainerRef.current as HTMLUListElement).children
    )
      .filter((element, index) => {
        return element.classList.contains("selected");
      })
      .map((element, index) => element.textContent);
    console.log(tempSelectedColumns);

    dispatch(setSelectedColumns(tempSelectedColumns as string[]));

    setIsSettingMenuOpen(false);
  };

  return (
    <div className="setting-menu">
      <h3>Dimension and Metrics</h3>
      <ul
        className="menu-column-container"
        ref={columnContainerRef}
        onDragOver={handleOnDragOver}
      >
        {allColumns.map((column, index) => (
          <li
            key={index}
            onClick={toggleSelectedColumn}
            className={`menu-column ${
              selectedColumns.includes(column) ? "selected" : ""
            }`}
            draggable
            onDrag={handleDrag}
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
          >
            {column}
          </li>
        ))}
      </ul>
      <div className="menu-footer">
        <button onClick={setIsSettingMenuOpen.bind(this, false)}>Close</button>
        <button onClick={saveSettingMenuChanges}>Apply Changes</button>
      </div>
    </div>
  );
};

export default SettingMenu;
