import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between z-50">
      {/* ✅ 왼쪽: 로고 */}
      <h1 className="text-2xl font-bold text-gray-700 ml-6">이력서AI</h1>

      {/* ✅ 가운데: 네비게이션 메뉴 */}
      <div className="flex-grow flex justify-center space-x-6">
        <Link to="/" className="text-blue-500 font-semibold hover:underline">
          지원동기 작성
        </Link>
        <Link to="/interview-help" className="text-blue-500 font-semibold hover:underline">
          면접 도움
        </Link>
      </div>

      {/* ✅ 오른쪽: 빈 공간 (디자인 정렬 맞추기) */}
      <div className="mr-6"></div>
    </nav>
  );
}

export default Navbar;
