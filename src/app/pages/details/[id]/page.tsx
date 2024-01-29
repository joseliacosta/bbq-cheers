"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useGetCustomerById } from "@/app/services/queries/queries";
import {
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/app/services/mutations/mutations";
import { Customer } from "@/app/types/customers";
import CustomerEditForm from "@/app/components/CustomerForm";

export default function Page({ params }: { params: { id: string } }) {
  const customerId = params.id;
  const router = useRouter();
  const {
    data: customer,
    error,
    isLoading,
    isError,
  } = useGetCustomerById(params);
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const [isEditing, setEditing] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this customer?") == true) {
      try {
        deleteCustomerMutation.mutateAsync(customerId);
        setEditing(false);
        alert("Customer deleted successfully");
        router.push("/");
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleSave = async (formData: Partial<Customer>) => {
    // Convert isActive to a boolean
    const formattedData: Partial<Customer> = {
      ...formData,
      isActive: Boolean(formData.isActive),
    };

    await updateCustomerMutation.mutate(
      {
        customerId,
        updatedData: formattedData,
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  };

  return (
    <>
      <h1>Customer Details</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{(error as Error).message}</p>}
      {customer && (
        <>
          {isEditing ? (
            <>
              <CustomerEditForm
                onSubmit={handleSave}
                onCancel={handleCancel}
                customer={customer[0]}
              />
              {updateCustomerMutation.isLoading && (
                <p>Updating customer details...</p>
              )}
              {updateCustomerMutation.isError && (
                <p>{(updateCustomerMutation.error as Error).message}</p>
              )}
            </>
          ) : (
            <div>
              <dl>
                <dt>Company name: </dt>
                <dd>{customer[0]?.company}</dd>
              </dl>
              <dl>
                <dt>Industry: </dt>
                <dd>{customer[0]?.industry}</dd>
              </dl>
              <dl>
                <dt>Status: </dt>
                <dd>{customer[0]?.isActive ? "Active" : "Inactive"}</dd>
              </dl>
              <dl>
                <dt>About: </dt>
                <dd>{customer[0]?.about}</dd>
              </dl>
              <section>
                <h2>Projects</h2>
                {customer[0]?.projects && customer[0]?.projects.length === 0 ? (
                  <p>This customer has no projects to be shown ☹️</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Start date</th>
                        <th>End date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer[0]?.projects &&
                        customer[0]?.projects.map((project) => (
                          <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>{project.contact}</td>
                            <td>{project.start_date}</td>
                            <td>{project.end_date}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </section>
              <section>
                <Link href={`/`}>Go back</Link>
                <button onClick={handleEditClick}>Edit</button>
                {!customer[0]?.isActive && (
                  <button onClick={handleDelete}>Delete</button>
                )}
              </section>
            </div>
          )}
        </>
      )}
    </>
  );
}
