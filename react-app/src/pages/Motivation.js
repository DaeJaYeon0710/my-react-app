import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Motivation() {
  const navigate = useNavigate();

  // 입력 상태 관리
  const [companyName, setCompanyName] = useState(""); // 지원 회사
  const [workType, setWorkType] = useState(""); // 업무 형태
  const [experience, setExperience] = useState("none"); // 업무 경력 선택
  const [customExperience, setCustomExperience] = useState([]); // 직접 작성한 경력 리스트
  const [certificateOption, setCertificateOption] = useState("none"); // 보유 자격증 선택
  const [certificates, setCertificates] = useState([]); // 직접 작성한 자격증 리스트

  const lastExperienceRef = useRef(null); // 추가된 입력 칸을 참조할 ref


  // ✅ 업무 경력 추가
  const addExperience = () => {
    const newExperience = { id: Date.now(), company: "", joinDate: null, leaveDate: null, details: "" };
  
    setCustomExperience(prevExperience => {
      const updatedExperience = [...prevExperience, newExperience];
  
      // 🔥 추가된 입력 칸으로 자동 스크롤
      setTimeout(() => {
        if (lastExperienceRef.current) {
          lastExperienceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
  
      return updatedExperience;
    });
  };

  // ✅ 업무 경력 삭제
  const removeExperience = (id) => {
    const updatedExperience = customExperience.filter(exp => exp.id !== id);
    setCustomExperience(updatedExperience);
    if (updatedExperience.length === 0) {
      setExperience("none"); // 모든 작성 칸 삭제 시 선택지로 복귀
    }
  };

  // ✅ 보유 자격증 추가
  const addCertificate = () => {
    setCertificates([...certificates, { id: Date.now(), name: "" }]);
  };

  // ✅ 보유 자격증 삭제
  const removeCertificate = (id) => {
    const updatedCertificates = certificates.filter(cert => cert.id !== id);
    setCertificates(updatedCertificates);
  };

  // ✅ 보유 자격증 선택 변경 시 입력 데이터 초기화
  const handleCertificateChange = (e) => {
    const value = e.target.value;
    setCertificateOption(value);

    if (value === "none") {
      setCertificates([]); // "없음" 선택 시 입력했던 데이터 삭제
    } else if (value === "custom" && certificates.length === 0) {
      addCertificate(); // "작성" 선택 시 자동으로 작성 칸 추가
    }
  };

  // ✅ 완료 버튼 클릭 시 유효성 검사 및 페이지 이동
  const handleComplete = () => {
    if (!companyName.trim()) {
      alert("⚠️ 지원 회사를 입력해주세요.");
      return;
    }
    if (!workType.trim()) {
      alert("⚠️ 회사에서 요구하는 담당 업무를 입력해주세요.");
      return;
    }

    navigate("/resume-processing", {
      state: { companyName, workType, experience, customExperience, certificates }
    });
  };

  return (
    <div className="min-h-[80vh] bg-blue-200 flex flex-col items-center -mt-5">
      {/* ✅ 전체 컨텐츠 박스 */}
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg flex flex-col animate-fadeIn">
        
        {/* 🔹 입력 필드들을 2열 레이아웃에서 독립적으로 조정 */}
        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 지원 회사 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[22px] font-medium">지원 회사</label>
              <input
                type="text"
                className="border p-3 w-full rounded-md text-lg"
                placeholder="지원할 회사명을 입력하세요"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/*업무 경력 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block text-[22px] font-medium">업무 경력</label>
              <select
                className="border p-3 w-full rounded-md text-lg"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  if (e.target.value === "custom" && customExperience.length === 0) {
                    addExperience();
                  }
                }}
              >
                <option value="none">무경력</option>
                <option value="custom">직접 작성</option>
              </select>

              {experience === "custom" && (
                <div className="mt-2">
                  {customExperience.map((exp, index) => (
                    <div key={exp.id} ref={index === customExperience.length - 1 ? lastExperienceRef : null} className="border p-4 rounded-md mt-2 bg-gray-50">
                      <span className="font-semibold">{index + 1}.</span>
                      <input type="text" className="border p-3 w-full rounded-md mt-2" placeholder="예: 회사 이름, 프리랜서 활동, 개인 과외" value={exp.company}
                        onChange={(e) => setCustomExperience(customExperience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item))} />
                      <div className="flex space-x-2 mt-2">
                      <DatePicker 
  selected={exp.joinDate} 
  onChange={(date) =>
    setCustomExperience(customExperience.map(item => 
      item.id === exp.id ? { ...item, joinDate: date, leaveDate: date > (exp.leaveDate || date) ? null : exp.leaveDate } : item
    ))
  } 
  className="border p-3 rounded-md w-full" 
  placeholderText="입사 날짜" 
  maxDate={new Date().setDate(new Date().getDate() - 1)} // 🔥 오늘 이전까지만 선택 가능
/>

<DatePicker 
  selected={exp.leaveDate} 
  onChange={(date) =>
    setCustomExperience(customExperience.map(item => 
      item.id === exp.id ? { ...item, leaveDate: date } : item
    ))
  } 
  className="border p-3 rounded-md w-full" 
  placeholderText="퇴사 날짜"
  minDate={exp.joinDate} // 🔥 입사 날짜 이후만 선택 가능
  disabled={!exp.joinDate} // 🔥 입사 날짜를 먼저 선택하도록 제한
/>
                      </div>
                      <textarea className="border p-3 w-full rounded-md mt-2" placeholder="업무 내용 작성" value={exp.details}
                        onChange={(e) => setCustomExperience(customExperience.map(item => item.id === exp.id ? { ...item, details: e.target.value } : item))} />
                      <button onClick={() => removeExperience(exp.id)} className="text-red-500 mt-2">삭제</button>
                    </div>
                  ))}
                  <button onClick={addExperience} className="bg-blue-500 text-white p-3 rounded-md mt-2">추가</button>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="flex flex-col gap-5 w-1/2">
            {/* 업무 형태 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block text-[22px] font-medium">회사에서 요구하는 담당 업무, 요구 자격 요건</label>
              <input
                type="text"
                className="border p-3 w-full rounded-md text-base"
                placeholder="예: 영어선생(자격요건:TOEIC900점이상)"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              />
            </div>

            {/* 보유 자격증 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block text-[22px] font-medium">보유 자격증</label>
              <select className="border p-3 w-full rounded-md text-lg" value={certificateOption} onChange={handleCertificateChange}>
                <option value="none">없음</option>
                <option value="custom">작성</option>
              </select>

              {certificateOption === "custom" && (
                <div className="mt-2">
                  {certificates.map((cert, index) => (
                    <div key={cert.id} className="flex space-x-2 mb-2">
                      <input type="text" className="border p-3 w-full rounded-md" value={cert.name}
                        onChange={(e) => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c))} />
                      <button onClick={() => removeCertificate(cert.id)} className="text-red-500">삭제</button>
                    </div>
                  ))}
                  <button onClick={addCertificate} className="bg-blue-500 text-white p-3 rounded-md mt-2">추가</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ 완료 버튼 추가 (하단에 위치) */}
        <div className="flex justify-end mt-12">
  <button
    onClick={handleComplete}
    className="bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl flex items-center space-x-2 
               transition-all duration-300 hover:bg-white hover:text-teal-500 border-2 border-teal-500"
  >
    <span>지원동기 작성하러 가기</span>
    <span className="text-3xl">→</span>
  </button>
</div>
      </div>
      {/* ✅ 광고 (페이지 로드 시 즉시 표시) */}
      <div
        className="mt-6 bg-white bg-opacity-50 p-2 rounded-lg shadow-md" // ✅ 페이드인 효과 삭제
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
}

export default Motivation;
