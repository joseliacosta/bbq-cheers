import { useMutation, useQueryClient } from "react-query";

import { Customer } from "@/app/types/customers";
import { updateCustomer } from "../api/api";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({
      customerId,
      updatedData,
    }: {
      customerId: string;
      updatedData: Partial<Customer>;
    }) => {
      const updatedCustomer = await updateCustomer(customerId, updatedData);
      return updatedCustomer;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("customer");
      },
    }
  );

  return mutation;
}
