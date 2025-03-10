import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Motivation from "./pages/Motivation"; 
import ResumeProcessing from "./pages/ResumeProcessing"; // 페이지 2

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 p-6 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Motivation />} />
          <Route path="/resume-processing" element={<ResumeProcessing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
