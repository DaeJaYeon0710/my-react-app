import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation(); // 현재 URL 경로 확인

  return (
    <nav className="relative bg-white shadow-md">
      {/* 상단바 전체를 중앙에 정렬 */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* ✅ 왼쪽: 로고 (버튼화 및 클릭 시 홈 이동) */}
        <Link
          to="/"
          className="text-4xl font-medium cursor-pointer absolute left-0 pl-4"
        >
          <span className="text-gray-800">이력서</span> <span className="text-teal-500">AI</span>
        </Link>

        {/* ✅ 네비게이션 메뉴 */}
        <div className="flex justify-center flex-grow">
          <div className="flex space-x-6">
            {/* 홈 버튼 */}
            <Link
              to="/"
              className={`text-xl px-4 py-2 transition duration-300 ${
                location.pathname === "/"
                  ? "text-black border-b-4 border-gray-700 pb-1 cursor-default"
                  : "text-black hover:bg-black hover:text-teal-500 rounded-md"
              }`}
            >
              홈
            </Link>

            {/* 이력서 작성 버튼 */}
            <Link
              to="/motivation"
              className={`text-xl px-4 py-2 transition duration-300 ${
                location.pathname === "/motivation" ||
                location.pathname === "/resume-processing" ||
                location.pathname === "/career-goals"
                  ? "text-black border-b-4 border-gray-700 pb-1 cursor-default"
                  : "text-black hover:bg-black hover:text-teal-500 rounded-md"
              }`}
            >
              이력서 작성
            </Link>

            {/* 면접 도움 버튼 */}
            <Link
  to="/interviewhelp"
  className={`text-xl px-4 py-2 transition duration-300 ${
    location.pathname === "/interview-help" || 
    location.pathname === "/interview-help-next" // ✅ InterviewHelpNext 페이지에서도 활성화
      ? "text-black border-b-4 border-gray-700 pb-1 cursor-default"
      : "text-black hover:bg-black hover:text-teal-500 rounded-md"
  }`}
>
  면접 도움
</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
