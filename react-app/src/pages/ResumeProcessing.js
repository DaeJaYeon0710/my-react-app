import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ResumeProcessing() {
  const location = useLocation();
  const { companyName, workType, experience, customExperience, certificates } = location.state || {};

  const [aiGeneratedResume, setAiGeneratedResume] = useState(""); // AI가 생성한 지원동기
  const [loading, setLoading] = useState(false);
  const [requestCompleted, setRequestCompleted] = useState(false); // 요청 완료 여부

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };

  // AI 요청 함수
  const requestAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "gpt-4",
        prompt: `
          아래 정보를 바탕으로 지원동기를 작성해 주세요.
          - 지원 회사: ${companyName}
          - 업무 형태: ${workType}
          - 유사 업무 경력: ${
            experience === "none"
              ? "무경력"
              : customExperience.map(exp => `
                회사명: ${exp.company}
                입사 날짜: ${formatDate(exp.joinDate)}
                퇴사 날짜: ${formatDate(exp.leaveDate)}
                업무 내용: ${exp.details}
              `).join("\n")
          }
          - 보유 자격증: ${certificates.length > 0 ? certificates.map(cert => cert.name).join(", ") : "없음"}

          줄을 나누어 보기 쉽게 작성해 주세요.
        `,
        max_tokens: 400,
        temperature: 0.7,
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      setAiGeneratedResume(response.data.choices[0].text.trim());
      setRequestCompleted(true); // 요청 완료 상태 변경
    } catch (error) {
      console.error("AI 요청 실패:", error);
      setAiGeneratedResume("지원동기 작성에 실패했습니다. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">지원 정보 정리</h2>

      {/* 정리된 정보 표시 */}
      <div className="border p-4 rounded-md mb-4 bg-gray-100">
        <p><strong>지원 회사:</strong> {companyName || "입력되지 않음"}</p>
        <p><strong>업무 형태:</strong> {workType || "입력되지 않음"}</p>
        <p><strong>유사 업무 경력:</strong> {experience === "none" ? "무경력" : ""}</p>
        {experience === "custom" &&
          customExperience.map((exp, index) => (
            <div key={exp.id} className="mt-2">
              <p><strong>{index + 1}. 회사명:</strong> {exp.company}</p>
              <p><strong>입사 날짜:</strong> {formatDate(exp.joinDate)}</p>
              <p><strong>퇴사 날짜:</strong> {formatDate(exp.leaveDate)}</p>
              <p><strong>업무 내용:</strong> {exp.details}</p>
            </div>
          ))}
        <p><strong>보유 자격증:</strong> {certificates.length > 0 ? certificates.map(cert => cert.name).join(", ") : "없음"}</p>
      </div>

      {/* 지원동기 요청 버튼 (AI 요청 전까지 활성화) */}
      {!requestCompleted && (
        <button
          className={`bg-blue-500 text-white p-2 rounded-md w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={requestAI}
          disabled={loading}
        >
          {loading ? "지원동기 작성 중..." : "지원동기 작성 요청"}
        </button>
      )}

      {/* AI가 작성한 지원동기 */}
      {requestCompleted && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">작성된 지원동기</h3>
          <textarea
            className="border p-2 w-full rounded-md mt-2"
            value={aiGeneratedResume}
            readOnly
            rows={aiGeneratedResume.split("\n").length + 3} // 줄 개수에 따라 크기 조정
          ></textarea>

          {/* 재요청 버튼 */}
          <button
            className="bg-green-500 text-white p-2 rounded-md w-full mt-2"
            onClick={requestAI}
          >
            지원동기 재작성 요청
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeProcessing;
