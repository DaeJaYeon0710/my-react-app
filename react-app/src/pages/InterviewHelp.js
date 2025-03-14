import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // axios 추가

const InterviewHelpNext = () => {
  // 상태 관리
  const [companyName, setCompanyName] = useState("");
  const [workType, setWorkType] = useState("");
  const [experience, setExperience] = useState("none"); // "무경력" 또는 "직접 작성"을 선택
  const [certificate, setCertificate] = useState("");
  const [motivation, setMotivation] = useState("");
  const [customExperience, setCustomExperience] = useState([]); // 업무 경력 리스트
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]); // 질문과 답변 상태 관리
  const firstQuestionRef = useRef(null); // 첫 번째 질문을 위한 ref

  const lastExperienceRef = useRef(null);

  // ✅ 업무 경력 추가
  const addExperience = () => {
    const newExperience = { id: Date.now(), company: "", joinDate: null, leaveDate: null, details: "" };

    setCustomExperience(prevExperience => {
      const updatedExperience = [...prevExperience, newExperience];

      // 🔥 스크롤을 절반 정도 이동
      setTimeout(() => {
        if (lastExperienceRef.current) {
          const elementPosition = lastExperienceRef.current.getBoundingClientRect().top + window.scrollY;
          const offset = elementPosition - window.innerHeight / 2; // 화면의 절반으로 스크롤
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }, 100);

      return updatedExperience;
    });
  };

  // ✅ 업무 경력 삭제
  const removeExperience = (id) => {
    const updatedExperience = customExperience.filter(exp => exp.id !== id);
    setCustomExperience(updatedExperience);

    // 모든 경력 항목을 삭제하면 "무경력"으로 돌아가게 설정
    if (updatedExperience.length === 0) {
      setExperience("none"); // "무경력" 선택으로 돌아감
    }
  };

  // ✅ 인터뷰 질문 요청
  const requestInterviewQuestions = async () => {
    if (!companyName || !workType || !motivation || !experience) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }
    setLoading(true);

    // AI 서버에 요청을 보내고 답변 받기
    try {
      const response = await axios.post("http://localhost:5000/api/generate", {
        prompt: ` 
        📌 **지원 회사:** ${companyName}
        📌 **회사에서 요구하는 담당 업무, 요구 자격 요건:** ${workType}
        📌 **업무 경력:** ${experience === "none" ? "무경력" : "경력 있음"}
        📌 **보유 자격증:** ${certificate || "없음"}
        📌 **지원 동기:** ${motivation}

        ✨ 위 내용을 기반으로 면접에서 나올 법한 압박 면접 질문 5개와 그에 대한 모범 답변을 만들어 주세요.
        각 질문은 반드시 "질문:" 으로 시작하고, 답변은 "답변:" 으로 시작하도록 작성해주세요.
        `,
      });

      // 질문과 답변을 받아서 화면에 표시
      if (response.data && response.data.result) {
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
            currentAnswer = null;
          } else if (line.startsWith("답변:")) {
            currentAnswer = line.replace("답변:", "").trim();
          }
        }

        if (currentQuestion && currentAnswer) {
          parsedQuestions.push({ question: currentQuestion, answer: currentAnswer });
        }

        setQuestions(parsedQuestions); // 받아온 질문과 답변 상태 업데이트

        // 첫 번째 질문/답변이 추가된 후 자동 스크롤
        setTimeout(() => {
          if (firstQuestionRef.current) {
            firstQuestionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
    } catch (error) {
      console.error("❌ AI 요청 실패:", error.message);
      alert("질문 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const backgroundColors = [
    "bg-blue-100",
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-purple-100",
  ];

  // ✅ "직접 작성" 선택 시 자동으로 첫 번째 입력칸을 추가
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    setExperience(value);

    // "직접 작성"을 선택했을 때 자동으로 경험 추가
    if (value === "custom" && customExperience.length === 0) {
      addExperience();
    }
  };

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">면접 질문 도움</h1>

        {/* 입력 필드 섹션 */}
        <div className="flex gap-x-16 text-[16px] font-normal">
          <div className="flex flex-col gap-3 w-1/2">
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">지원 회사</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md bg-white"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="지원 회사 이름"
              />
            </div>

            {/* 회사에서 요구하는 담당 업무 */}
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">회사에서 요구하는 담당 업무, 요구 자격 요건</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md bg-white"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                placeholder="예: 영어선생(자격요건:TOEIC900점이상)"
              />
            </div>

            {/* 보유 자격증 */}
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">보유 자격증</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md bg-white"
                value={certificate}
                onChange={(e) => setCertificate(e.target.value)}
                placeholder="보유 자격증"
              />
            </div>
          </div>

          {/* 오른쪽 섹션 - 업무 경력 */}
          <div className="flex flex-col gap-3 w-1/2">
            {/* 업무 경력 선택 */}
            <div className="p-4 bg-white rounded-md shadow-md">
              <label className="block text-[18px] font-medium">업무 경력</label>
              <select
                className="border p-2 w-full rounded-md bg-white"
                value={experience}
                onChange={handleExperienceChange}
              >
                <option value="none">무경력</option>
                <option value="custom">직접 작성</option>
              </select>

              {/* "직접 작성" 선택 시 업무 경력 입력 필드 */}
              {experience === "custom" && (
                <div className="mt-2">
                  {customExperience.map((exp, index) => (
                    <div key={exp.id} ref={index === customExperience.length - 1 ? lastExperienceRef : null} className="border p-4 rounded-md mt-2 bg-gray-50">
                      <span className="font-semibold">{index + 1}.</span>
                      <input
                        type="text"
                        className="border p-3 w-full rounded-md mt-2"
                        placeholder="회사 이름"
                        value={exp.company}
                        onChange={(e) =>
                          setCustomExperience(
                            customExperience.map(item =>
                              item.id === exp.id ? { ...item, company: e.target.value } : item
                            )
                          )
                        }
                      />
                      <div className="flex space-x-2 mt-2">
                        <DatePicker
                          selected={exp.joinDate}
                          onChange={(date) =>
                            setCustomExperience(
                              customExperience.map(item =>
                                item.id === exp.id
                                  ? { ...item, joinDate: date, leaveDate: date > (exp.leaveDate || date) ? null : exp.leaveDate }
                                  : item
                              )
                            )
                          }
                          className="border p-3 rounded-md w-full"
                          placeholderText="입사 날짜"
                          maxDate={new Date().setDate(new Date().getDate() - 1)} // 오늘 이전까지만 선택 가능
                        />

                        <DatePicker
                          selected={exp.leaveDate}
                          onChange={(date) =>
                            setCustomExperience(
                              customExperience.map(item =>
                                item.id === exp.id ? { ...item, leaveDate: date } : item
                              )
                            )
                          }
                          className="border p-3 rounded-md w-full"
                          placeholderText="퇴사 날짜"
                          minDate={exp.joinDate} // 입사 날짜 이후만 선택 가능
                          disabled={!exp.joinDate} // 입사 날짜를 먼저 선택하도록 제한
                        />
                      </div>
                      <textarea
                        className="border p-3 w-full rounded-md mt-2"
                        placeholder="업무 내용 작성"
                        value={exp.details}
                        onChange={(e) =>
                          setCustomExperience(
                            customExperience.map(item =>
                              item.id === exp.id ? { ...item, details: e.target.value } : item
                            )
                          )
                        }
                      />
                      <button onClick={() => removeExperience(exp.id)} className="text-red-500 mt-2">
                        삭제
                      </button>
                    </div>
                  ))}
                  <button onClick={addExperience} className="bg-blue-500 text-white p-3 rounded-md mt-2">
                    추가
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 지원 동기 섹션 */}
        <div className="p-4 bg-white rounded-md shadow-md w-full flex gap-3">
          <div className="flex flex-col w-full">
            <label className="block text-[18px] font-medium">지원 동기</label>
            <textarea
              className="border p-2 w-full rounded-md bg-white"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="지원 동기를 입력하세요"
              rows={5}
            />
          </div>
        </div>

        {/* 면접 질문 요청 버튼 */}
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

        {/* 면접 질문 및 답변 */}
        {questions.length > 0 && (
          <div className="mt-5 space-y-5 w-full">
            {questions.map((q, index) => (
              <div
                key={index}
                ref={index === 0 ? firstQuestionRef : null}
                className={`p-5 rounded-md shadow-md ${backgroundColors[index % backgroundColors.length]}`}
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
    </div>
  );
};

export default InterviewHelpNext;
