"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useGetCustomerById } from "@/app/services/queries/queries";
import {
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/app/services/mutations/mutations";
import { Customer } from "@/app/types/customers";
import CustomerEditForm from "@/app/components/CustomerForm";
import { Container } from "@/app/components/Container";
import { DescriptionList } from "@/app/components/DefinitionList";
import {
  Table,
  TableCell,
  TableRow,
  TableThCell,
} from "@/app/components/Table";
import { Button } from "@/app/components/Button";
import { FooterActions } from "@/app/components/FooterActions";

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
    <Container>
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
              <DescriptionList>
                <dt>Company name: </dt>
                <dd>{customer[0]?.company}</dd>
              </DescriptionList>
              <DescriptionList>
                <dt>Industry: </dt>
                <dd>{customer[0]?.industry}</dd>
              </DescriptionList>
              <DescriptionList>
                <dt>Status: </dt>
                <dd>{customer[0]?.isActive ? "Active" : "Inactive"}</dd>
              </DescriptionList>
              <DescriptionList>
                <dt>About: </dt>
                <dd>{customer[0]?.about}</dd>
              </DescriptionList>
              <section>
                <h2>Projects</h2>
                {customer[0]?.projects && customer[0]?.projects.length === 0 ? (
                  <p>This customer has no projects to be shown ☹️</p>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <TableThCell>Name</TableThCell>
                        <TableThCell>Contact</TableThCell>
                        <TableThCell>Start date</TableThCell>
                        <TableThCell>End date</TableThCell>
                      </tr>
                    </thead>
                    <tbody>
                      {customer[0]?.projects &&
                        customer[0]?.projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.contact}</TableCell>
                            <TableCell>{project.start_date}</TableCell>
                            <TableCell>{project.end_date}</TableCell>
                          </TableRow>
                        ))}
                    </tbody>
                  </Table>
                )}
              </section>
              <FooterActions>
                <Link href={`/`}>Go back</Link>
                <Button onClick={handleEditClick}>Edit</Button>
                {!customer[0]?.isActive && (
                  <Button onClick={handleDelete}>Delete</Button>
                )}
              </FooterActions>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
