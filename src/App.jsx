import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ThermalBill from "./sections/ThermalBill";
import SFDyesExpenseForm from "./components/Hotels/SFDyesExpenseForm";
import FoodBill from "./components/Foods/FoodBill";

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
        <Route element={<Layout />}>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/expense" element={<SFDyesExpenseForm />} />
          <Route path="/foodbill" element={<FoodBill />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
