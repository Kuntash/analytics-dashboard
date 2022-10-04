import React, { Dispatch, DragEvent, SetStateAction, useRef } from "react";
import { getColumns, setColumns } from "../../app/features/columnsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

export type IProps = {
  setIsSettingMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const SettingMenu = ({ setIsSettingMenuOpen }: IProps) => {
  const columnContainerRef = useRef<HTMLUListElement | null>(null);
  const allColumns = useAppSelector((state: RootState) => getColumns(state));
  const dispatch = useAppDispatch();

  const handleOnDragStart = (e: DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).classList.add("dragging");
  };

  const handleOnDragEnd = (e: DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).classList.remove("dragging");
  };

  const handleOnDragOver = (e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    const draggedElement = document.querySelector(".dragging") as HTMLLIElement;

    const draggingElementXCenter = e.clientX;
    const draggingElementYCenter = e.clientY;
    /* 
      Steps to change order:
      - Get all the columns that are not in the dragging state.
      - filter the element by:
        - The x center of the element has to be on the right side of x center of 
          draggedElement.
        - 
      - Find the closest adjacent element in terms of clientX value.
      - If the clientX value is same, compare the clientY value. 
    */
    const adjacentElements = Array.from(
      document.querySelectorAll(".menu-column:not(.dragging)")
    );
    let closestAfter: Element | null = null,
      closestXDifferenceAfter = Number.MAX_SAFE_INTEGER;
    let closestBefore: Element | null = null,
      closestBeforeIndex = Number.MIN_SAFE_INTEGER;
    adjacentElements.forEach((element, index) => {
      const elementDomRect = element.getBoundingClientRect();
      const xCenter = elementDomRect.left + elementDomRect.width / 2;
      const xCenterDifferenceAfter = xCenter - draggingElementXCenter;
      const xCenterDifferenceBefore = draggingElementXCenter - xCenter;
      if (
        xCenterDifferenceAfter > 0 &&
        xCenterDifferenceAfter < closestXDifferenceAfter &&
        draggingElementYCenter > elementDomRect.top &&
        draggingElementYCenter < elementDomRect.bottom
      ) {
        closestAfter = element;
        closestXDifferenceAfter = xCenterDifferenceAfter;
      }
      if (
        xCenterDifferenceBefore > 0 &&
        xCenterDifferenceBefore < closestXDifferenceAfter &&
        draggingElementYCenter > elementDomRect.top &&
        draggingElementYCenter < elementDomRect.bottom
      ) {
        closestBefore = element;
        closestBeforeIndex = index;
      }
    });
    console.log("------------------------------------------");
    console.log(closestAfter, closestBefore);
    if (closestAfter !== null) {
      (columnContainerRef.current as HTMLUListElement).insertBefore(
        draggedElement,
        closestAfter
      );
    } else if (closestBefore !== null) {
      (columnContainerRef.current as HTMLUListElement).insertBefore(
        draggedElement,
        adjacentElements[closestBeforeIndex + 1]
      );
    }
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
    const tempColumns = Array.from(
      (columnContainerRef.current as HTMLUListElement)
        .children as HTMLCollectionOf<HTMLElement>
    ).map((element, index) => {
      if (element.classList.contains("selected")) {
        return {
          selected: true,
          value: element.textContent as string,
          id: element.dataset.columnId as string
        };
      } else {
        return {
          selected: false,
          value: element.textContent as string,
          id: element.dataset.columnId as string
        };
      }
    });

    dispatch(setColumns(tempColumns));

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
            data-column-id={column.id}
            key={index}
            onClick={toggleSelectedColumn}
            className={`menu-column ${column.selected ? "selected" : ""}`}
            draggable
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
          >
            {column.value}
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
