import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThermalBill from "./sections/ThermalBill"

function PortfolioPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
    <ThermalBill />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
