import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation(); // 현재 URL 경로 확인
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let timeoutId = null;

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <nav className="relative bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-4xl font-medium cursor-pointer absolute left-0 pl-4">
          <span className="text-gray-800">이력서</span> <span className="text-teal-500">도와핑</span>
        </Link>

        <div className="flex justify-center flex-grow">
          <div className="flex space-x-6 relative">
            {/* ✅ 홈 버튼 */}
            <Link
              to="/"
              className={`text-xl px-4 py-2 transition duration-300 ${
                location.pathname === "/" ? "text-black border-b-4 border-gray-700 pb-1 cursor-default" : "text-black hover:bg-black hover:text-teal-500 rounded-md"
              }`}
            >
              홈
            </Link>

            {/* ✅ 이력서 작성 버튼 */}
            <Link
              to="/motivation"
              className={`text-xl px-4 py-2 transition duration-300 ${
                ["/motivation", "/resume-processing", "/career-goals"].includes(location.pathname) ? "text-black border-b-4 border-gray-700 pb-1 cursor-default" : "text-black hover:bg-black hover:text-teal-500 rounded-md"
              }`}
            >
              이력서 작성
            </Link>

            {/* ✅ 면접 도움 버튼 + 드롭다운 */}
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button
                className={`text-xl px-4 py-2 transition duration-300 ${
                  ["/interview-help", "/interview-help-next", "/interview-strengths-weaknesses"].includes(location.pathname)
                    ? "text-black border-b-4 border-gray-700 pb-1 cursor-default"
                    : "text-black hover:bg-black hover:text-teal-500 rounded-md"
                }`}
              >
                면접 도움
              </button>

              {/* ✅ 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <Link
                    to="/interview-strengths-weaknesses"
                    className="block px-4 py-2 text-black hover:bg-gray-200 transition duration-300"
                  >
                    성격의 장단점
                  </Link>
                  <Link
                    to="/interview-help" // 기존 InterviewHelp.js로 연결
                    className="block px-4 py-2 text-black hover:bg-gray-200 transition duration-300"
                  >
                    면접 예상 질문
                  </Link>
                </div>
              )}
            </div>
            {/* ✅ 여기까지 감싸져 있어서 마우스를 내려도 창이 유지됨 */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
