// server/check_models.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// ★ 여기에 API 키 입력
const genAI = new GoogleGenerativeAI("AIzaSyBawW2UMOsk2-Qxgsfd2lkR7XNeU8Wek5g");

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // 임시 모델 객체 생성

    // API에 "사용 가능한 모델 리스트 줘!" 요청 보내기
    // (SDK 버전에 따라 메서드가 다를 수 있어 fetch로 직접 확인하는 방식 사용)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${genAI.apiKey}`
    );
    const data = await response.json();

    console.log("====== [내 키로 쓸 수 있는 모델 목록] ======");
    if (data.models) {
      data.models.forEach((m) => {
        // 'generateContent' 기능을 지원하는 놈만 출력
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`✅ 모델 이름: ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("❌ 모델 목록을 가져올 수 없습니다. 에러 메시지:", data);
    }
    console.log("===========================================");
  } catch (error) {
    console.error("확인 중 에러 발생:", error);
  }
}

listModels();
