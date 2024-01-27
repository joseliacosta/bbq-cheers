import { useQuery } from "react-query";
import { getAllCustomers } from "../api/api";

export const useGetAllCustomers = () => {
  return useQuery("customers", getAllCustomers);
};
