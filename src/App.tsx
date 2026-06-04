import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Reports } from "./pages/Reports";
import { Sow } from "./pages/Sow";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sow" element={<Sow />} />
        </Routes>
      </div>
    </Router>
  );
}
