import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, CreditCard, Landmark, LogOut, User, Menu, X, Receipt } from "lucide-react";
import { useFinanceStore } from "../store/financeStore";

export default function Layout() {
  const { user, logout } = useFinanceStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="logo" style={{ marginBottom: 0 }}>
          <Wallet size={24} className="text-primary" />
          PFCS
        </div>
        <button className="btn-secondary p-2" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop Overlay */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? "visible" : ""}`} 
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-section">
          <div className="logo">
            <Wallet size={28} className="text-primary" />
            PFCS
          </div>
        </div>
        
        <nav className="nav-menu">
          <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/accounts" onClick={closeSidebar} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Landmark size={20} />
            Accounts
          </NavLink>
          <NavLink to="/loans" onClick={closeSidebar} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Wallet size={20} />
            Loans
          </NavLink>
          <NavLink to="/credit-cards" onClick={closeSidebar} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <CreditCard size={20} />
            Credit Cards
          </NavLink>
          <NavLink to="/payments" onClick={closeSidebar} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Receipt size={20} />
            Payments
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
                <span className="user-email text-xs">{user.email}</span>
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
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
