import { useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import SummaryCard from "../components/SummaryCard";
import AlertBox from "../components/AlertBox";
import { AlertTriangle, TrendingUp, Target, Activity, PieChart, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { dashboard, fetchDashboard, loading } = useFinanceStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!dashboard) return <div className="p-6">Error loading data. Check if you are logged in.</div>;

  const { summary, monthly_requirement, strategy, alerts, this_month } = dashboard;

  return (
    <div className="flex-col gap-6">
      <h1 className="mb-4">Financial Dashboard</h1>

      {/* Top: Summary */}
      <div className="grid-cards mb-6">
        <SummaryCard 
          title="Total Balance" 
          amount={summary.total_balance} 
          icon={<Activity size={18} />} 
        />
        <SummaryCard 
          title="Total Debt" 
          amount={summary.total_debt} 
          icon={<AlertTriangle size={18} />} 
          isDanger={true}
        />
        <SummaryCard 
          title="Net Worth" 
          amount={summary.net_worth} 
          icon={<TrendingUp size={18} />} 
          isGradient={true}
        />
      </div>

      {/* This Month Payments & Insights */}
      <div className="grid-2 mb-6">
        <div className="card">
          <h3 className="flex items-center gap-2 mb-4">
            <PieChart size={20} className="text-primary"/> This Month's Payments
          </h3>
          <div className="flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Total Paid</span>
              <span className="font-semibold">₹{this_month.total_paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Interest Paid</span>
              <span className="text-danger">₹{this_month.interest_paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">Principal Reduced</span>
              <span className="text-success">₹{this_month.principal_reduced.toLocaleString()}</span>
            </div>
            {this_month.insights.length > 0 && (
              <div className="mt-2 p-3 rounded bg-base" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                {this_month.insights.map((insight, idx) => (
                  <p key={idx} className="text-sm italic">{insight}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Monthly Requirements</h3>
          <h2 className="text-warning mb-2">₹{monthly_requirement.total_required.toLocaleString()}</h2>
          <div className="text-secondary flex-col gap-1">
            <div className="flex justify-between">
              <span>Loans EMI</span>
              <span>₹{monthly_requirement.loan_emi_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Credit Cards Min Due</span>
              <span>₹{monthly_requirement.credit_min_due_total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-6">
        {/* Strategy Focus */}
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
            <div className="flex-col items-center justify-center p-6 text-center">
               <CheckCircle size={48} className="text-success mb-4" />
               <p className="text-success font-semibold text-lg">You are debt-free!</p>
               <p className="text-secondary">All active debts have been cleared.</p>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div>
          <h3 className="mb-4">System Alerts</h3>
          {alerts && alerts.length > 0 ? (
            <div className="flex-col gap-2">
              {alerts.map((alert, idx) => (
                <AlertBox key={idx} message={alert} />
              ))}
            </div>
          ) : (
            <div className="card flex items-center justify-center p-8 text-secondary">
              No critical alerts. Everything looks good!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
