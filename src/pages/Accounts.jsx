import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/financeStore";
import { createAccount } from "../api/client";
import { Landmark, Plus } from "lucide-react";

export default function Accounts() {
  const { accounts, fetchAccounts, loading } = useFinanceStore();
  const [formData, setFormData] = useState({ name: "", type: "bank", balance: 0 });

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccount(formData);
      setFormData({ name: "", type: "bank", balance: 0 });
      fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Accounts</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="mb-4">Add Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="bank">Bank</option>
                <option value="wallet">Wallet</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Balance</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                required
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Add Account
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4">Your Accounts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : accounts.length === 0 ? (
            <p className="text-secondary">No accounts found.</p>
          ) : (
            <div className="flex-col gap-4">
              {accounts.map((acc) => (
                <div key={acc.id} className="card flex items-center justify-between" style={{padding: '1rem'}}>
                  <div className="flex items-center gap-4">
                    <div className="bg-surface p-2 rounded"><Landmark size={24} className="text-primary"/></div>
                    <div>
                      <h3 style={{marginBottom: 0}}>{acc.name}</h3>
                      <span className="text-secondary" style={{fontSize: '0.875rem', textTransform: 'capitalize'}}>{acc.type}</span>
                    </div>
                  </div>
                  <h2>₹{acc.balance.toLocaleString()}</h2>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
