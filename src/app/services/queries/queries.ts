import { useQuery } from "react-query";
import { getAllCustomers, getCustomerById } from "../api/api";

export const useGetAllCustomers = () => {
  return useQuery("customers", getAllCustomers);
};

export const useGetCustomerById = (params: { id: string }) => {
  return useQuery({
    queryKey: ["customer", params.id],
    queryFn: () => getCustomerById(params.id),
  });
};
