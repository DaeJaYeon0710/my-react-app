import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [showBox, setShowBox] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adVisible, setAdVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowBox(true), 300);
    setTimeout(() => setShowText1(true), 1000);
    setTimeout(() => setShowText2(true), 1800);
    setTimeout(() => setShowButton(true), 2600);
    setTimeout(() => setShowAd(true), 2600);
  
    // ✅ 추가된 코드 (광고 페이드인 시점 설정)
    setTimeout(() => setAdVisible(true), 2800);
  }, []);

  // 🚨 광고 초기화 useEffect 추가 🚨
  useEffect(() => {
    if (showAd && window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, [showAd]);

  return (
    <div className="h-[80vh] flex flex-col items-center justify-start pt-32">
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 ${
          showBox
            ? "w-full max-w-4xl p-10 opacity-100 scale-100"
            : "w-20 h-20 opacity-0 scale-50"
        }`}
      >
        <h1
          className={`text-5xl font-bold text-center font-gong transition-all duration-1000 ${
            showText1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          작성하기 어려운
          <br className="mb-1" />
          <span className="text-purple-600">지원동기</span>와{" "}
          <span className="text-orange-500">입사 후 포부</span>
        </h1>

        <p
          className={`mt-4 text-xl font-normal text-teal-500 text-center font-gong transition-all duration-1000 ${
            showText2 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
        >
          AI에게 맡기세요!
        </p>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/motivation")}
            className={`px-10 py-3 border border-black rounded-full text-black text-lg font-medium font-gong transition-all duration-500 ${
              showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } hover:bg-gray-200 hover:duration-200`}
          >
            바로 체험하기
          </button>
        </div>
      </div>

      {showAd && (
  <div
    className={`mt-6 bg-white bg-opacity-50 p-2 rounded-lg shadow-md transition-opacity duration-1000 ease-in-out ${
      adVisible ? "opacity-100" : "opacity-0"
    }`}
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
)}
    </div>
  );
}

export default Home;
