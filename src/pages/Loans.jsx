import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createLoan } from "../api/client";
import { Wallet, Plus, Info, CheckCircle } from "lucide-react";

export default function Loans() {
  const { loans, fetchLoans, loading } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: "",
    total_amount: 0,
    remaining_amount: 0,
    interest_rate: 0,
    interest_type: "yearly",
    loan_category: "personal",
    emi: 0,
    extra_payment: 0,
    tenure: 12,
    emis_paid: 0,
    due_date: 1
  });

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLoan({
        ...formData,
        remaining_amount: formData.remaining_amount || formData.total_amount
      });
      setFormData({ 
        name: "", total_amount: 0, remaining_amount: 0, interest_rate: 0, 
        interest_type: "yearly", loan_category: "personal", emi: 0, 
        extra_payment: 0, tenure: 12, emis_paid: 0, due_date: 1 
      });
      fetchLoans();
    } catch (error) {
      console.error("Error creating loan:", error);
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <h1>Loans Management</h1>
      </div>

      <div className="grid-2">
        {/* ADD LOAN FORM */}
        <div className="card">
          <h2 className="mb-4">Add New Loan</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Loan Name</label>
              <input className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Original Principal (Total)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Remaining Principal</label>
                <input type="number" step="0.01" className="form-control" required value={formData.remaining_amount} onChange={(e) => setFormData({ ...formData, remaining_amount: parseFloat(e.target.value) })} />
              </div>
            </div>

            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.interest_rate} onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly EMI (₹)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.emi} onChange={(e) => setFormData({ ...formData, emi: parseFloat(e.target.value) })} />
              </div>
            </div>

            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Total Tenure (Months)</label>
                <input type="number" className="form-control" required value={formData.tenure} onChange={(e) => setFormData({ ...formData, tenure: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">EMIs Already Paid</label>
                <input type="number" className="form-control" required value={formData.emis_paid} onChange={(e) => setFormData({ ...formData, emis_paid: parseInt(e.target.value) })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Plus size={18} /> Add Loan
            </button>
          </form>
        </div>

        {/* ACTIVE LOANS LIST */}
        <div className="flex-col gap-4">
          <h2 className="mb-2">Active Loans</h2>
          {loading ? (
            <p>Loading...</p>
          ) : loans.length === 0 ? (
            <div className="card p-8 text-center text-secondary">
               <Info size={32} className="mx-auto mb-2 opacity-50" />
               <p>No active loans found.</p>
            </div>
          ) : (
            <div className="flex-col gap-4">
              {loans.map((loan) => {
                const paidProgress = loan.total_amount > 0 ? (((loan.total_amount - loan.remaining_amount) / loan.total_amount) * 100).toFixed(1) : 0;
                
                return (
                  <div key={loan.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Wallet size={20} className="text-primary"/>
                        <h3 style={{marginBottom: 0}}>{loan.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-danger font-semibold">₹{loan.remaining_amount.toLocaleString()}</div>
                        <div className="text-xs text-secondary">Remaining</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-secondary mb-1">
                        <span>Progress: {paidProgress}% Paid</span>
                        <span>Original: ₹{loan.total_amount.toLocaleString()}</span>
                      </div>
                      <div style={{height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                        <div style={{height: '100%', background: 'var(--accent-success)', width: `${Math.min(paidProgress, 100)}%`}}></div>
                      </div>
                    </div>

                    <div className="bg-base p-3 rounded grid-2" style={{fontSize: '0.875rem', gap: '1rem'}}>
                      <div className="flex justify-between">
                        <span className="text-secondary">EMI</span>
                        <span>₹{loan.emi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Interest</span>
                        <span>{loan.interest_rate}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
