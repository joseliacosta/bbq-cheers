"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useGetAllCustomers } from "./services/queries/queries";
import { Table, TableCell, TableRow, TableThCell } from "./components/Table";
import { SearchField } from "./components/SearchField";
import { Select } from "./components/SelectField";
import { Container } from "./components/Container";

const Header = styled.header`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
`;

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
    <Container>
      <h1>BBQ cheers! 🥘😋🍹</h1>
      <Header>
        <SearchField
          type="search"
          placeholder="Search companies by industry"
          onChange={handleInputChange}
        />
        <Select
          name="status"
          onChange={handleStatusChange}
          value={selectedStatus || ""}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </Header>
      {isError && <p>{(error as Error).message}</p>}
      {isLoading && <p>Loading...</p>}
      {filteredData && (
        <Table>
          <thead>
            <tr>
              <TableThCell>Company name</TableThCell>
              <TableThCell>Industry</TableThCell>
              <TableThCell>Status</TableThCell>
              <TableThCell>Actions</TableThCell>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.industry}</TableCell>
                  <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Link href={`pages/details/${item.id}`}>See more</Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
