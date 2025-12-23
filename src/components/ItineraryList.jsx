// client/src/components/ItineraryList.jsx
import React from "react";

const ItineraryList = ({ plan, onPlaceClick }) => {
  // 1. plan 자체가 없거나, plan.itinerary 배열이 없을 때 안전하게 처리
  if (!plan || !plan.itinerary) {
    return (
      <div className="empty-state">
        <p style={{ fontSize: "50px", margin: "0 0 20px 0" }}>🗺️</p>
        <p>
          여행 정보를 입력하고
          <br />
          <strong>'일정 생성'</strong> 버튼을 눌러주세요!
        </p>
      </div>
    );
  }

  const colors = ["red", "blue", "green", "purple", "orange"];

  return (
    <>
      {/* 2. 안전하게 배열이 있을 때만 map 실행 */}
      {plan.itinerary.map((day, dayIdx) => (
        <div key={day.day} className="day-section">
          <h3
            className="day-header"
            style={{ borderColor: colors[dayIdx % colors.length] }}
          >
            📅 Day {day.day} ({day.date})
          </h3>
          <ul style={{ paddingLeft: "0", listStyle: "none" }}>
            {day.activities.map((act, actIdx) => (
              <li
                key={actIdx}
                className="place-item"
                // 3. onPlaceClick 함수가 진짜 있을 때만 실행 (앱 멈춤 방지)
                onClick={() => {
                  if (typeof onPlaceClick === "function") {
                    onPlaceClick(act.lat, act.lng);
                  } else {
                    console.warn(
                      "App.jsx에서 onPlaceClick 함수가 전달되지 않았습니다."
                    );
                  }
                }}
              >
                <div className="place-header">
                  <span
                    className="place-index"
                    style={{ color: colors[dayIdx % colors.length] }}
                  >
                    [{day.day}-{actIdx + 1}]
                  </span>
                  <strong className="place-name">{act.place}</strong>
                </div>
                <p className="place-desc">{act.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default ItineraryList;
