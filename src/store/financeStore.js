import { create } from "zustand";
import { getDashboard, getAccounts, getLoans, getCreditCards, loginGoogle } from "../api/client";

export const useFinanceStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  dashboard: null,
  accounts: [],
  loans: [],
  creditCards: [],
  loading: false,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  login: async (googleToken) => {
    set({ loading: true });
    try {
      const data = await loginGoogle(googleToken);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, loading: false });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, dashboard: null, accounts: [], loans: [], creditCards: [] });
  },

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const data = await getDashboard();
      set({ dashboard: data, loading: false });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      if (error.response?.status === 401) get().logout();
      set({ loading: false });
    }
  },

  fetchAccounts: async () => {
    set({ loading: true });
    try {
      const data = await getAccounts();
      set({ accounts: data, loading: false });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      if (error.response?.status === 401) get().logout();
      set({ loading: false });
    }
  },

  fetchLoans: async () => {
    set({ loading: true });
    try {
      const data = await getLoans();
      set({ loans: data, loading: false });
    } catch (error) {
      console.error("Error fetching loans:", error);
      if (error.response?.status === 401) get().logout();
      set({ loading: false });
    }
  },

  fetchCreditCards: async () => {
    set({ loading: true });
    try {
      const data = await getCreditCards();
      set({ creditCards: data, loading: false });
    } catch (error) {
      console.error("Error fetching credit cards:", error);
      if (error.response?.status === 401) get().logout();
      set({ loading: false });
    }
  }
}));
