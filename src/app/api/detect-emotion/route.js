const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

/*
  System Prompt 설정
  이 설정에 따라 AI 의 대답의 유형을 다르게 만들 수 있음
  단, 이 설정을 항상 확실히 참조하지는 않음
  이 설정은 메시지 목록의 첫 번째 메시지로 사용됨
*/
const systemInstruction =
  "너는 감정 인식 AI야." +
  "사용자가 하는 말을 보고 너는 무조건 그 감정을 '기본, 기쁨, 편안, 무난, 피곤, 슬픔, 분노' 중 하나로 판단해줘."+
  "감정이 '기쁨'으로 판단되면 '기쁨'이라고 보내줘야 해"+
  "이모티콘 같은 것도 쓰지 말고 네가 할 수 있는 말은 '기본', '기쁨', '편안', '무난', '피곤', '슬픔', '분노'밖에 없어.";

export async function POST(req) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: systemInstruction,
  });

  // POST 로 전송받은 내용 중 messages 를 추출
  const data = await req.json();
  console.dir([...data.messages], { depth: 3 });

  const chat = model.startChat({
    history: [
        ...data.messages,
    ],
    generationConfig: {
      // temperature 값이 높을 수록 AI 의 답변이 다양해짐
      temperature: 1,
      // max_tokens 값을 제한함. 이 값을 크게하면 컨텍스트 히스토리에 제약이 커짐.
      maxOutputTokens: 100,
    },
  });

  const result = await chat.sendMessage("");
  const response = await result.response;
  const text = response.text();
  console.log(response.candidates[0].content);
  //   console.log(response.candidates[0].safetyRatings);

  const emotions = ["기쁨", "편안", "무난", "피곤", "슬픔", "분노"];
  const detectedEmotion = emotions.find(emotion => text.includes(emotion)) || "기본";

  return Response.json({
    // AI 의 답변은 model 역할로 전송
    role: "model",
    parts: [{ text: text }],
    emotion: detectedEmotion,
  });
}