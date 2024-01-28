import { Customer } from "@/app/types/customers";

const { API_ENDPOINT } = process.env;

export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Something went wrong`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export function getAllCustomers(): Promise<Customer[]> {
  const url = `${API_ENDPOINT}/companies`;
  return fetchData<Customer[]>(url);
}

export function getCustomerById(customerId: string): Promise<Customer[]> {
  const url = `${API_ENDPOINT}/companies?id=${customerId}`;
  return fetchData<Customer[]>(url);
}
