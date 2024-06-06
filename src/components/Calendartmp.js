import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import Modal from "react-modal";
import Diary from "@/components/Diary"; // Diary 컴포넌트 import
import "../styles/globals.css";

const RenderHeader = ({
  currentMonth,
  prevMonth,
  nextMonth,
  prevHover,
  nextHover,
  isPrevHovering,
  notPrevHovering,
  isNextHovering,
  notNextHovering,
}) => {
  return (
    <div className="w-full flex flex-row justify-between items-baseline p-4 pl-8 pr-6 pt-8">
      <div className="col w-4/5 h-full flex flex-col justify-center items-start mr-1 col-start">
        <span className="text-l">
          <span className="text-4xl month mx-4 font-semibold text-gray-darkest">
            {format(currentMonth, "M")}
          </span>
          {format(currentMonth, "yyyy")}
        </span>
      </div>
      <div className="col w-1/5 h-full flex flex-row justify-end items-baseline ml-5 col-end">
        <Icon
          icon={`${
            prevHover ? "bi:arrow-left-circle-fill" : "bi:arrow-left-circle"
          }`}
          color="gray"
          className="w-3/12 h-full ml-3"
          onMouseOver={isPrevHovering}
          onMouseOut={notPrevHovering}
          onClick={prevMonth}
        />
        <Icon
          icon={`${
            nextHover ? "bi:arrow-right-circle-fill" : "bi:arrow-right-circle"
          }`}
          color="gray"
          className="w-3/12 h-full ml-3"
          onMouseOver={isNextHovering}
          onMouseOut={notNextHovering}
          onClick={nextMonth}
        />
      </div>
    </div>
  );
};

const RenderDays = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="days w-full h-fit p-1 px-4 row flex flex-row justify-between items-center ">
      {days.map((day, index) => (
        <div
          className={`col w-1/7 h-full flex flex-col pb-[10px] justify-end items-center px-1 ${
            index === 0 ? "text-orange-500" : index === 6 ? "text-blue-500" : "text-gray-900"
          }  font-bold border-gray-900 border-b-[1px]`}
          key={index}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

const RenderCells = ({
  currentMonth,
  selectedDate,
  onDateClick,
  feedback,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const nowDate = new Date();

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      days.push(
        <div className="w-1/6 h-5/6 flex flex-col justify-start items-center" key={day}>
          <div
            className={`col w-16 h-16  justify-center text-center grid grid-rows-5 items-center px-1 rounded-full cell ${
              !isSameMonth(day, monthStart)
                ? "disabled text-gray-500 border-[1px] border-gray-300"
                : isSameDay(day, nowDate)
                ? "selected bg-orange-500 text-gray-100 font-bold border-[1px] border-orange-700 hover:bg-blue-500  hover:border-[1px] hover:border-blue-700"
                : format(currentMonth, "M") !== format(day, "M")
                ? "not-valid "
                : isSameDay(day, selectedDate)
                ? "bg-blue-500 text-gray-100"
                : "valid bg-gray-100 border-[1px] border-gray-300 hover:bg-blue-500 hover:border-[1px] hover:border-blue-700 hover:text-gray-100"
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span
              className={`
                row-span-3
                ${
                  format(currentMonth, "M") !== format(day, "M")
                    ? "text not-valid"
                    : ""
                }
              `}
            >
              {formattedDate}
            </span>
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div
        className="row w-full h-full flex flex-row justify-between items-center py-2"
        key={day}
      >
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="body w-full h-5/7 flex flex-col justify-center items-center mb-3 mt-1 px-4">
      {rows}
    </div>
  );
};
export default function Calendar({ feedback }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDiary, setShowDiary] = useState(false); // 다이어리 표시 여부를 저장하는 상태

  const onDateClick = (day) => {
    setSelectedDate(day);
    setShowDiary(true); // 다이어리 표시 상태로 변경
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  
  const isPrevHovering = () => {
    setPrevHover(true);
  };
  
  const notPrevHovering = () => {
    setPrevHover(false);
  };
  
  const isNextHovering = () => {
    setNextHover(true);
  };
  
  const notNextHovering = () => {
    setNextHover(false);
  };
  
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);
  
  return (
    <div className="w-[95%] lg:w-4/5 h-full flex flex-col justify-center items-center rounded-3xl bg-gray-lightest text-gray-darkest shadow-xl">
      {!showDiary && ( // 다이어리가 표시되지 않았을 때만 캘린더를 렌더링합니다.
        <>
          <RenderHeader
            currentMonth={currentMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            prevHover={prevHover}
            nextHover={nextHover}
            isPrevHovering={isPrevHovering}
            notPrevHovering={notPrevHovering}
            isNextHovering={isNextHovering}
            notNextHovering={notNextHovering}
          />
          <RenderDays />
          <RenderCells
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            feedback={feedback}
          />
        </>
      )}
      {showDiary && <Diary />} {/* 다이어리가 표시되면 다이어리를 렌더링합니다. */}
    </div>
  );
}