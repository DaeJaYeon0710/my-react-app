import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideAds from "./components/SideAds"; // ✅ 광고 컴포넌트 추가
import Home from "./pages/Home";
import Motivation from "./pages/Motivation";
import ResumeProcessing from "./pages/ResumeProcessing";
import CareerGoals from "./pages/CareerGoals";
import InterviewHelp from "./pages/InterviewHelp";
import InterviewHelpNext from "./pages/InterviewHelpNext";
import StrengthsWeaknesses from "./pages/StrengthsWeaknesses"; // ✅ 새로 추가한 페이지
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        {/* ✅ 네비게이션 바 */}
        <Navbar />
        
        {/* ✅ 광고 추가 */}
        <SideAds />

        {/* ✅ 메인 콘텐츠 (푸터가 밀려 올라오도록 flex 설정) */}
        <main className="flex-grow pt-20 p-6 w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motivation" element={<Motivation />} />
            <Route path="/resume-processing" element={<ResumeProcessing />} />
            <Route path="/career-goals" element={<CareerGoals />} />
            <Route path="/interview-help" element={<InterviewHelp />} />
            <Route path="/interview-help-next" element={<InterviewHelpNext />} />
            <Route path="/interview-strengths-weaknesses" element={<StrengthsWeaknesses />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* ✅ 푸터 (하단에 붙도록 설정) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
