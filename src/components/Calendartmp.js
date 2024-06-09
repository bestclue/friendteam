import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import Modal from "react-modal";
import Diary from "@/components/Diary";
import "../styles/globals.css";
import Emotion from "@/components/Emotion";

import { db, storage } from "@/firebase";

import { doc, collection, addDoc, setDoc, getDocs, query, where } from "firebase/firestore";


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
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  ndata,
  onDiaryOpen,
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
    
      const cloneDay = parseInt(new Date(day.getTime() + 86400000).toISOString().slice(0,10).replace(/-/g,''));
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
      <Modal
        isOpen={modalIsOpen}
        className="z-10 flex flex-col  justify-start items-center bg-gray-lightest border-3 border-gray"
        contentLabel="Modal for calendar"
        onRequestClose={() => setModalIsOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <div
          className={`w-full flex-row items-center p-3 px-6 grid grid-cols-10 bg-blue text-xl text-gray-lightest rounded-t-[20px]`}
        >

        </div>
        <div
          className="flex w-full px-6 flex-col justify-start items-start overflow-y-scroll pb-5 no-scrollbar"
        >
          <div className={`mt-3 w-full`}>
          <button onClick={closeModal} >닫기</button>
            {ndata?
            <>
                <span>{`내용: ${ndata.text}`}</span>
                <span>{`감정: ${ndata.emotion}`}</span>
                <img src={ndata.image}/>
                <button
                  onClick={() => onDiaryOpen(ndata.date, ndata[0])}
                  className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                  전체보기
                </button>
              </>
              :<></>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Calendartmp = ({ onDiaryOpen, name }) => { // 변경: 다이어리 열기 함수를 props로 전달
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [monthdata, setMonthData] = useState([]);
  const [filtered, setFiltered] = useState();
  const [ndata, setNdata] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleEmotion = (emo) => {
    setFiltered(monthdata.filter(item => item.emotion === emo));
  }


  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
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
    fetchData();
  }, [currentMonth]);


  const onDateClick = (day) => {
    setSelectedDate(day);
    const ndata = monthdata.find(item => item.date === day);
    setNdata(ndata);
    ndata?setModalIsOpen(true):onDiaryOpen(day,ndata);
  };

  const closeModal = () => {
    setSelectedDate(new Date());
    setModalIsOpen(false);
  };


  const fetchData = async () => {
    const startDate = parseInt(currentMonth.toISOString().slice(0,7).replace('-',''))*100;
    const endDate = parseInt(currentMonth.toISOString().slice(0,7).replace('-',''))*100+31;
  
    const q = query(
      collection(db, "diaryEntries"),
      where("name", "==", `${name}`),
      where("date", "<=", endDate),
      where("date", ">=", startDate),
    );
  
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({id:doc.id, ...doc.data() });
    });
  
    setMonthData(data);
  };
  


  return (
    <div className="w-[95%] lg:w-4/5 h-full flex flex-col justify-center items-center rounded-3xl bg-gray-lightest text-gray-darkest shadow-xl">
      <Emotion 
        onEmotion={handleEmotion}
      />
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
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        closeModal={closeModal}
        ndata={ndata}
        onDiaryOpen={onDiaryOpen}
      />
    </div>
  );
};

export default Calendartmp;
