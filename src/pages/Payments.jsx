import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createPayment } from "../api/client";
import { Receipt, Plus, History, TrendingDown, Clock } from "lucide-react";

export default function Payments() {
  const { 
    loans, fetchLoans, 
    creditCards, fetchCreditCards, 
    creditCardLoans, fetchCreditCardLoans,
    payments, fetchPayments, 
    loading 
  } = useFinanceStore();

  const [formData, setFormData] = useState({
    debt_type: "loan",
    debt_id: "",
    amount: 0,
    payment_type: "emi"
  });

  useEffect(() => {
    fetchLoans();
    fetchCreditCards();
    fetchCreditCardLoans();
    fetchPayments();
  }, [fetchLoans, fetchCreditCards, fetchCreditCardLoans, fetchPayments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.debt_id) return;
    
    try {
      await createPayment({
        ...formData,
        debt_id: parseInt(formData.debt_id)
      });
      setFormData({ debt_type: "loan", debt_id: "", amount: 0, payment_type: "emi" });
      fetchPayments();
      // Refresh balances
      fetchLoans();
      fetchCreditCards();
      fetchCreditCardLoans();
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const getDebtList = () => {
    if (formData.debt_type === "loan") return loans;
    if (formData.debt_type === "credit_card") return creditCards;
    if (formData.debt_type === "credit_card_loan") return creditCardLoans;
    return [];
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <h1>Payment Tracking</h1>
      </div>

      <div className="grid-2">
        {/* ADD PAYMENT FORM */}
        <div className="card">
          <h2 className="mb-4 flex items-center gap-2">
            <Plus size={20} className="text-primary" /> Record Payment
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Debt Category</label>
              <select 
                className="form-control" 
                value={formData.debt_type} 
                onChange={(e) => setFormData({ ...formData, debt_type: e.target.value, debt_id: "" })}
              >
                <option value="loan">Personal Loans</option>
                <option value="credit_card">Credit Card Swipes</option>
                <option value="credit_card_loan">Credit Card EMIs / PayLater</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Specific Debt</label>
              <select 
                className="form-control" 
                required 
                value={formData.debt_id} 
                onChange={(e) => setFormData({ ...formData, debt_id: e.target.value })}
              >
                <option value="">Choose debt...</option>
                {getDebtList().map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} (Bal: ₹{(d.remaining_amount || d.used_amount || 0).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  required 
                  value={formData.amount} 
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Type</label>
                <select 
                  className="form-control" 
                  value={formData.payment_type} 
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                >
                  <option value="emi">Regular EMI</option>
                  <option value="minimum">Minimum Due (Card)</option>
                  <option value="extra">Extra Payment</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={!formData.debt_id}>
              <Receipt size={18} /> Record Payment
            </button>
          </form>
        </div>

        {/* RECENT PAYMENTS LIST */}
        <div className="card">
          <h2 className="mb-4 flex items-center gap-2">
            <History size={20} className="text-primary" /> Recent History
          </h2>
          {payments.length === 0 ? (
            <p className="text-secondary text-center py-8">No payments recorded yet.</p>
          ) : (
            <div className="flex-col gap-3">
              {[...payments].reverse().slice(0, 10).map((p) => (
                <div key={p.id} className="bg-base p-3 rounded flex-col gap-1 border-l-2 border-primary">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{p.debt_type.replace('_', ' ').toUpperCase()} Payment</span>
                    <span className="text-success font-bold">₹{p.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <div className="flex items-center gap-1">
                      <TrendingDown size={12} className="text-success" />
                      Prin: ₹{p.principal_component.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(p.date).toLocaleDateString()}
                    </div>
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
