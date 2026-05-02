import axios from "axios";

const API_URL = "http://localhost:8000"; // Assuming backend will run on port 8000

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
