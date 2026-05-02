import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, CreditCard, Landmark } from "lucide-react";

export default function Layout() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <Wallet size={28} className="text-primary" />
          PFCS
        </div>
        
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Landmark size={20} />
            Accounts
          </NavLink>
          <NavLink to="/loans" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Wallet size={20} />
            Loans
          </NavLink>
          <NavLink to="/credit-cards" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <CreditCard size={20} />
            Credit Cards
          </NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
