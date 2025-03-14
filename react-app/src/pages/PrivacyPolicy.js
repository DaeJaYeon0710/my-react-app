// ✅ 개인정보 보호정책 (PrivacyPolicy.jsx)
const PrivacyPolicy = () => {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* ✅ 페이지 제목 크기 증가 */}
        <h1 className="text-3xl font-bold mb-6">개인정보 보호정책</h1>
        <p className="text-lg mb-6">
          본 웹사이트는 사용자의 개인정보 보호를 중요하게 생각하며, 다음과 같은 정책을 따릅니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">1. 수집하는 정보</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 OpenAI API를 이용하며, 사용자의 개인 정보(이름, 이메일, 연락처 등)를 별도로 수집하지 않습니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">2. 데이터 저장 및 보안</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 사용자가 입력한 데이터를 별도로 저장하지 않습니다.<br />
          또한 OpenAI API 역시 사용자의 입력 데이터를 저장하지 않으며, 사용자의 개인 정보 보호를 최우선으로 합니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">3. 쿠키 및 방문 기록</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 별도의 방문 기록을 추적하거나 쿠키(cookie)를 사용하지 않습니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">4. 광고 게재 및 쿠키 사용 안내</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 서비스 운영을 위해 구글 애드센스(Google AdSense)를 통한 광고를 게재하고 있으며,<br />
          광고 제공 과정에서 사용자 브라우저에 쿠키(cookie)를 사용할 수 있습니다.<br />
          쿠키 사용을 원치 않을 경우 브라우저 설정에서 언제든지 쿠키 사용을 차단할 수 있습니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">5. 제3자 서비스</h2>
        <p className="text-lg mb-6">
          본 웹사이트는 OpenAI API를 사용하여 AI 서비스를 제공하며, OpenAI와 직접적으로 연관되지 않으며, OpenAI의 입장을 대변하지 않습니다.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">6. 정책 변경</h2>
        <p className="text-lg mb-6">
          본 개인정보 보호정책은 필요에 따라 수정될 수 있으며, 중대한 변경 사항 발생 시 웹사이트를 통해 사전에 고지합니다.
        </p>
  
        <p className="text-gray-600 mt-8 text-lg">
          최종 업데이트: {new Date().getFullYear()}년 3월 13일
        </p>
  
        <p className="mt-2 text-lg">
          © {new Date().getFullYear()} 이력서AI. All rights reserved.
        </p>
      </div>
    );
  };
  
  export default PrivacyPolicy;
  