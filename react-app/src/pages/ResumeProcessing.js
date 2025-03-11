import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ResumeProcessing = () => {
  const location = useLocation();

  const data = useMemo(() => location.state || {}, [location.state]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

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
  다음 정보를 바탕으로 **최소 400자 이상 지원동기를 작성해주세요.  
  문장을 자연스럽게 이어가며, 지원 회사와 업무에 적합한 경험을 강조해주세요.  
  보기 편하게 줄을 나누고, 핵심 포인트를 명확히 해주세요.  
  문장이 끊기지 않고 마무리되도록 작성해주세요.  

  📌 **지원 회사:** ${data.companyName}
  📌 **입사하면 맡게 될 업무:** ${data.workType}
  📌 **유사 업무 경력:** 
  ${data.experience === "none" ? "무경력" : data.customExperience.map((exp, index) =>
      `   ${index + 1}. ${exp.company} (${formatDate(exp.joinDate)} ~ ${formatDate(exp.leaveDate)})\n   - ${exp.details}`).join("\n\n")}

  📌 **보유 자격증:** ${data.certificates.length > 0 ? data.certificates.map(cert => cert.name).join(", ") : "없음"}

  ✨ **위 내용을 기반으로 지원동기를 작성해주세요.**  
  - 문장을 자연스럽게 이어갈 것  
  - 중요한 부분을 강조할 것  
  - 가독성을 높이도록 단락을 나눌 것  
  - **최소 400자 이상으로 작성할 것**  
  - 문장이 끊기지 않고 완벽히 마무리될 것  
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

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center pt-24">
      {/* ✅ 전체 컨텐츠 박스 */}
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg">
        
        {/* 🔹 입력 필드들을 2열 레이아웃으로 배치 */}
        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-14 w-1/2">
            {/* 지원 회사 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block font-semibold">지원 회사</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.companyName}</p>
            </div>

            {/* 유사 업무 경력 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block font-semibold">유사 업무 경력</label>
              {data.experience === "none" ? (
                <p className="border p-3 w-full rounded-md bg-gray-100">무경력</p>
              ) : (
                data.customExperience.map((exp, index) => (
                  <div key={exp.id} className="border p-4 rounded-md mt-2 bg-gray-50">
                    <p className="font-semibold">{index + 1}. {exp.company}</p>
                    <p className="text-gray-700">{formatDate(exp.joinDate)} ~ {formatDate(exp.leaveDate)}</p>
                    <p className="mt-2">{exp.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="flex flex-col gap-14 w-1/2">
            {/* 업무 형태 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block font-semibold">입사하면 맡게 될 업무 형태</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.workType}</p>
            </div>

            {/* 보유 자격증 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block font-semibold">보유 자격증</label>
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

        {/* ✅ AI 요청 버튼 (페이지1의 완료 버튼 스타일 적용) */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={requestAI}
            className={`bg-black text-white px-6 py-3 rounded-full shadow-lg text-lg flex items-center space-x-2 ${loading && "opacity-50 cursor-not-allowed"}`}
            disabled={loading}
          >
            <span>{loading ? "지원동기 작성 중..." : "지원동기 작성 요청"}</span>
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* ✅ AI 응답 표시 */}
        {aiResponse && (
          <div className="mt-10 p-5 border rounded-md bg-white shadow-md">
            <h3 className="text-xl font-bold mb-2">지원동기</h3>
            <textarea
              ref={textareaRef}
              className="border p-2 w-full rounded-md resize-none"
              value={aiResponse}
              readOnly
              style={{ minHeight: "150px", height: "auto", overflow: "hidden" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeProcessing;
