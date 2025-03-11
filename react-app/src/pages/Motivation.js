import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Motivation() {
  const navigate = useNavigate();

  // 입력 상태 관리
  const [companyName, setCompanyName] = useState(""); // 지원 회사
  const [workType, setWorkType] = useState(""); // 업무 형태
  const [experience, setExperience] = useState("none"); // 유사 업무 경력 선택
  const [customExperience, setCustomExperience] = useState([]); // 직접 작성한 경력 리스트
  const [certificateOption, setCertificateOption] = useState("none"); // 보유 자격증 선택
  const [certificates, setCertificates] = useState([]); // 직접 작성한 자격증 리스트

  // ✅ 유사 업무 경력 추가
  const addExperience = () => {
    setCustomExperience([
      ...customExperience,
      { id: Date.now(), company: "", joinDate: null, leaveDate: null, details: "" }
    ]);
  };

  // ✅ 유사 업무 경력 삭제
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
      alert("⚠️ 입사하면 맡게 될 업무 형태를 입력해주세요.");
      return;
    }

    navigate("/resume-processing", {
      state: { companyName, workType, experience, customExperience, certificates }
    });
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center pt-24">
      {/* ✅ 전체 컨텐츠 박스 */}
      <div className="w-full max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg flex flex-col">
        
        {/* 🔹 입력 필드들을 2열 레이아웃에서 독립적으로 조정 */}
        <div className="flex gap-x-16">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col gap-14 w-1/2">
            {/* 지원 회사 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block font-semibold">지원 회사</label>
              <input
                type="text"
                className="border p-3 w-full rounded-md"
                placeholder="지원할 회사명을 입력하세요"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* 유사 업무 경력 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block font-semibold">유사 업무 경력</label>
              <select
                className="border p-3 w-full rounded-md"
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
                    <div key={exp.id} className="border p-4 rounded-md mt-2 bg-gray-50">
                      <span className="font-semibold">{index + 1}.</span>
                      <input type="text" className="border p-3 w-full rounded-md mt-2" placeholder="회사 이름" value={exp.company}
                        onChange={(e) => setCustomExperience(customExperience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item))} />
                      <div className="flex space-x-2 mt-2">
                        <DatePicker selected={exp.joinDate} onChange={(date) =>
                          setCustomExperience(customExperience.map(item => item.id === exp.id ? { ...item, joinDate: date } : item))
                        } className="border p-3 rounded-md w-full" placeholderText="입사 날짜" />
                        <DatePicker selected={exp.leaveDate} onChange={(date) =>
                          setCustomExperience(customExperience.map(item => item.id === exp.id ? { ...item, leaveDate: date } : item))
                        } className="border p-3 rounded-md w-full" placeholderText="퇴사 날짜" />
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
          <div className="flex flex-col gap-14 w-1/2">
            {/* 업무 형태 */}
            <div className="p-5 bg-white rounded-md shadow-md">
              <label className="block font-semibold">입사하면 맡게 될 업무 형태</label>
              <input
                type="text"
                className="border p-3 w-full rounded-md"
                placeholder="예: 마케팅, 개발자, 영업"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              />
            </div>

            {/* 보유 자격증 */}
            <div className="p-5 bg-white rounded-md shadow-md flex flex-col">
              <label className="block font-semibold">보유 자격증</label>
              <select className="border p-3 w-full rounded-md" value={certificateOption} onChange={handleCertificateChange}>
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
          <button onClick={handleComplete} className="bg-black text-white px-6 py-3 rounded-full shadow-lg text-lg flex items-center space-x-2">
            <span>완료</span>
            <span className="text-xl">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Motivation;
