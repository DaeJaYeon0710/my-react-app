// ✅ 이용약관 (Terms.jsx)
const Terms = () => {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* ✅ 페이지 제목 크기 증가 */}
        <h1 className="text-3xl font-bold mb-6">이용약관</h1>
        <p className="text-lg mb-6">
          본 웹사이트를 이용함으로써 아래 약관에 동의한 것으로 간주됩니다.
        </p>
  
        {/* ✅ 소제목 크기 증가 */}
        <h2 className="text-2xl font-semibold mt-8">1. 서비스 제공</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 OpenAI API를 활용하여 AI 기반 이력서 작성 서비스를 제공합니다.<br />
          AI가 생성한 응답은 참고용이며, 사용자가 최종적으로 검토하고 활용해야 합니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">2. 법적 책임</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 AI가 생성한 응답의 정확성 및 신뢰성에 대해 보장하지 않으며,<br />
          사용자가 이를 신중하게 검토한 후 활용해야 합니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">3. 금지된 행위</h2>
        <p className="text-lg mb-6">
          사용자는 본 서비스를 불법적이거나 부적절한 목적(불법 콘텐츠 생성, 악의적 사용 등)으로 사용해서는 안 됩니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">4. 광고 게재 안내</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 서비스 유지 및 운영을 위해 구글 애드센스(Google AdSense)를 통한 광고를 게재하고 있습니다.<br />
          광고 클릭을 통해 발생한 수익은 웹사이트 운영 및 서비스 품질 개선 목적으로 사용됩니다.
        </p>
  
        {/* ✅ 저작권 표기 */}
        <p className="text-gray-600 mt-8 text-lg">
          © {new Date().getFullYear()} 이력서AI. All rights reserved.
        </p>
      </div>
    );
  };
  
  export default Terms;
  