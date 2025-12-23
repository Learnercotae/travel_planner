// client/src/App.jsx
import { useState } from "react";
import SearchForm from "./components/SearchForm";
import TravelMap from "./components/TravelMap";
import ItineraryList from "./components/ItineraryList";
import "./App.css";

const defaultCenter = { lat: 37.5665, lng: 126.978 };

// ★* 구글 맵 키 보안 주의
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  const [destination, setDestination] = useState(""); // 빈값 초기화
  const [startDate, setStartDate] = useState("2024-06-01");
  const [endDate, setEndDate] = useState("2024-06-03");
  const [budget, setBudget] = useState("적당하게");

  // [신규] 여행 목적 상태 추가 (기본값: 맛집 탐방)
  const [travelPurpose, setTravelPurpose] = useState("맛집 탐방");

  const [plan, setPlan] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultMode, setIsResultMode] = useState(false);

  const handleSearch = async () => {
    if (!destination || !startDate || !endDate) {
      alert("모든 정보를 입력해주세요!");
      return;
    }

    setIsLoading(true);

    try {
      // 서버 요청 시 travelPurpose 추가 전송
      const response = await fetch("http://localhost:8080/api/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          budget,
          travelPurpose,
        }),
      });
      const data = await response.json();

      setPlan(data);

      if (
        data.itinerary &&
        data.itinerary.length > 0 &&
        data.itinerary[0].activities.length > 0
      ) {
        const firstPlace = data.itinerary[0].activities[0];
        setMapCenter({ lat: firstPlace.lat, lng: firstPlace.lng });
      }

      setIsResultMode(true);
    } catch (error) {
      alert("서버 연결 실패! 터미널을 확인해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocusOnPlace = (lat, lng) => {
    setMapCenter({ lat, lng });
  };

  const handleReset = () => {
    setIsResultMode(false);
    // setPlan(null); // 필요시 초기화
  };

  return (
    <>
      {!isResultMode && (
        <div className="home-container">
          <h1 className="home-title">✈️ AI 맞춤 여행 플래너</h1>
          <SearchForm
            destination={destination}
            setDestination={setDestination}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            budget={budget}
            setBudget={setBudget}
            /* [신규] props 전달 */
            travelPurpose={travelPurpose}
            setTravelPurpose={setTravelPurpose}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
      )}

      {isResultMode && (
        <div className="result-container">
          <div className="result-header">
            <h2 className="result-title">
              {/* 제목에 여행 목적도 같이 보여주기 */}
              {destination} {travelPurpose} 여행 🗺️
            </h2>
            <button className="back-btn" onClick={handleReset}>
              🔄 다시 검색하기
            </button>
          </div>

          <div className="result-content">
            <div className="map-area">
              <TravelMap
                plan={plan}
                mapCenter={mapCenter}
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
              />
            </div>

            <div className="list-area">
              <ItineraryList plan={plan} onPlaceClick={handleFocusOnPlace} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
