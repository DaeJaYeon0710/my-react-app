import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Motivation from "./pages/Motivation";
import ResumeProcessing from "./pages/ResumeProcessing";
import CareerGoals from "./pages/CareerGoals";

function App() {
  return (
    <Router>
      {/* ✅ 상단바 (모든 페이지에서 보이도록) */}
      <Navbar />

      {/* ✅ 전체 배경을 유지하면서, 컨텐츠 너비만 제한 */}
      <div className="pt-20 p-6 w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/resume-processing" element={<ResumeProcessing />} />
          <Route path="/career-goals" element={<CareerGoals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
