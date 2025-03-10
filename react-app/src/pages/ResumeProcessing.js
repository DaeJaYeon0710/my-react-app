import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ResumeProcessing = () => {
  const location = useLocation();
  const data = location.state || {};

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

  // 날짜 포맷 함수 (YYYY년 MM월 DD일)
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  // AI 요청 함수 (자동 추가 없음)
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
  - **최소 400자 이상으로 작성할 것  
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

  // ✅ AI 응답이 바뀔 때 textarea 크기 자동 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [aiResponse]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">이력서 정보 정리</h2>

      {/* 정리된 정보 표시 */}
      {data.companyName && data.workType ? (
        <div className="border p-4 rounded bg-gray-100">
          <p><strong>📌 지원 회사:</strong> {data.companyName}</p>
          <p><strong>💼 업무 형태:</strong> {data.workType}</p>
          <p><strong>📝 유사 업무 경력:</strong></p>
          {data.experience === "none" ? (
            <p>무경력</p>
          ) : (
            data.customExperience.map((exp, index) => (
              <div key={exp.id} className="ml-4 mt-2">
                <p><strong>{index + 1}. {exp.company}</strong> ({formatDate(exp.joinDate)} ~ {formatDate(exp.leaveDate)})</p>
                <p>➡ {exp.details}</p>
              </div>
            ))
          )}
          <p><strong>🎓 보유 자격증:</strong> {data.certificates.length > 0 ? data.certificates.map(cert => cert.name).join(", ") : "없음"}</p>
        </div>
      ) : (
        <p className="text-red-500 font-bold">🚨 데이터 없음</p>
      )}

      {/* AI 요청 버튼 (기존 버튼 유지) */}
      <button
        onClick={requestAI}
        className={`mt-4 px-4 py-2 rounded text-white ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"}`}
        disabled={loading}
      >
        {loading ? "지원동기 작성 중..." : "지원동기 작성 요청"}
      </button>

      {/* AI 응답 표시 */}
      {aiResponse && (
        <div className="mt-4 p-4 border rounded bg-white">
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
  );
};

export default ResumeProcessing;
