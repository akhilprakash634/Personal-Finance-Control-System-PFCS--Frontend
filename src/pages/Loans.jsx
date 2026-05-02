import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createLoan, updateLoan, deleteLoan } from "../api/client";
import { Wallet, Plus, Info, CheckCircle, Edit2, Trash2, X, Calculator, TrendingDown, Clock } from "lucide-react";

export default function Loans() {
  const { loans, fetchLoans, loading } = useFinanceStore();
  const [isEditing, setIsEditing] = useState(null);

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

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'total_amount' || field === 'emi' || field === 'emis_paid') {
        const total = field === 'total_amount' ? value : next.total_amount;
        const emi = field === 'emi' ? value : next.emi;
        const paid = field === 'emis_paid' ? value : next.emis_paid;
        
        if (total > 0 && emi > 0) {
          const balance = total - (paid * emi);
          next.remaining_amount = parseFloat(Math.max(0, balance).toFixed(2));
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateLoan(isEditing, formData);
      } else {
        await createLoan({
          ...formData,
          remaining_amount: formData.remaining_amount || formData.total_amount
        });
      }
      resetForm();
      fetchLoans();
    } catch (error) {
      console.error("Error saving loan:", error);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", total_amount: 0, remaining_amount: 0, interest_rate: 0, 
      interest_type: "yearly", loan_category: "personal", emi: 0, 
      extra_payment: 0, tenure: 12, emis_paid: 0, due_date: 1 
    });
    setIsEditing(null);
  };

  const handleEdit = (loan) => {
    setFormData(loan);
    setIsEditing(loan.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      await deleteLoan(id);
      fetchLoans();
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <h1>Loans Management</h1>
      </div>

      {/* FORM SECTION - STICKY TOP OR FULL WIDTH */}
      <div className="card" style={{maxWidth: '800px'}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-0">{isEditing ? "Edit Loan" : "Add New Loan"}</h2>
          {isEditing && <button onClick={resetForm} className="btn-icon p-1"><X size={20}/></button>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Loan Name</label>
            <input className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          
          <div className="grid-2" style={{gap: '1rem'}}>
            <div className="form-group">
              <label className="form-label">Original Principal</label>
              <input type="number" step="0.01" className="form-control" required value={formData.total_amount} onChange={(e) => handleFieldChange('total_amount', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">EMIs Paid Already</label>
              <input type="number" className="form-control" required value={formData.emis_paid} onChange={(e) => handleFieldChange('emis_paid', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="grid-2" style={{gap: '1rem'}}>
            <div className="form-group">
              <label className="form-label">Monthly EMI (₹)</label>
              <input type="number" step="0.01" className="form-control" required value={formData.emi} onChange={(e) => handleFieldChange('emi', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Balance (Manual/Auto)</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                value={formData.remaining_amount} 
                onChange={(e) => setFormData({ ...formData, remaining_amount: parseFloat(e.target.value) || 0 })} 
              />
            </div>
          </div>

          <div className="grid-2" style={{gap: '1rem'}}>
            <div className="form-group">
              <label className="form-label">Interest Rate (%)</label>
              <input type="number" step="0.01" className="form-control" required value={formData.interest_rate} onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tenure (Months)</label>
              <input type="number" className="form-control" required value={formData.tenure} onChange={(e) => setFormData({ ...formData, tenure: parseInt(e.target.value) || 0 })} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            <Plus size={18} /> {isEditing ? "Update Loan Details" : "Add Personal Loan"}
          </button>
        </form>
      </div>

      {/* LOANS GRID SECTION */}
      <div>
        <h2 className="mb-6">Your Active Loans</h2>
        {loading ? (
          <p>Loading your debts...</p>
        ) : (
          <div className="grid-cards">
            {loans.length === 0 ? (
              <div className="card p-8 text-center text-secondary col-span-full">
                 <Info size={32} className="mx-auto mb-2 opacity-50" />
                 <p>No active loans found.</p>
              </div>
            ) : (
              loans.map((loan) => {
                const paidProgress = loan.total_amount > 0 ? (((loan.total_amount - loan.remaining_amount) / loan.total_amount) * 100).toFixed(1) : 0;
                
                return (
                  <div key={loan.id} className="card" style={{borderLeft: '4px solid var(--accent-success)'}}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                          <Wallet size={20} className="text-success"/>
                        </div>
                        <div>
                          <h3 className="mb-0">{loan.name}</h3>
                          <span className="text-xs text-secondary">Due: Day {loan.due_date || 1}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 hover-actions">
                        <button onClick={() => handleEdit(loan)} className="btn-icon p-1 rounded-full"><Edit2 size={16} className="text-secondary" /></button>
                        <button onClick={() => handleDelete(loan.id)} className="btn-icon p-1 rounded-full"><Trash2 size={16} className="text-danger" /></button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-secondary mb-2">
                        <span>Progress: {paidProgress}% Paid</span>
                        <span>{loan.emis_paid}/{loan.tenure} mo</span>
                      </div>
                      <div style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{height: '100%', background: 'var(--accent-success)', width: `${Math.min(paidProgress, 100)}%`}}></div>
                      </div>
                    </div>

                    <div className="flex-col gap-2 p-3 bg-base/50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary">Original Principal</span>
                        <span className="font-semibold">₹{loan.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Monthly EMI</span>
                        <span className="text-warning font-semibold">₹{loan.emi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-white/5">
                        <span className="text-secondary">Interest Rate</span>
                        <span>{loan.interest_rate}%</span>
                      </div>
                      <div className="flex justify-between pt-1 font-bold">
                        <span className="text-secondary">Remaining</span>
                        <span className="text-primary">₹{loan.remaining_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
