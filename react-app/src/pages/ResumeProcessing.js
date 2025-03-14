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
  const responseRef = useRef(null); // 자동 스크롤을 위한 ref

  const [showAdPopup, setShowAdPopup] = useState(false);
  const [countdown, setCountdown] = useState(3); // 🔥 3초 카운트다운 상태
  const [adCloseEnabled, setAdCloseEnabled] = useState(false); // 🔥 X 버튼 활성화 여부

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
    setShowAdPopup(true); // 🚩 광고 팝업 표시 (AI 요청과 동시에 진행)
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
      const response = await axios.post("http://3.39.177.32:5000/api/generate", {
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
      setLoading(false); // ✅ 광고가 떠 있는 동안에도 버튼 활성화됨
    }
  };
  
  const handleAdClose = () => {
    setShowAdPopup(false); // 🚀 광고 닫기 (AI 요청과 별개로 진행)
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [aiResponse]);

  // ✅ 자동 스크롤 (입사 후 포부 영역의 절반만 스크롤하도록 수정)
  useEffect(() => {
    if (aiResponse && responseRef.current) {
      const element = responseRef.current;
      // 응답 영역의 절반만 보이도록 설정
      const middlePosition = element.offsetTop - window.innerHeight / 2 + element.clientHeight / 2;

      window.scrollTo({
        top: middlePosition,
        behavior: 'smooth',
      });
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

  const goToCareerGoals = () => {
    navigate("/career-goals", {
      state: { ...data, aiResponse }
    });
  };

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg animate-fadeIn">
        {/* 전체 컨텐츠 */}
        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[20px] font-medium">지원 회사</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.companyName}</p>
            </div>

            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block text-[20px] font-medium">업무 경력</label>
              {(data.experience === "none" || !data.customExperience || data.customExperience.length === 0) ? (
                <p className="border p-3 w-full rounded-md bg-gray-100">무경력</p>
              ) : (
                <div className="border p-4 rounded-md mt-2 bg-gray-50">
                  {data.customExperience[0]?.company && (
                    <p className="font-normal">{data.customExperience[0].company}</p>
                  )}
                  {data.customExperience[0]?.joinDate && data.customExperience[0]?.leaveDate && (
                    <p className="text-gray-700">{`${formatDate(data.customExperience[0].joinDate)} ~ ${formatDate(data.customExperience[0].leaveDate)}`}</p>
                  )}
                  {data.customExperience[0]?.details && (
                    <p className="mt-0">{data.customExperience[0].details}</p>
                  )}
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
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[20px] font-medium">회사에서 요구하는 담당 업무, 요구 자격 요건</label>
              <p className="border p-3 w-full rounded-md bg-gray-100">{data.workType}</p>
            </div>

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

        {/* AI 요청 버튼 */}
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

        {showAdPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-4 rounded-lg shadow-lg relative w-[80%] max-w-[320px] flex flex-col items-center justify-center">
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
              <p className="text-black text-sm font-medium mt-2 mb-0">작성되는 동안 광고가 표시됩니다</p>
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

        {/* AI 응답 표시 */}
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

        {/* 입사 후 포부 작성 버튼 */}
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

      {/* 하단 배너 광고 */}
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

export default ResumeProcessing;
