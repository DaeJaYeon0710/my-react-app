import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [showBox, setShowBox] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // 페이지 진입 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowBox(true), 300); // 흰색 박스 크기 확장
    setTimeout(() => setShowText1(true), 1000); // 첫 번째 텍스트 등장
    setTimeout(() => setShowText2(true), 1800); // 두 번째 텍스트 등장
    setTimeout(() => setShowButton(true), 2600); // 버튼 등장
  }, []);

  return (
    <div className="h-[80vh] flex flex-col items-center justify-start pt-32">
      {/* ✅ 전체 컨텐츠 박스 (처음엔 작은 크기에서 커지는 애니메이션) */}
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 ${
          showBox
            ? "w-full max-w-4xl p-10 opacity-100 scale-100"
            : "w-20 h-20 opacity-0 scale-50"
        }`}
      >
        {/* ✅ 첫 번째 텍스트 (AI 이력서) */}
        <h1
          className={`text-5xl font-bold text-center font-gong transition-all duration-1000 ${
            showText1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          AI가 직접 작성해주는<br />이력서
        </h1>

        {/* ✅ 두 번째 텍스트 (체험해보세요 - 민트색 적용) */}
        <p
          className={`mt-4 text-xl font-normal text-teal-500 text-center font-gong transition-all duration-1000 ${
            showText2 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
        >
          지금 바로 체험해보세요!
        </p>

        {/* ✅ 버튼 (처음엔 투명 → 서서히 등장) */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/motivation")}
            className={`px-10 py-3 border border-black rounded-full text-black text-lg font-medium font-gong transition-all duration-500 ${
              showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } hover:bg-gray-200 hover:duration-200`}
          >
            이력서 정보 작성하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
