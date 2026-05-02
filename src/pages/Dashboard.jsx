import { useState, useEffect } from "react";
import { getDashboard } from "../api/client";
import { AlertTriangle, TrendingUp, Target, Activity } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!data) return <div className="p-6">Error loading data.</div>;

  const { summary, monthly_requirement, strategy, alerts } = data;

  return (
    <div className="flex-col gap-6">
      <h1 className="mb-4">Financial Dashboard</h1>

      {/* Top: Summary */}
      <div className="grid-cards mb-6">
        <div className="card">
          <div className="text-secondary flex items-center gap-2 mb-2"><Activity size={18} /> Total Balance</div>
          <h2>₹{summary.total_balance.toLocaleString()}</h2>
        </div>
        <div className="card">
          <div className="text-secondary flex items-center gap-2 mb-2"><AlertTriangle size={18} /> Total Debt</div>
          <h2 className="text-danger">₹{summary.total_debt.toLocaleString()}</h2>
        </div>
        <div className="card card-gradient">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={18} /> Net Worth</div>
          <h2>₹{summary.net_worth.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid-2 mb-6">
        {/* Middle: Monthly Requirements */}
        <div className="card">
          <h3 className="mb-4">This Month's Requirement</h3>
          <h2 className="text-warning mb-2">₹{monthly_requirement.total_required.toLocaleString()}</h2>
          <div className="text-secondary">
            <p>Loans EMI: ₹{monthly_requirement.loan_emi_total.toLocaleString()}</p>
            <p>Credit Cards Min Due: ₹{monthly_requirement.credit_min_due_total.toLocaleString()}</p>
          </div>
        </div>

        {/* Bottom: Strategy Focus */}
        <div className="card">
          <h3 className="flex items-center gap-2 mb-4"><Target size={20} className="text-primary"/> Strategy Focus</h3>
          {strategy.focus ? (
            <>
              <h2 className="text-primary mb-2">{strategy.focus}</h2>
              <p className="text-secondary mb-4">{strategy.reason}</p>
              <div className="bg-base p-4 rounded" style={{borderRadius: '8px'}}>
                <h4 className="mb-2">Action Plan:</h4>
                <ul style={{paddingLeft: '1.2rem', color: 'var(--text-secondary)'}}>
                  {strategy.steps.map((step, idx) => (
                    <li key={idx} className="mb-1">{step}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-success">You are debt-free or have no active debts recorded. Enjoy your debt-free life!</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div>
          <h3 className="mb-4">Alerts</h3>
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert alert-warning">
              <AlertTriangle size={20} />
              {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
