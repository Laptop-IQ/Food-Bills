import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ThermalBill from "./sections/ThermalBill";
import SFDyesExpenseForm from "./components/Hotels/SFDyesExpenseForm";
import FoodBill from "./components/Foods/FoodBill";
import TaxInvoice from "./components/TaxInvoice";
import HotelsInvoice from "./components/Hotels";

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
           <Route path="/tax-invoice" element={<TaxInvoice />} />
          <Route path="/hotels-invoice" element={<HotelsInvoice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
