import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createCreditCard, createCreditCardLoan } from "../api/client";
import { CreditCard as CardIcon, Plus, AlertCircle, Info, Receipt } from "lucide-react";

export default function CreditCards() {
  const { creditCards, fetchCreditCards, creditCardLoans, fetchCreditCardLoans, loading } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: "",
    limit: 0,
    used_amount: 0,
    available_limit: 0,
    current_month_bill: 0,
    interest_rate: 0,
    minimum_due: 0,
    billing_date: 1,
    due_date: 1
  });

  const [loanFormData, setLoanFormData] = useState({
    card_id: "",
    name: "",
    principal: 0,
    remaining_amount: 0,
    interest_rate: 0,
    interest_type: "yearly",
    emi: 0,
    tenure_months: 12
  });

  useEffect(() => {
    fetchCreditCards();
    fetchCreditCardLoans();
  }, [fetchCreditCards, fetchCreditCardLoans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCreditCard(formData);
      setFormData({ 
        name: "", limit: 0, used_amount: 0, available_limit: 0, 
        current_month_bill: 0, interest_rate: 0, minimum_due: 0, 
        billing_date: 1, due_date: 1 
      });
      fetchCreditCards();
    } catch (error) {
      console.error("Error creating credit card:", error);
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCreditCardLoan({
        ...loanFormData,
        card_id: parseInt(loanFormData.card_id),
        remaining_amount: loanFormData.remaining_amount || loanFormData.principal
      });
      setLoanFormData({ card_id: "", name: "", principal: 0, remaining_amount: 0, interest_rate: 0, interest_type: "yearly", emi: 0, tenure_months: 12 });
      fetchCreditCardLoans();
    } catch (error) {
      console.error("Error creating CC loan:", error);
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <h1>Credit Cards & EMIs</h1>
      </div>

      <div className="grid-2">
        {/* SECTION 1: ADD CARD */}
        <div className="card">
          <h2 className="mb-4">Add Credit Card</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name (e.g. HDFC Millennia)</label>
              <input className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Total Limit</label>
                <input type="number" step="0.01" className="form-control" required value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Used Amount (Total Swipes)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.used_amount} onChange={(e) => setFormData({ ...formData, used_amount: parseFloat(e.target.value) })} />
              </div>
            </div>
            
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Current Month Bill (₹)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.current_month_bill} onChange={(e) => setFormData({ ...formData, current_month_bill: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Available Limit (Per Bank App)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.available_limit} onChange={(e) => setFormData({ ...formData, available_limit: parseFloat(e.target.value) })} />
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

            <button type="submit" className="btn btn-primary w-full">
              <Plus size={18} /> Add Card
            </button>
          </form>
        </div>

        {/* SECTION 2: ADD CC LOAN / EMI */}
        <div className="card">
          <h2 className="mb-4">Convert to EMI / PayLater</h2>
          <form onSubmit={handleLoanSubmit}>
            <div className="form-group">
              <label className="form-label">Select Credit Card</label>
              <select className="form-control" required value={loanFormData.card_id} onChange={(e) => setLoanFormData({ ...loanFormData, card_id: e.target.value })}>
                <option value="">Choose a card...</option>
                {creditCards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Loan Name (e.g. Amazon EMI, iPhone 15)</label>
              <input className="form-control" required value={loanFormData.name} onChange={(e) => setLoanFormData({ ...loanFormData, name: e.target.value })} />
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Principal (Total)</label>
                <input type="number" step="0.01" className="form-control" required value={loanFormData.principal} onChange={(e) => setLoanFormData({ ...loanFormData, principal: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly EMI</label>
                <input type="number" step="0.01" className="form-control" required value={loanFormData.emi} onChange={(e) => setLoanFormData({ ...loanFormData, emi: parseFloat(e.target.value) })} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input type="number" step="0.01" className="form-control" required value={loanFormData.interest_rate} onChange={(e) => setLoanFormData({ ...loanFormData, interest_rate: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tenure (Months)</label>
                <input type="number" className="form-control" required value={loanFormData.tenure_months} onChange={(e) => setLoanFormData({ ...loanFormData, tenure_months: parseInt(e.target.value) })} />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary w-full" disabled={!loanFormData.card_id}>
              <Plus size={18} /> Add EMI Debt
            </button>
          </form>
        </div>
      </div>

      {/* SECTION 3: YOUR CARDS */}
      <div>
        <h2 className="mb-4">Active Credit Cards</h2>
        {creditCards.length === 0 ? (
          <p className="text-secondary">No credit cards found.</p>
        ) : (
          <div className="grid-cards">
            {creditCards.map((card) => {
              const util = ((card.used_amount / card.limit) * 100).toFixed(1);
              return (
                <div key={card.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CardIcon size={20} className="text-primary"/>
                      <h3 style={{marginBottom: 0}}>{card.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-danger font-semibold">₹{card.used_amount.toLocaleString()}</div>
                      <div className="text-xs text-secondary">Total Used</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-secondary mb-1">
                       <span>{util}% Utilization</span>
                       <span className="text-warning">Bill: ₹{card.current_month_bill.toLocaleString()}</span>
                    </div>
                    <div style={{height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{height: '100%', background: util > 30 ? 'var(--accent-warning)' : 'var(--accent-success)', width: `${Math.min(util, 100)}%`}}></div>
                    </div>
                    <div className="flex justify-between text-secondary mt-2" style={{fontSize: '0.8rem'}}>
                      <span>Limit: ₹{card.limit.toLocaleString()}</span>
                      <span>Avail: ₹{card.available_limit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-base p-3 rounded flex-col gap-2" style={{fontSize: '0.875rem'}}>
                    <div className="flex justify-between">
                      <span className="text-secondary">Billing Date</span>
                      <span>Day {card.billing_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Interest Rate</span>
                      <span>{card.interest_rate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 4: ACTIVE EMIS */}
      <div>
        <h2 className="mb-4">Active EMIs & PayLater</h2>
        {creditCardLoans.length === 0 ? (
          <div className="card p-8 text-center text-secondary">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No active credit card EMIs found.</p>
          </div>
        ) : (
          <div className="grid-cards">
            {creditCardLoans.map((loan) => (
              <div key={loan.id} className="card" style={{borderLeft: '4px solid var(--accent-primary)'}}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 style={{marginBottom: 0}}>{loan.name}</h3>
                    <span className="text-xs text-secondary">{creditCards.find(c => c.id === loan.card_id)?.name}</span>
                  </div>
                  <div className="text-warning font-semibold">₹{loan.emi.toLocaleString()}/mo</div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="text-xs text-secondary">
                    Balance: <span className="text-primary">₹{loan.remaining_amount.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-secondary">
                    Rate: {loan.interest_rate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
