const About = () => {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* ✅ 페이지 제목 크기 증가 */}
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <p className="text-lg mb-6">
          본 웹사이트는 AI를 활용하여 사용자 맞춤 이력서 및 자기소개서를 생성하는 서비스입니다.
        </p>
  
        {/* ✅ 소제목 크기 증가 */}
        <h2 className="text-2xl font-semibold mt-8">📌 폰트 라이선스</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 <strong>눈누(noonnu.cc)에서 배포하는 "이사만루체"</strong> 폰트를 사용하고 있습니다.  
          <strong>이사만루체의 지적 재산권 및 모든 권리는 (주)공게임즈에 있으며,</strong>  
          상업적 용도를 포함하여 누구나 자유롭게 사용할 수 있습니다.  
          단, 폰트를 **임의로 수정하여 유료로 판매하는 행위는 금지됩니다.**
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">📌 서비스 정보</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 OpenAI API를 이용하며, OpenAI 또는 기타 공식 기관과 무관한 독립적인 서비스입니다.
        </p>
  
        {/* ✅ 저작권 표기 */}
        <p className="text-gray-600 mt-8 text-lg">
          © {new Date().getFullYear()} 당신의 웹사이트 이름. All rights reserved.
        </p>
      </div>
    );
  };
  
  export default About;
  