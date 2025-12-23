// client/src/components/SearchForm.jsx
import React from "react";

const SearchForm = ({
  destination,
  setDestination,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  budget,
  setBudget,
  onSearch,
  isLoading,
  travelPurpose,
  setTravelPurpose,
}) => {
  return (
    <div className="search-box-home">
      {/* 여행지 입력 */}
      <div className="input-group">
        <label className="input-label">떠나고 싶은 곳</label>
        <input
          className="home-input"
          type="text"
          placeholder="가고싶은곳을 입력해주세요."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* 날짜 입력 (가로로 배치) */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">가는 날</label>
          <input
            className="home-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">오는 날</label>
          <input
            className="home-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="input-group" style={{ flex: 1 }}>
        <label className="input-label">여행 목적</label>
        <select
          className="home-input"
          value={travelPurpose}
          onChange={(e) => setTravelPurpose(e.target.value)}
        >
          <option value="맛집 탐방">맛집 탐방 🍔</option>
          <option value="기념품 쇼핑">기념품 쇼핑 🛍️</option>
          <option value="옷 쇼핑">옷 쇼핑 🛍️</option>
          <option value="힐링/휴식">힐링/휴식 🌿</option>
          <option value="관광/명소">관광/명소 📸</option>
          <option value="액티비티">액티비티 🏄‍♂️</option>
        </select>
      </div>

      {/* 예산 선택 */}
      <div className="input-group">
        <label className="input-label">여행 스타일</label>
        <select
          className="home-input"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        >
          <option value="가성비">💰 알뜰하게 (가성비)</option>
          <option value="적당하게">⚖️ 적당하게</option>
          <option value="럭셔리">💎 럭셔리하게</option>
        </select>
      </div>

      {/* 생성 버튼 (하단에 크게 배치) */}
      <button
        className="big-generate-btn"
        onClick={onSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          "✨ 나만의 여행 일정 만들기"
        )}
      </button>
    </div>
  );
};

export default SearchForm;
