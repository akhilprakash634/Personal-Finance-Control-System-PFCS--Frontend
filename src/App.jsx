import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Loans from "./pages/Loans";
import CreditCards from "./pages/CreditCards";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="loans" element={<Loans />} />
          <Route path="credit-cards" element={<CreditCards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
