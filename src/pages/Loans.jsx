import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createLoan } from "../api/client";
import { Wallet, Plus } from "lucide-react";

export default function Loans() {
  const { loans, fetchLoans, loading } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: "",
    remaining_amount: 0,
    interest_rate: 0,
    emi: 0,
    extra_payment: 0,
    tenure: 0,
    emis_paid: 0,
    due_date: 1
  });

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLoan(formData);
      setFormData({ name: "", remaining_amount: 0, interest_rate: 0, emi: 0, extra_payment: 0, tenure: 0, emis_paid: 0, due_date: 1 });
      fetchLoans();
    } catch (error) {
      console.error("Error creating loan:", error);
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Loans</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="mb-4">Add Loan</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Remaining Amount</label>
                <input type="number" step="0.01" className="form-control" required value={formData.remaining_amount} onChange={(e) => setFormData({ ...formData, remaining_amount: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.interest_rate} onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Monthly EMI</label>
                <input type="number" step="0.01" className="form-control" required value={formData.emi} onChange={(e) => setFormData({ ...formData, emi: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Extra Payment</label>
                <input type="number" step="0.01" className="form-control" required value={formData.extra_payment} onChange={(e) => setFormData({ ...formData, extra_payment: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Tenure (Months)</label>
                <input type="number" className="form-control" required value={formData.tenure} onChange={(e) => setFormData({ ...formData, tenure: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">EMIs Paid</label>
                <input type="number" className="form-control" required value={formData.emis_paid} onChange={(e) => setFormData({ ...formData, emis_paid: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date (Day of month)</label>
              <input type="number" min="1" max="31" className="form-control" required value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: parseInt(e.target.value) })} />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Add Loan
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4">Active Loans</h2>
          {loading ? (
            <p>Loading...</p>
          ) : loans.length === 0 ? (
            <p className="text-secondary">No loans found.</p>
          ) : (
            <div className="flex-col gap-4">
              {loans.map((loan) => (
                <div key={loan.id} className="card" style={{padding: '1rem'}}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-primary"/>
                      <h3 style={{marginBottom: 0}}>{loan.name}</h3>
                    </div>
                    <span className="text-danger font-semibold">₹{loan.remaining_amount.toLocaleString()}</span>
                  </div>
                  <div className="text-secondary flex justify-between" style={{fontSize: '0.875rem'}}>
                    <span>EMI: ₹{loan.emi.toLocaleString()}</span>
                    <span>Interest: {loan.interest_rate}%</span>
                    <span>Paid: {loan.emis_paid}/{loan.tenure} months</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
