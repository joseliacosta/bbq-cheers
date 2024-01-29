"use client";
import Link from "next/link";

import { useGetAllCustomers } from "./services/queries/queries";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, isLoading, error, isError } = useGetAllCustomers();
  const [searchByIndustryTerm, setSearchByIndustryTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchByIndustryTerm(searchTerm);

    filterData(searchTerm, selectedStatus);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setSelectedStatus(selectedStatus);

    filterData(searchByIndustryTerm, selectedStatus);
  };

  const filterData = (industry: string, status: string | undefined) => {
    const filteredItems = data?.filter(
      (item) =>
        item.industry.toLowerCase().includes(industry.toLowerCase()) &&
        (status === undefined ||
          status === "" ||
          (item.isActive ? "Active" : "Inactive") === status)
    );

    setFilteredData(filteredItems);
  };

  return (
    <main>
      <h1>BBQ cheers! 🥘😋🍹</h1>
      <header>
        <h2>Filter</h2>
        <input
          type="search"
          placeholder="Search companies by industry"
          onChange={handleInputChange}
        />
        <select
          name="status"
          onChange={handleStatusChange}
          value={selectedStatus || ""}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </header>
      {isError && <p>{(error as Error).message}</p>}
      {isLoading && <p>Loading...</p>}
      {filteredData && (
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
            {filteredData.length === 0 ? (
              <tr>
                <td>No results</td>
              </tr>
            ) : (
              filteredData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.company}</td>
                  <td>{item.industry}</td>
                  <td>{item.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <Link href={`pages/details/${item.id}`}>See more</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}
