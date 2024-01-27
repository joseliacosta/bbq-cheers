import { Customer } from "@/app/types/customers";

export function getAllCustomers(): Promise<Customer[]> {
  return fetch(`http://localhost:4002/companies`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong`);
      }
      return response.json() as Promise<Customer[]>;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}
