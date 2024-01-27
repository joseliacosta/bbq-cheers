"use client";
import Link from "next/link";

import { useGetAllCustomers } from "./services/queries/queries";

export default function Home() {
  const { data, isLoading, error, isError } = useGetAllCustomers();

  return (
    <main>
      <h1>BBQ cheers! 🥘😋🍹</h1>

      {isError && <p>{(error as Error).message}</p>}
      {isLoading && <p>Loading...</p>}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Company name</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>{item.company}</td>
                <td>{item.industry}</td>
                <td>{item.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <Link href={`/details/${item.id}`}>See more</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
