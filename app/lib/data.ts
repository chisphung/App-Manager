import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Applicant
} from './definitions';
import { formatCurrency } from './utils';

const BASE_URL = 'http://localhost:8000';

export async function fetchRevenue() {
  try {
    const res = await fetch(`${BASE_URL}/revenue`);
    if (!res.ok) throw new Error('Failed to fetch revenue data.');
    const data: Revenue[] = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchLatestInvoices() {
  try {
    const res = await fetch(`${BASE_URL}/invoices/latest`);
    if (!res.ok) throw new Error('Failed to fetch latest invoices.');
    const data: LatestInvoiceRaw[] = await res.json();
    return data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchCardData() {
  try {
    const res = await fetch(`${BASE_URL}/cards`);
    if (!res.ok) throw new Error('Failed to fetch card data.');
    const data = await res.json();
    return {
      numberOfInvoices: data.numberOfInvoices,
      numberOfCustomers: data.numberOfCustomers,
      totalPaidInvoices: formatCurrency(data.totalPaidInvoices),
      totalPendingInvoices: formatCurrency(data.totalPendingInvoices),
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  try {
    const res = await fetch(`${BASE_URL}/invoices/filter?query=${encodeURIComponent(query)}&page=${currentPage}`);
    if (!res.ok) throw new Error('Failed to fetch invoices.');
    const data: InvoicesTable[] = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchApplicantsPages() {
  try {
    const res = await fetch(`${BASE_URL}/applicants/`);
    if (!res.ok) throw new Error('Failed to fetch total number of applicants.');
    const data: Applicant[] = await res.json();
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    return data.map((applicant) => ({
      ...applicant,
      date_of_birth: new Date(applicant.date_of_birth).toLocaleDateString(),
    }));
    // return totalPages;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchApplicantById(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/applicants/${id}`);
    if (!res.ok) throw new Error('Failed to fetch applicant.');
    const data: Applicant = await res.json();
    return {
      ...data,
      date_of_birth: new Date(data.date_of_birth).toLocaleDateString(),
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch invoice.');
    const data: InvoiceForm = await res.json();
    data.amount = data.amount / 100;
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchCustomers() {
  try {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers.');
    const data: CustomerField[] = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const res = await fetch(`${BASE_URL}/customers/filter?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch filtered customers.');
    const data: CustomersTableType[] = await res.json();
    return data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}
