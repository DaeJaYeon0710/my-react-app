import { useEffect } from "react";

const SideAds = () => {
  useEffect(() => {
    // ✅ 광고가 이미 로드되었는지 확인 후 실행
    const loadAds = () => {
      if (window.adsbygoogle && document.querySelectorAll(".adsbygoogle[data-ad-status='done']").length === 0) {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.error("Google AdSense Error: ", e);
        }
      }
    };

    // ✅ 광고 로드를 1초 지연 (렌더링 후 실행)
    const timer = setTimeout(() => {
      loadAds();
    }, 1000);

    return () => clearTimeout(timer); // ✅ cleanup (컴포넌트 언마운트 시 타이머 제거)
  }, []);

  return (
    <>
      {/* ✅ 왼쪽 광고 (160x600) */}
      <aside
        className="fixed left-2 top-24 w-[160px] h-[600px] bg-gray-900 bg-opacity-70 shadow-lg hidden lg:flex 
                   items-center justify-center text-white text-sm rounded-lg animate-fadeIn transition-all duration-500"
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "160px", height: "600px" }}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="2010910414"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>

      {/* ✅ 오른쪽 광고 (160x600) */}
      <aside
        className="fixed right-2 top-24 w-[160px] h-[600px] bg-gray-900 bg-opacity-70 shadow-lg hidden lg:flex 
                   items-center justify-center text-white text-sm rounded-lg animate-fadeIn transition-all duration-500"
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "160px", height: "600px" }}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="2010910414"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    </>
  );
};

export default SideAds;
