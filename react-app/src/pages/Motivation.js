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

  // 유사 업무 경력 추가 (추가 버튼 복구 ✅)
  const addExperience = () => {
    setCustomExperience([
      ...customExperience,
      { id: Date.now(), company: "", joinDate: null, leaveDate: null, details: "" }
    ]);
  };

  // 유사 업무 경력 삭제
  const removeExperience = (id) => {
    const updatedExperience = customExperience.filter(exp => exp.id !== id);
    setCustomExperience(updatedExperience);
    if (updatedExperience.length === 0) {
      setExperience("none"); // 선택지로 복귀
    }
  };

  // 보유 자격증 추가 (추가 버튼 복구 ✅)
  const addCertificate = () => {
    setCertificates([...certificates, { id: Date.now(), name: "" }]);
  };

  // 보유 자격증 삭제
  const removeCertificate = (id) => {
    const updatedCertificates = certificates.filter(cert => cert.id !== id);
    setCertificates(updatedCertificates);
    if (updatedCertificates.length === 0) {
      setCertificateOption("none"); // 선택지로 복귀
    }
  };

  // 유사 업무 경력 변경 (자동 생성 + 추가 버튼 유지)
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    setExperience(value);
    if (value === "custom" && customExperience.length === 0) {
      addExperience(); // 자동 생성
    } else if (value === "none") {
      setCustomExperience([]);
    }
  };

  // 보유 자격증 변경 (자동 생성 + 추가 버튼 유지)
  const handleCertificateChange = (e) => {
    const value = e.target.value;
    setCertificateOption(value);
    if (value === "custom" && certificates.length === 0) {
      addCertificate(); // 자동 생성
    } else if (value === "none") {
      setCertificates([]);
    }
  };

  // 완료 버튼 클릭 시 유효성 검사 및 페이지 이동
  const handleComplete = () => {
    if (!companyName.trim()) {
      alert("⚠️ 지원 회사를 입력해주세요.");
      return;
    }
    if (!workType.trim()) {
      alert("⚠️ 입사하면 맡게 될 업무 형태를 입력해주세요.");
      return;
    }

    // 페이지2로 이동하며 데이터 전달
    navigate("/resume-processing", {
      state: { companyName, workType, experience, customExperience, certificates }
    });
  };

  return (
    <div className="pt-20 p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">지원 동기 작성</h2>

      {/* 지원 회사 입력 */}
      <div className="mb-6">
        <label className="block font-semibold">지원 회사</label>
        <input
          type="text"
          className="border p-2 w-full rounded-md"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="지원할 회사명을 입력하세요"
        />
      </div>

      {/* 업무 형태 입력 */}
      <div className="mb-6">
        <label className="block font-semibold">입사하면 맡게 될 업무 형태</label>
        <input
          type="text"
          className="border p-2 w-full rounded-md"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          placeholder="예: 마케팅, 개발자, 영업"
        />
      </div>

      {/* 유사 업무 경력 선택 */}
      <div className="mb-6">
        <label className="block font-semibold">유사 업무 경력</label>
        <select
          className="border p-2 w-full rounded-md"
          value={experience}
          onChange={handleExperienceChange}
        >
          <option value="none">무경력</option>
          <option value="custom">직접 작성</option>
        </select>

        {/* 직접 작성 선택 시 입력 폼 표시 */}
        {experience === "custom" && (
          <div>
            {customExperience.map((exp, index) => (
              <div key={exp.id} className="border p-4 rounded-md mt-2">
                <span className="font-semibold">{index + 1}.</span>
                <input
                  type="text"
                  className="border p-2 w-full rounded-md mt-2"
                  placeholder="회사 이름"
                  value={exp.company}
                  onChange={(e) =>
                    setCustomExperience(
                      customExperience.map((item) =>
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
                        customExperience.map((item) =>
                          item.id === exp.id ? { ...item, joinDate: date } : item
                        )
                      )
                    }
                    className="border p-2 rounded-md w-full"
                    placeholderText="입사 날짜"
                  />
                  <DatePicker
                    selected={exp.leaveDate}
                    onChange={(date) =>
                      setCustomExperience(
                        customExperience.map((item) =>
                          item.id === exp.id ? { ...item, leaveDate: date } : item
                        )
                      )
                    }
                    className="border p-2 rounded-md w-full"
                    placeholderText="퇴사 날짜"
                  />
                </div>
                <textarea
                  className="border p-2 w-full rounded-md mt-2"
                  placeholder="업무 내용 작성"
                  value={exp.details}
                  onChange={(e) =>
                    setCustomExperience(
                      customExperience.map((item) =>
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
            <button onClick={addExperience} className="bg-blue-500 text-white p-2 rounded-md mt-2">
              추가
            </button>
          </div>
        )}
      </div>

      {/* 보유 자격증 */}
      <div className="mb-6">
        <label className="block font-semibold">보유 자격증</label>
        <select
          className="border p-2 w-full rounded-md"
          value={certificateOption}
          onChange={handleCertificateChange}
        >
          <option value="none">없음</option>
          <option value="custom">작성</option>
        </select>
        {certificateOption === "custom" && (
          <div>
            {certificates.map((cert, index) => (
              <div key={cert.id} className="flex space-x-2 mb-2 items-center">
                <span className="font-semibold">{index + 1}.</span>
                <input
                  type="text"
                  className="border p-2 w-full rounded-md"
                  value={cert.name}
                  onChange={(e) =>
                    setCertificates(
                      certificates.map((c) =>
                        c.id === cert.id ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                />
                <button onClick={() => removeCertificate(cert.id)} className="text-red-500">
                  삭제
                </button>
              </div>
            ))}
            <button onClick={addCertificate} className="bg-blue-500 text-white p-2 rounded-md">
              추가
            </button>
          </div>
        )}
      </div>

      {/* 완료 버튼 */}
      <button onClick={handleComplete} className="bg-green-500 text-white p-2 rounded-md w-full">
        완료
      </button>
    </div>
  );
}

export default Motivation;
