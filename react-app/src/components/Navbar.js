import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-700 ml-4">이력서AI</h1>
      <div className="space-x-4 mr-4">
        <Link to="/" className="text-blue-500 hover:underline">지원동기 작성</Link>
        <Link to="/interview-help" className="text-blue-500 hover:underline">면접 도움</Link>
      </div>
    </nav>
  );
}

export default Navbar;
