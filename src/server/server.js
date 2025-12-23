// server/server.js
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 8080;

// ★ 보안 경고: 키 관리 주의하세요!
const genAI = new GoogleGenerativeAI("AIzaSyBawW2UMOsk2-Qxgsfd2lkR7XNeU8Wek5g");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.post("/api/travel-plan", async (req, res) => {
  const { destination, startDate, endDate, budget, travelPurpose } = req.body;
  console.log(
    `✈️ 요청: ${destination} [테마: ${travelPurpose}, 예산: ${budget}]`
  );

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // [핵심 변경] 목적에 따라 프롬프트 내용을 아예 갈아끼웁니다.
    let themeInstruction = "";

    if (travelPurpose === "옷 쇼핑") {
      themeInstruction = `
        [옷 쇼핑 - 필수 지침]
        1. 너는 지금부터 "스트릿 패션 및 브랜드 전문 바이어"야. 일반 관광지는 절대 추천하지 마.
        2. "쇼핑몰"이나 "백화점" 같은 뭉뚱그린 장소명은 금지야. **구체적인 브랜드 매장 이름**을 써. (예: '캐널시티' (X) -> '스투시 하카타 챕터' (O))
        3. 우선순위 브랜드: **Supreme(슈프림), Stussy(스투시), Human Made(휴먼메이드), Montbell(몽벨), Beams(빔즈), Union, Noah, Capital, A Bathing Ape** 등 트렌디한 브랜드의 **단독 매장(Flagship Store)** 위주로 동선을 짜.
        4. 동선은 브랜드 매장끼리 가까운 곳으로 묶어줘.
        5. 식사도 쇼핑 구역 근처의 힙한 카페나 간단한 맛집으로 배치해.
      `;
    } else if (travelPurpose === "기념품 쇼핑") {
      themeInstruction = `
        [기념품 쇼핑 - 필수 지침]
        1. 너는 "기념품 전문 큐레이터"야.
        2. 돈키호테, 산리오 갤러리, 지브리샵(동구리 공화국), 포켓몬 센터, 공항 면세점, 지역 특산물 가게, 다이소, 드럭스토어 위주로 배치해.
        3. 가족이나 친구에게 선물하기 좋은 아기자기한 곳 위주로 짜줘.
      `;
    } else if (travelPurpose === "맛집 탐방") {
      themeInstruction = `
        [맛집 탐방 - 필수 지침]
        1. 하루 4끼 이상(아침, 점심, 간식, 저녁, 야식) 추천해.
        2. 관광객용 식당보다는 '현지인 노포', '구글 맵 평점 4.0 이상', '미슐랭 빕구르망' 위주로 짜.
        3. 메뉴가 겹치지 않게 (라멘 -> 스시 -> 야키니쿠 -> 디저트) 분배해.
      `;
    } else {
      // 그 외 (힐링, 관광 등)
      themeInstruction = `
        [${travelPurpose} - 필수 지침]
        사용자의 여행 목적(${travelPurpose})에 딱 맞는 장소를 80% 이상 배치해.
        뻔한 관광지보다는 테마에 충실한 장소를 선정해줘.
      `;
    }

    const prompt = `
      여행지: ${destination}
      기간: ${startDate} ~ ${endDate}
      예산: ${budget}
      목적: ${travelPurpose}

      ${themeInstruction}

      [공통 요구사항]
      1. 장소명(place)은 반드시 **구체적인 가게 이름**으로 적어. (예: '하카타역' 대신 '하카타역 포켓몬센터')
      2. 'desc'에는 왜 이곳이 ${travelPurpose}에 맞는지 설명해줘. (예: "후쿠오카 한정판을 파는 곳")
      3. 동선이 꼬이지 않게 가까운 지역끼리 묶어줘.
      4. 위도(lat), 경도(lng) 필수.
      5. JSON 형식 준수.

      [JSON 응답 형식]
      {
        "itinerary": [
          {
            "day": 1,
            "date": "YYYY-MM-DD",
            "activities": [
              { "place": "Supreme Fukuoka", "lat": 33.585, "lng": 130.395, "desc": "오픈런 필수, 최신 드롭 아이템 확인" }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("🤖 Gemini(목적별 상세) 응답 완료");

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(text);

    res.json(parsedData);
  } catch (error) {
    console.error("❌ 에러 발생:", error);
    res.json({ message: "실패", itinerary: [] });
  }
});

const server = app.listen(PORT, () => {
  console.log(`서버 ON: http://localhost:${PORT}`);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.log(`🚨 포트 ${PORT} 사용 중! kill -9 명령어로 끄세요.`);
  }
});
