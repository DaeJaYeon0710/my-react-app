import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function StrengthsWeaknesses() {
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false); // 복사 알림 상태
  const [fadeOut, setFadeOut] = useState(false); // 페이드아웃 상태

  const responseRef = useRef(null); // 자동 스크롤을 위한 ref

  const handleSubmit = () => {
    if (!strengths || !weaknesses) {
      alert("장점과 단점을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    axios
    .post("http://3.39.177.32:5000/api/generate", {
      prompt: ` 
        📌 **성격의 장점**: ${strengths}
        📌 **성격의 단점**: ${weaknesses}
        
        위의 내용을 바탕으로 글을 자연스럽게 풀어주세요. 
        AI는 아래 두 가지를 추가로 작성해야 합니다:
        1. **극복 방안** (장점과 단점을 어떻게 극복할 수 있을지)
        2. **업무 태도** (업무에 대한 태도 및 성격에 맞는 업무 스타일)
        `,
      })
      .then((response) => {
        setAiResponse(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("AI 요청 실패:", error);
        setLoading(false);
      });
  };

  // AI가 반환한 텍스트를 줄마다 나누어 표시
  const formatAiResponse = (text) => {
    return text.split("\n").map((line, index) => (
      <p key={index} className="text-lg mb-2">
        {line}
      </p>
    ));
  };

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

  // ✅ 자동 스크롤
  useEffect(() => {
    if (aiResponse && responseRef.current) {
      // AI 응답 영역으로 자동 스크롤
      responseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [aiResponse]);

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">성격의 장단점</h1>

        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 장점 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[22px] font-medium">장점</label>
              <textarea
                className="border p-3 w-full rounded-md text-lg resize-none min-h-[120px]"
                placeholder="장점에 대해 자유롭게 입력하세요"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
              />
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 단점 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[22px] font-medium">단점</label>
              <textarea
                className="border p-3 w-full rounded-md text-lg resize-none min-h-[120px]"
                placeholder="단점에 대해 자유롭게 입력하세요"
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className={`bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl flex items-center space-x-2 transition-all duration-300 
            hover:bg-white hover:text-blue-500 border-2 border-transparent hover:border-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <span>{loading ? "작성 중..." : "AI에게 요청하기"}</span>
          </button>
        </div>

        {/* ✅ 성격의 장단점 AI 응답 */}
        {aiResponse && (
          <div ref={responseRef} className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-300 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              성격의 장단점
              {/* 복사 버튼 */}
              <button
                onClick={() => copyToClipboard(aiResponse)}
                className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300"
              >
                복사
              </button>
            </h2>
            <div className="border p-4 rounded-md bg-white">
              {formatAiResponse(aiResponse)}
            </div>
          </div>
        )}

        {/* 복사 성공 메시지 */}
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
}

export default StrengthsWeaknesses;
