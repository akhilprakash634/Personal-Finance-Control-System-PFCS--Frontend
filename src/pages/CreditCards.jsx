import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createCreditCard } from "../api/client";
import { CreditCard as CardIcon, Plus } from "lucide-react";

export default function CreditCards() {
  const { creditCards, fetchCreditCards, loading } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: "",
    limit: 0,
    used_amount: 0,
    interest_rate: 0,
    minimum_due: 0,
    billing_date: 1,
    due_date: 1
  });

  useEffect(() => {
    fetchCreditCards();
  }, [fetchCreditCards]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCreditCard(formData);
      setFormData({ name: "", limit: 0, used_amount: 0, interest_rate: 0, minimum_due: 0, billing_date: 1, due_date: 1 });
      fetchCreditCards();
    } catch (error) {
      console.error("Error creating credit card:", error);
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Credit Cards</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="mb-4">Add Credit Card</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name (e.g. HDFC Millennia)</label>
              <input className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Card Limit</label>
                <input type="number" step="0.01" className="form-control" required value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Used Amount</label>
                <input type="number" step="0.01" className="form-control" required value={formData.used_amount} onChange={(e) => setFormData({ ...formData, used_amount: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.interest_rate} onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Due</label>
                <input type="number" step="0.01" className="form-control" required value={formData.minimum_due} onChange={(e) => setFormData({ ...formData, minimum_due: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Billing Date</label>
                <input type="number" min="1" max="31" className="form-control" required value={formData.billing_date} onChange={(e) => setFormData({ ...formData, billing_date: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="number" min="1" max="31" className="form-control" required value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: parseInt(e.target.value) })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Add Card
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4">Your Cards</h2>
          {loading ? (
            <p>Loading...</p>
          ) : creditCards.length === 0 ? (
            <p className="text-secondary">No credit cards found.</p>
          ) : (
            <div className="flex-col gap-4">
              {creditCards.map((card) => {
                const util = ((card.used_amount / card.limit) * 100).toFixed(1);
                return (
                  <div key={card.id} className="card" style={{padding: '1rem'}}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CardIcon size={18} className="text-primary"/>
                        <h3 style={{marginBottom: 0}}>{card.name}</h3>
                      </div>
                      <span className="text-danger font-semibold">₹{card.used_amount.toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <div style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{height: '100%', background: util > 40 ? 'var(--accent-warning)' : 'var(--accent-primary)', width: `${Math.min(util, 100)}%`}}></div>
                      </div>
                      <div className="flex justify-between text-secondary mt-1" style={{fontSize: '0.75rem'}}>
                        <span>{util}% Used</span>
                        <span>Limit: ₹{card.limit.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-secondary flex justify-between" style={{fontSize: '0.875rem'}}>
                      <span>Min Due: ₹{card.minimum_due.toLocaleString()}</span>
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
