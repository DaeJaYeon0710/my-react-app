import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* ✅ 이용약관 & 개인정보 보호정책 & About 페이지 이동 버튼 */}
        <div className="flex space-x-4 mb-4">
          <Link to="/terms" className="hover:underline">이용약관</Link>
          <span className="text-gray-500">|</span>
          <Link to="/privacy" className="hover:underline">개인정보 보호정책</Link>
          <span className="text-gray-500">|</span>
          <Link to="/about" className="hover:underline">About</Link> {/* ✅ About 페이지 추가 */}
        </div>

        {/* ✅ 법적 고지문 */}
        <p className="text-sm leading-relaxed">
          © {new Date().getFullYear()} 이력서AI. All rights reserved.
          <br />
          이 웹사이트는 OpenAI API를 활용하여 AI 기반 이력서 작성 서비스를 제공합니다.
          <br />
          [이력서AI]는 OpenAI의 공식 서비스가 아니며, OpenAI의 승인이나 지원을 받지 않았습니다.
          <br />
          OpenAI 및 ChatGPT는 OpenAI, Inc.의 상표 또는 등록 상표입니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
