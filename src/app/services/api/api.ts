import { Customer } from "@/app/types/customers";
import { deleteData, fetchData, sendData } from "./fetch";

const API_ENDPOINT = process.env.API_ENDPOINT || "http://localhost:4002";

export function getAllCustomers(): Promise<Customer[]> {
  const url = `${API_ENDPOINT}/companies`;
  return fetchData<Customer[]>(url);
}

export function getCustomerById(customerId: string): Promise<Customer[]> {
  const url = `${API_ENDPOINT}/companies?id=${customerId}`;
  return fetchData<Customer[]>(url);
}

export async function updateCustomer(
  companyId: string,
  updatedData: Partial<Customer>
): Promise<Customer> {
  const apiUrl = `${API_ENDPOINT}/companies/${companyId}`;

  try {
    const updatedCompany = await sendData<Customer>(
      apiUrl,
      "PATCH",
      updatedData
    );

    return updatedCompany;
  } catch (error) {
    throw error;
  }
}

export async function deleteCustomer(customerId: string) {
  const apiUrl = `${API_ENDPOINT}/companies/${customerId}`;
  try {
    deleteData(apiUrl, customerId);
  } catch (error) {
    throw error;
  }
}
