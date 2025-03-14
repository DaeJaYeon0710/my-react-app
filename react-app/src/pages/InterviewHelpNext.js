import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const InterviewHelpNext = () => {
  const location = useLocation();
  const data = useMemo(() => location.state || {}, [location.state]);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false); // ✅ 추가됨
  const [fadeOut, setFadeOut] = useState(false); // ✅ 추가됨
  const questionsRef = useRef(null);

  // ✅ 카운트다운과 광고 팝업 상태 관리
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [countdown, setCountdown] = useState(3); // 카운트다운 초기화
  const [adCloseEnabled, setAdCloseEnabled] = useState(false); // X 버튼 활성화 여부

    // 광고 팝업을 닫는 함수
    const handleAdClose = () => {
      setShowAdPopup(false); // 광고 팝업을 닫는 함수
    };

  // ✅ 날짜 형식 변환 함수 추가 (YYYY년 MM월 DD일)
const formatDate = (dateStr) => {
  if (!dateStr) return "날짜 없음";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

useEffect(() => {
    console.log("📌 면접 질문 페이지에서 받은 데이터:", data);
  }, [data]);

    // ✅ 복사 기능 추가
    const copyToClipboard = (textToCopy) => {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setShowCopiedMessage(false);
            setFadeOut(false);
          }, 700);
        }, 2000);
      });
    };

  const requestInterviewQuestions = async () => {
    if (!data.companyName || !data.workType || !data.aiResponse || !data.careerResponse) {
      alert("🚨 데이터가 올바르게 전달되지 않았습니다. 다시 시도해주세요.");
      console.error("🚨 데이터가 부족합니다:", data);
      return;
    }

    setLoading(true);
    setShowAdPopup(true); // 🚩 광고 팝업 표시
    setCountdown(3); // 카운트다운 초기화
    setAdCloseEnabled(false); // X 버튼 비활성화

    // ✅ 카운트다운 시작
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval); // 1초 후 카운트다운 종료
          setAdCloseEnabled(true); // X 버튼 활성화
          return 0; // 0으로 변경
        }
        return prev - 1; // 1초마다 감소
      });
    }, 1000);

    try {
      const response = await axios.post("http://localhost:5000/api/generate", {
        prompt: `
📌 **지원 회사:** ${data.companyName}
📌 **회사에서 요구하는 담당 업무, 요구 자격 요건:** ${data.workType}
📌 **업무 경력:** ${data.experience === "none" ? "무경력" : "경력 있음"}
📌 **보유 자격증:** ${data.certificates?.length > 0 ? data.certificates.map(cert => cert.name).join(", ") : "없음"}
📌 **지원동기:** ${data.aiResponse || "지원동기가 작성되지 않았습니다."}
📌 **입사 후 포부:** ${data.careerResponse || "입사 후 포부가 작성되지 않았습니다."}

✨ 위 내용을 기반으로 면접에서 나올 법한 압박 면접 질문 5개와 그에 대한 모범 답변을 만들어주세요.
각 질문은 반드시 "질문:" 으로 시작하고, 답변은 "답변:" 으로 시작하도록 작성해주세요.

💡 **"질문:"으로 시작하지 않는 문장은 모두 제거됩니다.**
💡 **"답변:"이 포함되지 않은 질문도 제거됩니다.**
💡 **무조건 "질문:" 다음에 "답변:"이 있어야 합니다.**
💡 **질문과 답변은 한 줄로 끝나지 않도록 하며, 상세한 설명을 포함해야 합니다.**
💡 **경력이 없는 경우, 경력이 없는 것으로 답변해야 하며 가상의 경험을 추가하면 안 됩니다.**

### **면접 질문 요구사항**
1️⃣ **지원하는 회사 분석 및 담당 업무 관련 질문**
   - 지원하는 회사의 공식 홈페이지, 채용 공고, 기업 분석 자료를 참고하여 해당 기업에서 요구하는 능력을 검증할 질문을 만들어 주세요.
   - 해당 직무에서 요구하는 핵심 기술/지식 테스트를 위한 질문을 추가해 주세요.

2️⃣ **업무 경력 기반 질문**
   - **경력이 있을 경우:** 지원자의 이전 근무지, 근속 기간, 주요 업무 성과를 바탕으로 심도 있는 질문을 생성하세요.
   - **경력이 없을 경우:** ✅ **경력이 없다는 점을 반영하여 질문을 만들어야 하며, 지원자가 관련 경험이 없음을 인정하는 답변을 작성해야 합니다.**
   - 질문 예시: "관련 업무 경험이 없지만, 이 직무를 수행하기 위해 어떤 준비를 해왔나요?"
   - **절대 가상의 경험을 만들어 추가하지 마세요.**
   - **경력 기간이 짧거나, 퇴사 후 공백 기간이 긴 경우:** 해당 사항에 대해 상세하게 묻는 압박 면접 질문을 추가해 주세요.

3️⃣ **보유 자격증 테스트 질문**
   - 지원자가 보유한 자격증이 **해당 직무와 어떻게 연결되는지** 질문해 주세요.
   - 자격증이 **언어 관련 (예: 영어, 일본어)** 인 경우, 해당 언어로 즉석 테스트를 요청하는 질문을 포함해 주세요.
   - 자격증이 **기술 관련 (예: 코딩, 네트워크, 데이터 분석 등)** 인 경우, 실무 기술을 검증하는 질문을 포함해 주세요.

4️⃣ **지원 동기 및 입사 후 포부 관련 질문**
   - 지원자가 작성한 지원 동기와 입사 후 포부에 대해 심층 질문을 만들어 주세요.
   - 지원 동기가 회사의 비전과 미션과 일치하는지 확인할 수 있도록 질문해 주세요.
   - 입사 후 계획이 실제 회사에서 실행 가능한지 검증하는 질문을 포함해 주세요.

   **중요:**
💡 **질문의 난이도는 압박 면접처럼 까다로운 질문을 포함하되, 적절한 수준으로 조절해 주세요.**
💡 **업무 경력에서 경력이 없을 경우, 경력이 있는 것처럼 작성하면 안 됩니다.**  
💡 **무조건 "질문:" 다음에 "답변:"이 있어야 하며, 다른 형식은 절대 허용되지 않습니다.**
        `,
      });

      if (!response.data || !response.data.result) {
        throw new Error("AI 응답 데이터가 없습니다.");
      }
  
      const parsedQuestions = [];
      const lines = response.data.result.split("\n").map(line => line.trim());
  
      let currentQuestion = null;
      let currentAnswer = null;
  
      for (const line of lines) {
        if (line.startsWith("질문:")) {
          if (currentQuestion && currentAnswer) {
            parsedQuestions.push({ question: currentQuestion, answer: currentAnswer });
          }
          currentQuestion = line.replace("질문:", "").trim();
          currentAnswer = null; // 다음 답변을 위해 초기화
        } else if (line.startsWith("답변:")) {
          currentAnswer = line.replace("답변:", "").trim();
        }
      }
  
      if (currentQuestion && currentAnswer) {
        parsedQuestions.push({ question: currentQuestion, answer: currentAnswer });
      }
  
      // 📌 **잘못된 질문/답변 필터링 추가**
      const filteredQuestions = parsedQuestions.filter(q => {
        // 🚨 경력이 없는데도 "이전 경력"이 포함된 경우 삭제
        if (data.experience === "none") {
          return !q.question.includes("이전 경력") && !q.answer.includes("이전 경력");
        }
        return true;
      });
  
      setQuestions(filteredQuestions); // ✅ 필터링된 질문/답변 저장
  
      setTimeout(() => {
        questionsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } catch (error) {
      console.error("❌ AI 요청 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const backgroundColors = ["bg-blue-100", "bg-red-100", "bg-yellow-100", "bg-green-100", "bg-purple-100"];

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg animate-fadeIn">
        <div className="flex gap-x-16 text-[16px] font-normal">
          <div className="flex flex-col gap-3 w-1/2">
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">지원 회사</label>
              <p className="border p-2 w-full rounded-md bg-gray-100">{data.companyName || "정보 없음"}</p>
            </div>


            {/* ✅ 업무 경력 표시 */}
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">업무 경력</label>
              {data.experience === "none" || !data.customExperience?.length ? (
                <p className="border p-2 w-full rounded-md bg-gray-100">무경력</p>
              ) : (
                <div className="border p-4 rounded-md mt-2 bg-gray-50">
                  <p className="font-normal">{data.customExperience[0]?.company || "정보 없음"}</p>
                  <p className="text-gray-700">
                    {data.customExperience[0]?.joinDate && data.customExperience[0]?.leaveDate
                      ? `${formatDate(data.customExperience[0]?.joinDate)} ~ ${formatDate(data.customExperience[0]?.leaveDate)}`
                      : "날짜 없음"}
                  </p>
                  <p className="mt-0">{data.customExperience[0]?.details || "상세 정보 없음"}</p>

                  {data.customExperience.length > 1 && (
                    <p className="mt-2 text-sm text-gray-600">
                      외 {data.customExperience.length - 1}건의 경력 추가됨
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>     
                
          <div className="flex flex-col gap-3 w-1/2">
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">회사에서 요구하는 담당 업무, 요구 자격 요건</label>
              <p className="border p-2 w-full rounded-md bg-gray-100">{data.workType || "정보 없음"}</p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">보유 자격증</label>
              <p className="border p-2 w-full rounded-md bg-gray-100">
                {data.certificates?.length > 0 ? data.certificates.map(cert => cert.name).join(", ") : "없음"}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ 지원동기 섹션 */}
        <div className="mt-3 p-5 border rounded-md bg-white shadow-md">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            지원동기
            <button
              onClick={() => copyToClipboard(data.aiResponse || "지원동기가 작성되지 않았습니다.")}
              className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300"
            >
              복사
            </button>
          </h3>
          <p className="border p-3 w-full rounded-md bg-gray-100 max-h-[80px] overflow-y-auto" style={{ whiteSpace: "pre-line" }}>
            {data.aiResponse || "지원동기가 작성되지 않았습니다."}
          </p>
        </div>

        {/* ✅ 입사 후 포부 섹션 */}
        <div className="mt-3 p-5 border rounded-md bg-white shadow-md">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            입사 후 포부
            <button
              onClick={() => copyToClipboard(data.careerResponse || "입사 후 포부가 작성되지 않았습니다.")}
              className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300"
            >
              복사
            </button>
          </h3>
          <p className="border p-3 w-full rounded-md bg-gray-100 max-h-[80px] overflow-y-auto" style={{ whiteSpace: "pre-line" }}>
            {data.careerResponse || "입사 후 포부가 작성되지 않았습니다."}
          </p>
        </div>

        {/* ✅ 복사 성공 메시지 */}
        {showCopiedMessage && (
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 
                        border border-green-400 text-green-800 px-4 py-2 rounded shadow-md 
                        ${fadeOut ? "animate-fadeOut" : "animate-fadeIn"}`}
          >
            복사되었습니다!
          </div>
        )}

<div className="flex justify-end mt-6">
  <button
    onClick={requestInterviewQuestions}
    className={`bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl transition-all duration-300 hover:bg-white hover:text-green-500 border-2 border-green-500 ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={loading}
  >
    {loading ? "질문 생성 중..." : "질문 + 답변 받기 요청"}
  </button>
</div>

        {/* 🚩 팝업 광고 코드 */}
        {showAdPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white p-4 rounded-lg shadow-lg relative w-[80%] max-w-[320px] flex flex-col items-center justify-center">

      {/* Google 광고 */}
      <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center mt-4">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-XXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* 광고 아래에 문구 배치 */}
      <p className="text-black text-sm font-medium mt-2 mb-0">
        작성되는 동안 광고가 표시됩니다
      </p>

      {/* X 버튼 (검정색 텍스트로 변경) */}
      <button
        className={`absolute top-0 right-0 px-3 py-1 rounded-md text-black font-bold transition-all duration-300 ${
          adCloseEnabled ? "hover:text-black" : "cursor-not-allowed"
        }`}
        onClick={handleAdClose}
        disabled={!adCloseEnabled}
      >
        {adCloseEnabled ? "X" : countdown}
      </button>
    </div>
  </div>
)}

        {questions.length > 0 && (
          <div ref={questionsRef} className="mt-5 space-y-5 w-full">
            {questions.map((q, index) => (
      <div 
        key={index} 
        className={`p-5 rounded-md shadow-md animate-fadeIn ${backgroundColors[index % backgroundColors.length]}`} 
        style={{ animationDelay: `${index * 0.3}s` }} // ✅ 딜레이 적용
      >
        <h4 className="font-semibold text-2xl mb-2">질문 {index + 1}</h4>
        <p className="border p-3 rounded-md text-lg bg-white">{q.question}</p>
        <h4 className="font-semibold text-2xl mt-4">답변</h4>
        <p className="border p-3 rounded-md text-lg bg-white">{q.answer}</p>
      </div>
    ))}
  </div>
)}
      </div>

{/* ✅ 복사 성공 메시지 */}
{showCopiedMessage && (
  <div
    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 
                border border-green-400 text-green-800 px-4 py-2 rounded shadow-md 
                ${fadeOut ? "animate-fadeOut" : "animate-fadeIn"}`}
  >
    복사되었습니다!
  </div>
)}

{/* ✅ 광고 (페이지 로드 시 즉시 표시) 🔹 (광고 추가) */}
<div
  className="mt-6 bg-white bg-opacity-50 p-2 rounded-lg shadow-md"
  style={{ width: "1092px", height: "180px" }}
>
  <ins
    className="adsbygoogle"
    style={{ display: "inline-block", width: "100%", height: "100%" }}
    data-ad-client="ca-pub-XXXXXXXXXXXX"
    data-ad-slot="XXXXXXXXXX"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</div>

    </div>
  );
};

export default InterviewHelpNext;
