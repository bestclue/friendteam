import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

import Modal from "react-modal";

import TodoList from "./TodoList";
import { TodoTable } from "./TodoList";
import AddModal from "./AddModal";

import { IBM_Plex_Sans_KR } from "next/font/google";
const ibmplex = IBM_Plex_Sans_KR({
  // preload: true, 기본값
  subsets: ["latin"], // 또는 preload: false
  weight: ["300", "400", "500", "700"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
});

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
          <span className="text-4xl month mx-4 font-semibold">
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
  const days = [];
  const date = ["Sun", "Mon", "Thu", "Wed", "Thrs", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const sunday = date[i] == "Sun";
    const saturday = date[i] == "Sat";
    days.push(
      <div
        className={`col w-1/6 h-full flex flex-col pb-[10px] justify-end items-center px-1 bg-neutral ${
          sunday ? "text-orange" : saturday ? "text-blue" : "text-gray-darkest"
        }  font-bold border-gray-darkest border-b-[1px]`}
        key={i}
      >
        {date[i]}
      </div>
    );
  }

  return (
    <div
      className={`days w-full h-fit p-1 px-4 row flex flex-row justify-between items-center `}
    >
      {days}
    </div>
  );
};
const RenderCells = ({
  currentMonth,
  selectedDate,
  onDateClick,
  modalIsOpen,
  setModalIsOpen,
  closeHover,
  isCloseHovering,
  notCloseHovering,
  closeModal,
  todos,
  data,
  todoLoading,
  delTodo,
  modiTodo,
  openModi,
  handleAdd,
  addTodos,
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

  //진행도 표시용
  const getButtonStyle = (progress) => {
    switch (progress) {
      case 0:
        return "text-gray-lightest";
      case 1:
        return "text-gray";
      case 2:
        return "text-orange-light";
      case 3:
        return "text-orange";
      default:
        return "text-gray-lightest";
    }
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      // Step 1: Filter todos and create an array of dates with todos
      const datesWithTodos = todos.filter((todo) => {
        const todoTimeStart = startOfDay(new Date(todo.timeStart));
        const todoTimeEnd = endOfDay(new Date(todo.timeEnd));
        return isWithinInterval(day, {
          start: todoTimeStart,
          end: todoTimeEnd,
          inclusive: true,
        });
      });
      const hasTodos = datesWithTodos.length > 0;
      //진행도에 따른 배열 생성
      var arr = [];
      if (hasTodos) {
        for (let i = 0; i < datesWithTodos.length; i++) {
          arr.push(datesWithTodos[i].progress);
        }
      }
      const cloneDay = day;
      days.push(
        <div className="w-1/6 h-5/6 flex flex-col justify-start items-center">
          <div
            className={`col w-16 h-16  justify-center text-center grid grid-rows-5 items-center px-1 rounded-full cell ${
              !isSameMonth(day, monthStart)
                ? "disabled text-gray border-[1px] border-gray-lgiht"
                : isSameDay(day, nowDate)
                ? "selected bg-orange text-gray-lightest font-bold border-[1px] border-orange-dark hover:bg-blue  hover:border-[1px] hover:border-blue-dark"
                : format(currentMonth, "M") !== format(day, "M")
                ? "not-valid "
                : isSameDay(day, selectedDate)
                ? "bg-blue text-gray-lightest"
                : "valid bg-gray-light border-[1px] border-gray hover:bg-blue hover:border-[1px] hover:border-blue-dark hover:text-gray-lightest"
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
            {/*진행도 배열에 따른 원 모양*/}
            <div className="w-12 flex flex-row justify-self-center justify-center flex-wrap content-center">
              {arr.map((el) => (
                <p
                  className={`justify-self-center h-3 mx-px text-[0.1rem] self-start ${getButtonStyle(
                    el
                  )}
                  )}`}
                  style={{
                    WebkitTextStroke: "1px black",
                    textStroke: "1px black",
                  }}
                >
                  ●
                </p>
              ))}
            </div>
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

  const customStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "600px",
      height: "400px",
      transform: "translate(-50%,-50%)",
      backgroundColor: "gray-lightest",
      boxShadow: "10px 20px 10px -10px rgba(0, 0, 0, 0.2)",
      padding: 0,
      border: 0,
      borderRadius: "20px",
    },
    overlay: {
      backgroundColor: "rgba(128,128,128, 0.3)",
    },
  };

  const filteredTodos = todos.filter((todo) => {
    const todoTimeStart = startOfDay(new Date(todo.timeStart));
    const todoTimeEnd = endOfDay(new Date(todo.timeEnd));
    return isWithinInterval(selectedDate, {
      start: todoTimeStart,
      end: todoTimeEnd,
      inclusive: true,
    });
  });

  //추가 모달창
  const [addIsOpen, setAddIsOpen] = useState(false);
  const OpenAddModal = () => {
    setAddIsOpen(true);
  };
  const closeAddModal = () => {
    setAddIsOpen(false);
  };

  //피드백 불러오기
  const feedToday = feedback.filter(
    (feedback) => feedback.date === format(selectedDate, "M월 d일")
  )[0];
  // console.log(feedToday);

  return (
    <div className="body w-full h-5/7 flex flex-col justify-center items-center mb-3 mt-1 px-4">
      {rows}
      <Modal
        isOpen={modalIsOpen}
        className="z-10 flex flex-col  justify-start items-center bg-gray-lightest border-3 border-gray"
        contentLabel="Modal for calendar"
        style={customStyles}
        onRequestClose={() => setModalIsOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <div
          className={`${ibmplex.className} w-full flex-row items-center p-3 px-6 grid grid-cols-10 bg-blue text-xl text-gray-lightest rounded-t-[20px]`}
        >
          <div className="col-span-6 text-xl font-semibold">
            {format(selectedDate, "MM월 dd일")} 일정
          </div>
          <button
            className="col-start-8 col-span-2 h-8 text-xs text-gray-lightest border-2 border-gray-lightest font-semibold rounded-full p-1 bg-blue\
          hover:text-blue hover:bg-gray-lightest"
            onClick={OpenAddModal}
          >
            일정 추가하기
          </button>
          <Icon
            color="white"
            className="col-span-1 ml-3 w-8 h-8 items-center justify-self-end"
            onMouseOver={isCloseHovering}
            onMouseOut={notCloseHovering}
            onClick={closeModal}
            icon={`carbon:close-${closeHover ? "filled" : "outline"}`}
          />
        </div>
        <div
          className="flex w-full px-6 flex-col justify-start items-start overflow-y-scroll pb-5 no-scrollbar"
          // onClick={closeModal}
        >
          {!todoLoading && (
            <TodoTable
              sortedTodos={filteredTodos}
              className="text-xs p-0 m-0"
              modiTodo={modiTodo}
              delTodo={delTodo}
              handleAdd={handleAdd}
              isDate={false}
            />
          )}
          <div className={`${ibmplex.className} mt-3 w-full`}>
            <p className="mb-3 text-lg font-bold underline decoration-wavy underline-offset-4">{`하루 마무리 기록`}</p>
            {feedToday ? (
              <div className="mx-1">
                <div className="flex flex-row items-center h-7">
                  <p className="font-semibold mb-1">{`✔ 하루 별점 : `}</p>
                  <p
                    className="text-6xl text-orange my-2 "
                    style={{ verticalAlign: "top" }}
                  >
                    {Array(feedToday.score).fill("•").join("")}
                  </p>
                  <p className="text-6xl text-gray my-2 ">
                    {Array(5 - feedToday.score)
                      .fill("•")
                      .join("")}
                  </p>
                </div>
                <div>
                  <p className="font-semibold mt-2 mb-1">{`✔ 칭찬할 점과 아쉬운 점, 개선할 점`}</p>
                  <p>{feedToday["reflection"]}</p>
                </div>
                <div>
                  <p className="font-semibold mt-2 mb-1">{`✔ 참고할 점`}</p>
                  <p>{feedToday["finish"]}</p>
                </div>
              </div>
            ) : (
              <p>기록이 존재하지 않습니다!</p>
            )}
          </div>
        </div>
      </Modal>
      <AddModal
        isOpen={addIsOpen}
        closeModal={closeAddModal}
        addfunc={addTodos}
        handleAdd={handleAdd}
        defaultDay={selectedDate}
        className="z-10 w-3/5 flex flex-col justify-start items-center bg-gray-lightest border-3 border-gray rounded-xl"
      />
    </div>
  );
};

const Calendar = ({
  data,
  todoLoading,
  todos,
  addTodos,
  delTodo,
  modiTodo,
  openModi,
  handleAdd,
  feedback,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

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

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    setModalIsOpen(true);
    setCloseHover(false);
    // console.log(day);
  };

  const closeModal = () => {
    // console.log("start", modalIsOpen);

    const day = new Date(1995, 11, 17);

    // console.log(day, modalIsOpen);
    setSelectedDate(day);
    setModalIsOpen(false);
    // console.log(day, modalIsOpen);
  };

  const isCloseHovering = () => {
    setCloseHover(true);
    //console.log("closeHover in mouseover:", closeHover);
  };
  const notCloseHovering = () => {
    setCloseHover(false);
    //console.log("closeHover in mouseout:", closeHover);
  };

  return (
    <div className="calendar w-full h-full">
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
        setSelectedDate={setSelectedDate}
        onDateClick={onDateClick}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        closeHover={closeHover}
        isCloseHovering={isCloseHovering}
        notCloseHovering={notCloseHovering}
        closeModal={closeModal}
        todos={todos}
        data={data}
        todoLoading={todoLoading}
        delTodo={delTodo}
        modiTodo={modiTodo}
        openModi={openModi}
        handleAdd={handleAdd}
        addTodos={addTodos}
        feedback={feedback}
      />
    </div>
  );
};
export default Calendar;
