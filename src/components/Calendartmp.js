import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import Modal from "react-modal";
import Emotion from "@/components/Emotion";
import { db } from "@/firebase";
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
          <span className="text-4xl month mx-4 font-semibold text-gray-800">
            {format(currentMonth, "MM")}
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
          className="w-2/12 h-full ml-3"
          onMouseOver={isPrevHovering}
          onMouseOut={notPrevHovering}
          onClick={prevMonth}
        />
        <Icon
          icon={`${
            nextHover ? "bi:arrow-right-circle-fill" : "bi:arrow-right-circle"
          }`}
          color="gray"
          className="w-2/12 h-full ml-3 mr-5"
          onMouseOver={isNextHovering}
          onMouseOut={notNextHovering}
          onClick={nextMonth}
        />
      </div>
    </div>
  );
};

const RenderDays = () => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="mt-2 days w-full h-fit p-1 px-5 row flex flex-row justify-between items-center ">
      {days.map((day, index) => (
        <div
          className={`col w-1/6 h-full flex flex-col pb-[10px] justify-end items-center px-1 ${
            index === 0 ? "text-orange-500" : index === 6 ? "text-blue-500" : "text-gray-900"
          }  font-bold text-xl border-gray-900 border-b-[1px]`}
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
  dates,
  filteredDates
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
      const isDateInDates = dates && dates.includes(cloneDay);
      const isDateInFilteredDates = filteredDates && filteredDates.includes(cloneDay);
      const isDateInBoth = isDateInDates && isDateInFilteredDates;
      
      days.push(
        <div className="w-1/6 h-5/6 flex flex-col justify-start items-center" key={day}>
          <div
            className={`col w-14 h-16 justify-center text-center grid grid-rows-5 items-center px-1 rounded-full cell ${
              !isSameMonth(day, monthStart)
                ? "disabled text-gray-500 border-[1px] border-gray-400"
                : isSameDay(day, nowDate)
                ? "selected bg-gray-100 border-purple-500 font-bold border-[1px] border-purple-700 hover:bg-blue-300 hover:border-[1px] hover:border-blue-700"
                : format(currentMonth, "M") !== format(day, "M")
                ? "not-valid"
                : isSameDay(day, selectedDate)
                ? "bg-blue-500 text-gray-100"
                : isDateInBoth
                ? "bg-orange-300 text-white"
                : isDateInDates
                ? "bg-yellow-200 text-white"
                : isDateInFilteredDates
                ? "bg-red-300 text-white"
                : "valid bg-gray-100 border-[1px] border-gray-300 hover:bg-blue-300 hover:border-[1px] hover:border-blue-700 hover:text-gray-100"
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span
              className={`
                row-span-5 
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
    <div className="body w-full h-5/7 flex flex-col justify-center items-center mb-3 mt-1 px-5">
      {rows}
      <Modal
  isOpen={modalIsOpen}
  className="z-10 flex flex-col justify-start items-center bg-gray-lightest border-3 border-gray"
  contentLabel="Modal for calendar"
  onRequestClose={() => setModalIsOpen(false)}
  shouldCloseOnOverlayClick={false}
  style={{
    overlay: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    content: {
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      top: "auto",
      left: "auto",
      right: "auto",
      bottom: "auto",
      maxWidth: "60%", // 최대 너비 설정
      width: "40%", // 모달 내부 요소의 너비 설정
      maxHeight: "70%", // 최대 너비 설정
      height: "auto", // 모달 내부 요소의 너비 설정
      border: "2px solid black", // 모달의 경계선 설정
      borderRadius: "10px", // 모서리를 둥글게 설정
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      overflow: "hidden",
    },
  }}
>
        <div
          className={`w-full flex-row items-center p-3 px-6 grid grid-cols-10 text-xl text-gray-lightest rounded-t-[20px]`}
        >
        </div>
        <div
          className="flex w-full px-6 flex-col justify-start items-start overflow-hidden pb-5 no-scrollbar"
        >
          <div className={` w-full`}>
            
            {ndata ? (
              <>
              <div 
              className="px-2 flex justify-between items-center">
              <span
              className="font-bold text-2xl"
              >{selectedDate}</span>
              <div
              className="font-bold text-xl"
              >{ndata.emotion}</div>
              </div>
              <hr className="my-4 w-full border-purple-300"/>
              <div
              className="grid place-items-center">
              <img className="w-10/12 mt-3 border border-gray-300 rounded-xl mb-4 bg-white" src={ndata.image} />
              </div>
              <hr className="my-4 w-full border-purple-300"/>

          <div className="mt-2 h-12 break-words text-ellipsis overflow-hidden">
            {ndata.text}
          </div>




        <div className="flex justify-center"> {/* 버튼을 중앙에 정렬 */}
                <button
                  onClick={() => onDiaryOpen(ndata.date, ndata)}
                  className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
                >
                  전체보기
                </button>
                <span className="mx-4"></span> {/* 추가된 공백 */}
                <span>
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">닫기</button><br/></span>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
const Calendartmp = ({ onDiaryOpen, name, onMonthData, dates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [monthdata, setMonthData] = useState([]);
  const [ndata, setNdata] = useState(null);
  const [filteredDates, setFilteredDates] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);


  // 감정 필터링 핸들러
  const handleEmotion = (emo) => {
    const filteredData = monthdata.filter(item => item.emotion === emo);
    setFilteredDates(filteredData.map(item => item.date));
  };  

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 이전 달 화살표 호버링 핸들러
  const isPrevHovering = () => {
    setPrevHover(true);
  };

  const notPrevHovering = () => {
    setPrevHover(false);
  };

  // 다음 달 화살표 호버링 핸들러
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

  // 날짜 클릭 핸들러
  const onDateClick = (day) => {
    setSelectedDate(day);
    const ndata = monthdata.find(item => item.date === day);
    setNdata(ndata);
    ndata ? setModalIsOpen(true) : onDiaryOpen(day, ndata);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setSelectedDate(new Date());
    setModalIsOpen(false);
  };

  // 데이터베이스에서 데이터 가져오기
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
    onMonthData(data);
  };

  return (
    <div className="w-[95%] lg:w-4/5 h-full flex flex-col justify-center items-center rounded-3xl bg-purple-200 text-gray-darkest shadow-xl">
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
        dates={dates}
        filteredDates={filteredDates}
      />
    </div>
  );
};

export default Calendartmp;