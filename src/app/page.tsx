"use client";
import Link from "next/link";

import { useGetAllCustomers } from "./services/queries/queries";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, isLoading, error, isError } = useGetAllCustomers();
  const [searchByIndustryTerm, setSearchByIndustryTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchByIndustryTerm(searchTerm);

    const filteredItems = data?.filter((item) =>
      item.industry.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <Link href={`/details/${item.id}`}>See more</Link>
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
