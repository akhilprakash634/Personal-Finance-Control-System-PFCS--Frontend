import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const loginGoogle = async (token) => {
  const response = await apiClient.post("/auth/google", { token });
  return response.data;
};

// Dashboard API
export const getDashboard = async () => {
  const response = await apiClient.get("/dashboard/");
  return response.data;
};

// Accounts API
export const getAccounts = async () => {
  const response = await apiClient.get("/accounts/");
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await apiClient.post("/accounts/", accountData);
  return response.data;
};

// Loans API
export const getLoans = async () => {
  const response = await apiClient.get("/loans/");
  return response.data;
};

export const createLoan = async (loanData) => {
  const response = await apiClient.post("/loans/", loanData);
  return response.data;
};

// Credit Cards API
export const getCreditCards = async () => {
  const response = await apiClient.get("/credit-cards/");
  return response.data;
};

export const createCreditCard = async (cardData) => {
  const response = await apiClient.post("/credit-cards/", cardData);
  return response.data;
};

// Credit Card Loans API
export const getCreditCardLoans = async () => {
  const response = await apiClient.get("/credit-card-loans/");
  return response.data;
};

export const createCreditCardLoan = async (loanData) => {
  const response = await apiClient.post("/credit-card-loans/", loanData);
  return response.data;
};

// Payments API
export const getPayments = async () => {
  const response = await apiClient.get("/payments/");
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await apiClient.post("/payments/", paymentData);
  return response.data;
};
