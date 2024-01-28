"use client";
import { useGetCustomerById } from "@/app/services/queries/queries";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const {
    data: customer,
    error,
    isLoading,
    isError,
  } = useGetCustomerById(params);

  return (
    <>
      <h1>Customer Details</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{(error as Error).message}</p>}
      {customer && (
        <>
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
                {customer[0]?.projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.contact}</td>
                    <td>{project.start_date}</td>
                    <td>{project.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <Link href={`/`}>Go back</Link>
        </>
      )}
    </>
  );
}
