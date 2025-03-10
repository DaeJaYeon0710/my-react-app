import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Motivation() {
  const navigate = useNavigate();
  
  // 상태 관리
  const [companyName, setCompanyName] = useState("");
  const [workType, setWorkType] = useState("");
  const [experience, setExperience] = useState("none");
  const [customExperience, setCustomExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // 유사 업무 경력 추가
  const addExperience = () => {
    setCustomExperience([
      ...customExperience,
      { id: Date.now(), company: "", joinDate: null, leaveDate: null, details: "" }
    ]);
  };

  // 유사 업무 경력 삭제
  const removeExperience = (id) => {
    const updatedExperience = customExperience.filter((exp) => exp.id !== id);
    setCustomExperience(updatedExperience);
    
    // 모든 작성칸이 삭제되면 선택지로 돌아감
    if (updatedExperience.length === 0) {
      setExperience("none");
    }
  };

  // 보유 자격증 추가
  const addCertificate = () => {
    setCertificates([...certificates, { id: Date.now(), name: "" }]);
  };

  // 보유 자격증 삭제
  const removeCertificate = (id) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };

  // 제출 처리 (입력값 검증 추가)
  const handleSubmit = () => {
    if (!companyName.trim()) {
      alert("지원 회사를 입력해주세요.");
      return;
    }
    if (!workType.trim()) {
      alert("입사하면 맡게 될 업무 형태를 입력해주세요.");
      return;
    }

    navigate("/resume-processing", {
      state: { companyName, workType, experience, customExperience, certificates }
    });
  };

  return (
    <div className="pt-20 p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">지원동기 작성</h2>

      {/* 지원 회사 */}
      <div className="mb-4">
        <label className="block font-semibold">지원 회사</label>
        <input
          type="text"
          className="border p-2 w-full rounded-md"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      {/* 입사 후 업무 형태 */}
      <div className="mb-4">
        <label className="block font-semibold">입사하면 맡게 될 업무 형태</label>
        <input
          type="text"
          className="border p-2 w-full rounded-md"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        />
      </div>

      {/* 유사 업무 경력 */}
      <div className="mb-6">
        <label className="block font-semibold">유사 업무 경력</label>
        <select
          className="border p-2 w-full rounded-md"
          value={experience}
          onChange={(e) => {
            setExperience(e.target.value);
            if (e.target.value === "custom") addExperience(); // 직접 작성 선택 시 자동 생성
          }}
        >
          <option value="none">무경력</option>
          <option value="custom">직접 작성</option>
        </select>

        {/* 직접 작성 선택 시 경력 입력칸 표시 */}
        {experience === "custom" && (
          <div className="mt-2">
            {customExperience.map((exp, index) => (
              <div key={exp.id} className="border p-2 mb-2 rounded-md">
                <span className="font-semibold">{index + 1}.</span> {/* 번호 표시 */}
                <input
                  type="text"
                  placeholder="회사명"
                  className="border p-2 w-full rounded-md mt-1"
                  value={exp.company}
                  onChange={(e) =>
                    setCustomExperience(customExperience.map((ex) =>
                      ex.id === exp.id ? { ...ex, company: e.target.value } : ex
                    ))
                  }
                />
                <div className="flex space-x-2 mt-2">
                  <DatePicker
                    selected={exp.joinDate}
                    onChange={(date) =>
                      setCustomExperience(customExperience.map((ex) =>
                        ex.id === exp.id ? { ...ex, joinDate: date } : ex
                      ))
                    }
                    dateFormat="yyyy년 MM월 dd일"
                    placeholderText="입사 날짜"
                    className="border p-2 rounded-md w-40 sm:w-48 md:w-56 lg:w-64"
                  />
                  <DatePicker
                    selected={exp.leaveDate}
                    onChange={(date) =>
                      setCustomExperience(customExperience.map((ex) =>
                        ex.id === exp.id ? { ...ex, leaveDate: date } : ex
                      ))
                    }
                    dateFormat="yyyy년 MM월 dd일"
                    placeholderText="퇴사 날짜"
                    className="border p-2 rounded-md w-40 sm:w-48 md:w-56 lg:w-64"
                  />
                </div>
                <textarea
                  className="border p-2 w-full rounded-md mt-2"
                  placeholder="업무 내용 및 경력 작성"
                  value={exp.details}
                  onChange={(e) =>
                    setCustomExperience(customExperience.map((ex) =>
                      ex.id === exp.id ? { ...ex, details: e.target.value } : ex
                    ))
                  }
                  rows="3"
                ></textarea>
                <button
                  className="text-red-500 mt-2"
                  onClick={() => removeExperience(exp.id)}
                >
                  삭제
                </button>
              </div>
            ))}
            <button onClick={addExperience} className="bg-blue-500 text-white p-2 rounded-md">
              추가
            </button>
          </div>
        )}
      </div>

      {/* 보유 자격증 */}
      <div className="mb-6">
        <label className="block font-semibold">보유 자격증</label>
        <button onClick={addCertificate} className="bg-blue-500 text-white p-2 rounded-md mb-2">
          자격증 추가
        </button>
        {certificates.map((cert, index) => (
          <div key={cert.id} className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{index + 1}.</span> {/* 번호 표시 */}
            <input
              type="text"
              className="border p-2 w-full rounded-md"
              placeholder="자격증명"
              value={cert.name}
              onChange={(e) =>
                setCertificates(certificates.map((c) =>
                  c.id === cert.id ? { ...c, name: e.target.value } : c
                ))
              }
            />
            <button onClick={() => removeCertificate(cert.id)} className="text-red-500">
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 완료 버튼 */}
      <button className="bg-green-500 text-white p-2 rounded-md w-full" onClick={handleSubmit}>
        완료
      </button>
    </div>
  );
}

export default Motivation;
