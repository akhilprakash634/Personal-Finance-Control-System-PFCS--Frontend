import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, CreditCard, Landmark, LogOut, User } from "lucide-react";
import { useFinanceStore } from "../store/financeStore";

export default function Layout() {
  const { user, logout } = useFinanceStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo">
            <Wallet size={28} className="text-primary" />
            PFCS
          </div>
        </div>
        
        <nav className="nav-menu">
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

        <div className="sidebar-footer">
          {user && (
            <div className="user-profile">
              <div className="avatar">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
