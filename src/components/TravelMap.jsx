// client/src/components/TravelMap.jsx
import React from "react";
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
} from "@react-google-maps/api";

// 날짜별 마커 색상 (빨, 파, 녹, 보, 노, 주)
const markerColors = [
  "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
];

const containerStyle = { width: "100%", height: "100%" }; // 부모 높이 따라감

const TravelMap = ({ plan, mapCenter, googleMapsApiKey }) => {
  const getAllCoordinates = () => {
    if (!plan || !plan.itinerary) return [];
    const coords = [];
    plan.itinerary.forEach((day) => {
      day.activities.forEach((act) => {
        coords.push({ lat: act.lat, lng: act.lng });
      });
    });
    return coords;
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
      >
        {/* 경로 선 그리기 */}
        <Polyline
          path={getAllCoordinates()}
          options={{
            strokeColor: "#555555",
            strokeOpacity: 0.6,
            strokeWeight: 4,
          }}
        />

        {/* 마커 찍기 */}
        {plan &&
          plan.itinerary.map((day, dayIdx) =>
            day.activities.map((act, actIdx) => {
              const iconUrl = markerColors[dayIdx % markerColors.length];
              const labelText = `${day.day}-${actIdx + 1}`;

              return (
                <Marker
                  key={`${day.day}-${actIdx}`}
                  position={{ lat: act.lat, lng: act.lng }}
                  icon={iconUrl}
                  label={{
                    text: labelText,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  title={act.place}
                />
              );
            })
          )}
      </GoogleMap>
    </LoadScript>
  );
};

export default TravelMap;
