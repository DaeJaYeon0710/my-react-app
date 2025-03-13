import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // 🔹 Link 대신 useNavigate 사용

const CareerGoals = () => {
  const location = useLocation();

  const data = useMemo(() => location.state || {}, [location.state]);
  const [careerResponse, setCareerResponse] = useState(""); // 입사 후 포부 AI 응답
  const [loading, setLoading] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false); // 복사 알림 상태
  const [fadeOut, setFadeOut] = useState(false); // 페이드아웃 상태
  const textareaRef = useRef(null);
  const responseRef = useRef(null);

  const navigate = useNavigate(); // 🔹 useNavigate 인스턴스 생성

const goToInterviewHelpNext = () => {
  navigate("/interview-help-next", {
    state: { ...data, careerResponse }, // ✅ 모든 데이터와 careerResponse 함께 전달
  });
};

  useEffect(() => {
    if (!data.companyName || !data.workType) {
      console.error("❌ 데이터가 올바르게 전달되지 않았습니다.");
    } else {
      console.log("📌 페이지3에서 수신한 데이터:", data);
    }
  }, [data]);

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  const requestAI = async () => {
    if (!data.companyName || !data.workType || !data.aiResponse) {
      alert("🚨 데이터가 올바르게 전달되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/generate", {
        prompt: `
📌 **지원 회사:** ${data.companyName}
📌 **입사하면 맡게 될 업무:** ${data.workType}
📌 **업무 경력:** 
${data.experience === "none" ? "무경력" : data.customExperience.map((exp, index) =>
            `   ${index + 1}. ${exp.company} (${formatDate(exp.joinDate)} ~ ${formatDate(exp.leaveDate)})\n   - ${exp.details}`).join("\n\n")}

📌 **보유 자격증:** ${data.certificates.length > 0 ? data.certificates.map(cert => cert.name).join(", ") : "없음"}

📌 **지원동기 (페이지2에서 작성됨):**  
${data.aiResponse || "지원동기가 작성되지 않았습니다."}

✨ **위 내용을 기반으로 입사 후 포부를 작성해주세요.**  
- 문장을 자연스럽게 이어갈 것  
- 중요한 부분을 강조할 것  
- 가독성을 높이도록 단락을 나눌 것  
- **최소 400자 이상으로 작성할 것**  
        `,
      });

      if (!response.data || !response.data.result) {
        throw new Error("AI 응답 데이터가 없습니다.");
      }

      setCareerResponse(response.data.result); // AI 응답 저장
    } catch (error) {
      console.error("❌ AI 요청 실패:", error.message);
      setCareerResponse("AI 요청 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [careerResponse]);

  useEffect(() => {
    if (careerResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [careerResponse]);

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowCopiedMessage(false);
          setFadeOut(false);
        }, 700); // 페이드아웃 시간과 동일하게 설정
      }, 2000);
    });
  };

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      {/* ✅ 전체 컨텐츠 박스 */}
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg animate-fadeIn">
        
        {/* 🔹 입력 필드들을 2열 레이아웃으로 배치 (간격 조절) */}
        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 지원 회사 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[20px] font-medium">지원 회사</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.companyName}</p>
            </div>

            {/* 업무 경력 (첫 번째 항목만 표시, 나머지는 축약) */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block text-[20px] font-medium">업무 경력</label>
              {data.experience === "none" ? (
                <p className="border p-3 w-full rounded-md bg-gray-100">무경력</p>
              ) : (
                <div className="border p-4 rounded-md mt-2 bg-gray-50">
                  <p className="font-normal">
                    {data.customExperience.length > 0 ? data.customExperience[0]?.company : "정보 없음"}
                  </p>
                  <p className="text-gray-700">
                    {data.customExperience.length > 0 ? 
                      `${formatDate(data.customExperience[0]?.joinDate)} ~ ${formatDate(data.customExperience[0]?.leaveDate)}` 
                      : "날짜 없음"}
                  </p>
                  <p className="mt-0">
                    {data.customExperience.length > 0 ? data.customExperience[0]?.details : "상세 정보 없음"}
                  </p>

                  {data.customExperience.length > 1 && (
                    <p className="mt-2 text-sm text-gray-600">
                      외 {data.customExperience.length - 1}건의 경력 추가됨
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 업무 형태 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[20px] font-medium">회사에서 요구하는 담당 업무, 요구 자격 요건</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.workType}</p>
            </div>

            {/* 보유 자격증 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block text-[20px] font-medium">보유 자격증</label>
              {data.certificates.length === 0 ? (
                <p className="border p-3 w-full rounded-md bg-gray-100">없음</p>
              ) : (
                data.certificates.map((cert, index) => (
                  <p key={cert.id} className="border p-3 w-full rounded-md bg-gray-100">
                    {index + 1}. {cert.name}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ✅ 지원동기 표시 (회색 배경 + 스크롤 가능) */}
        <div className="mt-10 p-5 border rounded-md bg-white shadow-md">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            지원동기
            <button
              onClick={() => copyToClipboard(data.aiResponse || "지원동기가 작성되지 않았습니다.")}
              className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300"
            >
              복사
            </button>
          </h3>
          <textarea
            className="border p-2 w-full rounded-md resize-y overflow-y-auto bg-gray-100"
            value={data.aiResponse || "지원동기가 작성되지 않았습니다."}
            readOnly
            style={{ minHeight: "150px", maxHeight: "300px" }}
          />
        </div>

        {/* ✅ 입사 후 포부 작성 요청 버튼 */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={requestAI}
            className={`bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl flex items-center space-x-2 
                        transition-all duration-300 hover:bg-white hover:text-blue-500 border-2 border-blue-500 
                        ${loading && "opacity-50 cursor-not-allowed"}`}
            disabled={loading}
          >
            <span>{loading ? "작성 중..." : "입사 후 포부 작성 요청"}</span>
          </button>
        </div>

        {/* ✅ 입사 후 포부 작성 결과 */}
        {careerResponse && (
          <div ref={responseRef} className="mt-10 p-5 border rounded-md bg-white shadow-md animate-fadeIn">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              입사 후 포부
              <button
                onClick={() => copyToClipboard(careerResponse)}
                className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300"
              >
                복사
              </button>
            </h3>
            <p className="border p-3 w-full rounded-md whitespace-pre-line text-lg">{careerResponse}</p>
          </div>
        )}
            {/* ✅ 면접 질문 받으러 가기 버튼 (AI 응답이 있을 때만 표시) */}
            {careerResponse.trim() && (
  <div className="mt-5 flex justify-end">
    <button
      onClick={goToInterviewHelpNext} // ✅ 버튼 클릭 시 goToInterviewHelpNext() 실행
      className="bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl hover:bg-white hover:text-teal-500 border-2 border-teal-500"
    >
      면접 예상 질문 + 답변 받으러 가기 →
    </button>
  </div>
    )}
        {/* ✅ 복사 성공 메시지 */}
        {showCopiedMessage && (
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded shadow-md ${
              fadeOut ? "animate-fadeOut" : "animate-fadeIn"
            }`}
          >
            복사되었습니다!
          </div>
        )}
        
      </div>
    </div>
  );
};

export default CareerGoals;
