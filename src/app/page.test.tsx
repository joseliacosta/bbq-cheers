import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { useGetAllCustomers } from "./services/queries/queries";
import Home from "./page";

const queryClient = new QueryClient();
jest.mock("./services/queries/queries");

describe("Home page", () => {
  describe("when fetching data", () => {
    it("renders loading state when isLoading is true", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      }),
        render(
          <QueryClientProvider client={queryClient}>
            <Home />
          </QueryClientProvider>
        );

      const loadingElement = screen.getByText(/Loading.../i);
      expect(loadingElement).toBeInTheDocument();
    });

    it("renders error when isError from is true", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Error"),
      }),
        render(
          <QueryClientProvider client={queryClient}>
            <Home />
          </QueryClientProvider>
        );

      const loadingElement = screen.queryByText(/Loading.../i);
      const errorElement = screen.getByText(/Error/i);

      expect(loadingElement).not.toBeInTheDocument();
      expect(errorElement).toBeInTheDocument();
    });

    it("renders table with one row when data is fetched successfully", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: [
          {
            id: "ea8294be-562d-4196-9329-79560ce84a5e",
            isActive: true,
            company: "Bahringer, Rice and Dach",
            industry: "marketing",
            projects: [
              {
                id: "1707b182-2bf7-45c2-874f-7cfa63c6d6b7",
                name: "Automated",
                contact: "kphillpotts6@sina.com.cn",
                start_date: "2021-11-07T11:23:23Z",
                end_date: null,
              },
            ],
            about:
              "Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
          },
        ],
        isLoading: false,
        isError: false,
        error: null,
      }),
        render(
          <QueryClientProvider client={queryClient}>
            <Home />
          </QueryClientProvider>
        );

      const loadingElement = screen.queryByText(/Loading.../i);
      const errorElement = screen.queryByText(/Error/i);
      const customerRow = screen.getByRole("row", {
        name: /Bahringer, Rice and Dach/i,
      });

      expect(loadingElement).not.toBeInTheDocument();
      expect(errorElement).not.toBeInTheDocument();
      expect(customerRow).toBeInTheDocument();
    });
  });
});
