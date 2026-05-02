import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createCreditCard, createCreditCardLoan, updateCreditCard, deleteCreditCard, updateCreditCardLoan, deleteCreditCardLoan } from "../api/client";
import { CreditCard as CardIcon, Plus, AlertCircle, Info, Receipt, TrendingDown, Calculator, Percent, Edit2, Trash2, X } from "lucide-react";

export default function CreditCards() {
  const { creditCards, fetchCreditCards, creditCardLoans, fetchCreditCardLoans, loading } = useFinanceStore();
  
  const [isEditingCard, setIsEditingCard] = useState(null);
  const [isEditingLoan, setIsEditingLoan] = useState(null);

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
    tenure_months: 12,
    emis_paid: 0
  });

  useEffect(() => {
    fetchCreditCards();
    fetchCreditCardLoans();
  }, [fetchCreditCards, fetchCreditCardLoans]);

  const handleLoanFieldChange = (field, value) => {
    setLoanFormData(prev => {
      const next = { ...prev, [field]: value };
      
      // Force recalculation for any relevant field change
      const principal = field === 'principal' ? value : next.principal;
      const emisPaid = field === 'emis_paid' ? value : next.emis_paid;
      const emi = field === 'emi' ? value : next.emi;
      const tenure = field === 'tenure_months' ? value : next.tenure_months;
      
      if (principal > 0 && emi > 0) {
        if (tenure > 0 && emisPaid >= tenure) {
          next.remaining_amount = 0;
        } else {
          // Calculation: Principal - (Paid EMIs * EMI)
          const balance = principal - (emisPaid * emi);
          next.remaining_amount = parseFloat(Math.max(0, balance).toFixed(2));
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingCard) {
        await updateCreditCard(isEditingCard, formData);
      } else {
        await createCreditCard(formData);
      }
      resetCardForm();
      fetchCreditCards();
    } catch (error) {
      console.error("Error saving credit card:", error);
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    let finalInterestRate = loanFormData.interest_rate;
    if (finalInterestRate === 0 && loanFormData.emi > 0 && loanFormData.tenure_months > 0 && loanFormData.principal > 0) {
      const totalInterest = (loanFormData.emi * loanFormData.tenure_months) - loanFormData.principal;
      if (totalInterest > 0) {
        finalInterestRate = parseFloat(((totalInterest / loanFormData.principal) / (loanFormData.tenure_months / 12) * 100).toFixed(2));
      }
    }

    try {
      // Ensure we use the latest auto-calculated remaining_amount
      const data = { 
        ...loanFormData, 
        card_id: parseInt(loanFormData.card_id), 
        interest_rate: Math.max(0, finalInterestRate || 0) 
      };
      if (isEditingLoan) {
        await updateCreditCardLoan(isEditingLoan, data);
      } else {
        await createCreditCardLoan(data);
      }
      resetLoanForm();
      fetchCreditCardLoans();
    } catch (error) {
      console.error("Error saving CC loan:", error);
    }
  };

  const resetCardForm = () => {
    setFormData({ name: "", limit: 0, used_amount: 0, available_limit: 0, current_month_bill: 0, interest_rate: 0, minimum_due: 0, billing_date: 1, due_date: 1 });
    setIsEditingCard(null);
  };

  const resetLoanForm = () => {
    setLoanFormData({ card_id: "", name: "", principal: 0, remaining_amount: 0, interest_rate: 0, interest_type: "yearly", emi: 0, tenure_months: 12, emis_paid: 0 });
    setIsEditingLoan(null);
  };

  const handleEditCard = (card) => {
    setFormData(card);
    setIsEditingCard(card.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditLoan = (loan) => {
    // When editing, we populate the form. 
    setLoanFormData({ ...loan, card_id: loan.card_id.toString() });
    setIsEditingLoan(loan.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm("Delete this card? All linked EMIs will be affected.")) {
      await deleteCreditCard(id);
      fetchCreditCards();
    }
  };

  const handleDeleteLoan = async (id) => {
    if (window.confirm("Delete this EMI debt?")) {
      await deleteCreditCardLoan(id);
      fetchCreditCardLoans();
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <h1>Credit Cards & EMIs</h1>
      </div>

      <div className="grid-2">
        {/* ADD/EDIT CARD */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="mb-0">{isEditingCard ? "Edit Credit Card" : "Add Credit Card"}</h2>
            {isEditingCard && <button onClick={resetCardForm} className="btn-icon p-1"><X size={20}/></button>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Card Name</label>
              <input className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Total Limit</label>
                <input type="number" step="0.01" className="form-control" required value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">Used (Swipes)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.used_amount} onChange={(e) => setFormData({ ...formData, used_amount: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Bill Amt</label>
                <input type="number" step="0.01" className="form-control" required value={formData.current_month_bill} onChange={(e) => setFormData({ ...formData, current_month_bill: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">Avail. Limit</label>
                <input type="number" step="0.01" className="form-control" required value={formData.available_limit} onChange={(e) => setFormData({ ...formData, available_limit: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-2">
              {isEditingCard ? "Update Card" : "Add Card"}
            </button>
          </form>
        </div>

        {/* ADD/EDIT EMI */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="mb-0">{isEditingLoan ? "Edit EMI" : "Add EMI Debt"}</h2>
            {isEditingLoan && <button onClick={resetLoanForm} className="btn-icon p-1"><X size={20}/></button>}
          </div>
          <form onSubmit={handleLoanSubmit}>
            <div className="form-group">
              <label className="form-label">Select Card</label>
              <select className="form-control" required value={loanFormData.card_id} onChange={(e) => setLoanFormData({ ...loanFormData, card_id: e.target.value })}>
                <option value="">Choose card...</option>
                {creditCards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">EMI Name</label>
              <input className="form-control" required value={loanFormData.name} onChange={(e) => setLoanFormData({ ...loanFormData, name: e.target.value })} />
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Original Principal</label>
                <input type="number" step="0.01" className="form-control" required value={loanFormData.principal} onChange={(e) => handleLoanFieldChange('principal', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">EMIs Paid Already</label>
                <input type="number" className="form-control" required value={loanFormData.emis_paid} onChange={(e) => handleLoanFieldChange('emis_paid', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Monthly EMI</label>
                <input type="number" step="0.01" className="form-control" required value={loanFormData.emi} onChange={(e) => handleLoanFieldChange('emi', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Remaining Balance (Manual/Auto)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  value={loanFormData.remaining_amount} 
                  onChange={(e) => setLoanFormData({ ...loanFormData, remaining_amount: parseFloat(e.target.value) || 0 })}
                  placeholder="Will auto-calculate..."
                />
              </div>
            </div>
            <div className="grid-2" style={{gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Tenure (Months)</label>
                <input type="number" className="form-control" required value={loanFormData.tenure_months} onChange={(e) => handleLoanFieldChange('tenure_months', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Rate (0=Auto)</label>
                <input type="number" step="0.01" className="form-control" required value={loanFormData.interest_rate} onChange={(e) => setLoanFormData({ ...loanFormData, interest_rate: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary w-full mt-2" disabled={!loanFormData.card_id}>
              {isEditingLoan ? "Update EMI" : "Add EMI"}
            </button>
          </form>
        </div>
      </div>

      {/* CARDS LIST */}
      <div>
        <h2 className="mb-4">Active Credit Cards</h2>
        <div className="grid-cards">
          {creditCards.map(card => {
            const cardLoans = creditCardLoans.filter(l => l.card_id === card.id && l.status === 'active');
            const emiBal = cardLoans.reduce((sum, l) => sum + l.remaining_amount, 0);
            const totalUsed = card.used_amount + emiBal;
            const util = card.limit > 0 ? ((totalUsed / card.limit) * 100).toFixed(1) : 0;
            
            return (
              <div key={card.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CardIcon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-0">{card.name}</h3>
                      <span className="text-xs text-secondary">Limit: ₹{card.limit.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 hover-actions">
                    <button onClick={() => handleEditCard(card)} className="btn-icon p-1 rounded-full"><Edit2 size={16} className="text-secondary" /></button>
                    <button onClick={() => handleDeleteCard(card.id)} className="btn-icon p-1 rounded-full"><Trash2 size={16} className="text-danger" /></button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-secondary mb-2">
                     <span>Utilization: {util}%</span>
                     <span className="text-warning font-semibold">Bill: ₹{card.current_month_bill.toLocaleString()}</span>
                  </div>
                  <div style={{height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{height: '100%', background: util > 30 ? 'var(--accent-warning)' : 'var(--accent-success)', width: `${Math.min(util, 100)}%`}}></div>
                  </div>
                </div>

                <div className="flex-col gap-2 p-3 bg-base/50 rounded-lg text-sm">
                   <div className="flex justify-between">
                     <span className="text-secondary">Standard Swipes</span>
                     <span>₹{card.used_amount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-secondary">EMI Loan Debt</span>
                     <span className="text-warning">₹{emiBal.toLocaleString()}</span>
                   </div>
                   <div className="pt-2 border-t border-white/5 flex justify-between font-semibold">
                     <span className="text-secondary">Total Blocked</span>
                     <span className="text-danger">₹{totalUsed.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EMIS LIST */}
      <div>
        <h2 className="mb-4">Active EMIs & PayLater</h2>
        <div className="grid-cards">
          {creditCardLoans.map(loan => {
            const card = creditCards.find(c => c.id === loan.card_id);
            let rate = loan.interest_rate || 0;
            if (rate === 0 && loan.emi > 0 && loan.tenure_months > 0 && loan.principal > 0) {
              const totalInt = (loan.emi * loan.tenure_months) - loan.principal;
              if (totalInt > 0) rate = parseFloat(((totalInt / loan.principal) / (loan.tenure_months / 12) * 100).toFixed(2));
            }
            const displayRate = rate > 0 ? rate : (card?.interest_rate || 0);
            
            // Clean zero formatting for interest to avoid -0
            const rawMonthlyInt = (Math.max(0, loan.remaining_amount) * (displayRate / 100)) / 12;
            const interestMonth = Math.abs(rawMonthlyInt);
            
            const progress = loan.tenure_months > 0 ? ((loan.emis_paid / loan.tenure_months) * 100).toFixed(1) : 0;
            const safeRemaining = Math.max(0, loan.remaining_amount);

            return (
              <div key={loan.id} className="card" style={{borderLeft: '4px solid var(--accent-primary)'}}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="mb-0">{loan.name}</h3>
                    <span className="text-xs text-secondary">{card?.name || "No Linked Card"}</span>
                  </div>
                  <div className="flex gap-1 hover-actions">
                    <button onClick={() => handleEditLoan(loan)} className="btn-icon p-1 rounded-full"><Edit2 size={16} className="text-secondary" /></button>
                    <button onClick={() => handleDeleteLoan(loan.id)} className="btn-icon p-1 rounded-full"><Trash2 size={16} className="text-danger" /></button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-secondary mb-2">
                    <span>Progress: {progress}% Paid</span>
                    <span>{loan.emis_paid}/{loan.tenure_months} mo</span>
                  </div>
                  <div style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                    <div style={{height: '100%', background: 'var(--accent-success)', width: `${Math.min(progress, 100)}%`}}></div>
                  </div>
                </div>

                <div className="flex-col gap-2 p-3 bg-base/50 rounded-lg text-sm">
                   <div className="flex justify-between">
                     <span className="text-secondary">Original Principal</span>
                     <span className="font-semibold">₹{loan.principal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-secondary">Monthly EMI</span>
                     <span className="text-warning font-semibold">₹{loan.emi.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-secondary">Interest Cost</span>
                     <span className="text-danger">₹{interestMonth.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</span>
                   </div>
                   <div className="pt-2 border-t border-white/5 flex justify-between font-semibold">
                     <span className="text-secondary">Remaining Balance</span>
                     <span className="text-primary font-bold">₹{safeRemaining.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
