import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResumeProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = useMemo(() => location.state || {}, [location.state]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const textareaRef = useRef(null);
  const responseRef = useRef(null);

  useEffect(() => {
    if (!data.companyName || !data.workType) {
      console.error("❌ 데이터가 올바르게 전달되지 않았습니다.");
    } else {
      console.log("📌 페이지2에서 수신한 데이터:", data);
    }
  }, [data]);

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  const requestAI = async () => {
    if (!data.companyName || !data.workType) {
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

✨ **위 내용을 기반으로 지원동기를 작성해주세요.**  
- 문장을 자연스럽게 이어갈 것  
- 중요한 부분을 강조할 것  
- 가독성을 높이도록 단락을 나눌 것  
- **최소 400자 이상으로 작성할 것**  
        `,
      });

      if (!response.data || !response.data.result) {
        throw new Error("AI 응답 데이터가 없습니다.");
      }

      setAiResponse(response.data.result);
    } catch (error) {
      console.error("❌ AI 요청 실패:", error.message);
      setAiResponse("AI 요청 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [aiResponse]);

  useEffect(() => {
    if (aiResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiResponse]);

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

  // ✅ 페이지3로 이동하는 함수
  const goToCareerGoals = () => {
    navigate("/career-goals", {
      state: { ...data, aiResponse }
    });
  };

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      {/* ✅ 전체 컨텐츠 박스 */}
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg animate-fadeIn">

        {/* 🔹 입력 필드들을 2열 레이아웃으로 배치 */}
        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 지원 회사 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[20px] font-medium">지원 회사</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.companyName}</p>
            </div>

            {/* 업무 경력 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
  <label className="block text-[20px] font-medium">업무 경력</label>

  {/* ✅ customExperience가 없거나 비어있으면 "무경력" 출력 */}
  {(data.experience === "none" || !data.customExperience || data.customExperience.length === 0) ? (
    <p className="border p-3 w-full rounded-md bg-gray-100">무경력</p>
  ) : (
    // ✅ 경력이 있을 경우에만 상세 정보 출력
    <div className="border p-4 rounded-md mt-2 bg-gray-50">
      {/* 회사명이 존재하는 경우만 출력 */}
      {data.customExperience[0]?.company && (
        <p className="font-normal">{data.customExperience[0].company}</p>
      )}

      {/* 입사/퇴사 날짜가 둘 다 존재하는 경우만 출력 */}
      {data.customExperience[0]?.joinDate && data.customExperience[0]?.leaveDate && (
        <p className="text-gray-700">
          {`${formatDate(data.customExperience[0].joinDate)} ~ ${formatDate(data.customExperience[0].leaveDate)}`}
        </p>
      )}

      {/* 업무 내용이 존재하는 경우만 출력 */}
      {data.customExperience[0]?.details && (
        <p className="mt-0">{data.customExperience[0].details}</p>
      )}

      {/* 추가 경력이 있는 경우만 개수 표시 */}
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

        {/* ✅ AI 요청 버튼 */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={requestAI}
            className={`bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl flex items-center space-x-2 
                        transition-all duration-300 hover:bg-white hover:text-blue-500 border-2 border-blue-500 
                        ${loading && "opacity-50 cursor-not-allowed"}`}
            disabled={loading}
          >
            <span>{loading ? "작성 중..." : "지원동기 작성 요청"}</span>
          </button>
        </div>

        {/* ✅ AI 응답 표시 */}
        {aiResponse && (
          <div ref={responseRef} className="mt-10 p-5 border rounded-md bg-white shadow-md animate-fadeIn">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              지원동기
              <button
                onClick={() => copyToClipboard(aiResponse)}
                className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300"
              >
                복사
              </button>
            </h3>
            <textarea
              ref={textareaRef}
              className="border p-2 w-full rounded-md resize-none text-lg"
              value={aiResponse}
              readOnly
              style={{ minHeight: "150px", height: "auto", overflow: "hidden" }}
            />
          </div>
        )}

        {/* ✅ "입사 후 포부 작성" 버튼 추가 */}
        {aiResponse && (
          <div className="flex justify-end mt-6">
            <button 
              onClick={goToCareerGoals} 
              className="bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl flex items-center space-x-2 transition-all duration-300 hover:bg-white hover:text-black border-2 border-teal-500"
            >
              <span>입사 후 포부 작성하러 가기</span>
              <span className="text-3xl">→</span>
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

export default ResumeProcessing;
