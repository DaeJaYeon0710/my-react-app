import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Motivation from "./pages/Motivation";
import ResumeProcessing from "./pages/ResumeProcessing";
import CareerGoals from "./pages/CareerGoals";
import InterviewHelp from "./pages/InterviewHelp";
import InterviewHelpNext from "./pages/InterviewHelpNext"; // ✅ 추가 확인!

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20 p-6 w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/resume-processing" element={<ResumeProcessing />} />
          <Route path="/career-goals" element={<CareerGoals />} />
          <Route path="/interview-help" element={<InterviewHelp />} />
          <Route path="/interview-help-next" element={<InterviewHelpNext />} /> {/* ✅ 추가 확인! */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
