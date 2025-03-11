import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Motivation from "./pages/Motivation"; 
import ResumeProcessing from "./pages/ResumeProcessing"; // 페이지 2

function App() {
  return (
    <Router>
      {/* ✅ 상단바 (모든 페이지에서 보이도록) */}
      <Navbar />

      {/* ✅ 전체 배경을 유지하면서, 컨텐츠 너비만 제한 */}
      <div className="pt-20 p-6 w-full">
        <Routes>
          <Route path="/" element={<Motivation />} />
          <Route path="/resume-processing" element={<ResumeProcessing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
