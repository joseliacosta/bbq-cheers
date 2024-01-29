import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

import { useGetAllCustomers } from "./services/queries/queries";
import Home from "./page";

const queryClient = new QueryClient();
jest.mock("./services/queries/queries");

const mockData = [
  {
    id: "40c0bad7-f1a6-4173-bd44-7ebef044905d",
    isActive: false,
    company: "Abbott, Olson and Moen",
    industry: "insurance",
    projects: [
      {
        id: "69812942-9b25-4eb1-8fe2-7b3709f9b29e",
        name: "User-friendly",
        contact: "ldodamead0@wikipedia.org",
        start_date: "2021-10-26T03:45:04Z",
        end_date: "2022-06-16T16:27:29Z",
      },
    ],
    about:
      "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.",
  },
  {
    id: "1798e668-8eb3-424f-8af7-6e6da2515b14",
    isActive: true,
    company: "Doyle-Kessler",
    industry: "travel",
    projects: [
      {
        id: "e25fc621-1aed-4898-9714-090f300c75c8",
        name: "Grass-roots",
        contact: "fsimony1@hostgator.com",
        start_date: "2021-10-05T07:33:02Z",
        end_date: "2022-05-30T10:40:32Z",
      },
      {
        id: "64c726d0-c9a2-4a8f-a775-4340da21c721",
        name: "dynamic",
        contact: "lallibon2@bloglines.com",
        start_date: "2022-01-05T11:54:14Z",
        end_date: "2022-03-31T17:50:50Z",
      },
      {
        id: "fa93c65a-0433-479f-bcaa-27fab7b5c57d",
        name: "Ergonomic",
        contact: "shyslop3@usatoday.com",
        start_date: "2021-12-03T22:51:58Z",
        end_date: null,
      },
    ],
    about:
      "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.",
  },
  {
    id: "6c855520-58f0-47a1-8636-21268959e763",
    isActive: false,
    company: "Abbott, Ullrich and Durgan",
    industry: "tech",
    projects: [
      {
        id: "4653f575-ae02-4d4b-b938-fc32a77f2196",
        name: "bifurcated",
        contact: "bmose4@domainmarket.com",
        start_date: "2022-02-07T14:38:55Z",
        end_date: "2022-04-08T17:10:10Z",
      },
      {
        id: "5a007770-c624-4b07-a010-03637a56a569",
        name: "Expanded",
        contact: "gneary5@vkontakte.ru",
        start_date: "2021-11-16T23:08:06Z",
        end_date: "2022-06-17T21:27:34Z",
      },
    ],
    about:
      "Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
  },
];

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
        data: mockData,
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
      const customersRows = screen.getAllByRole("row");

      expect(loadingElement).not.toBeInTheDocument();
      expect(errorElement).not.toBeInTheDocument();
      expect(customersRows).toHaveLength(4); // 1 row is the table header
    });
  });

  describe("when filtering data", () => {
    it("should filters data based on input", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      );

      // Initial render should display all items
      expect(screen.getByText("Abbott, Olson and Moen")).toBeInTheDocument();
      expect(screen.getByText("Doyle-Kessler")).toBeInTheDocument();
      expect(
        screen.getByText("Abbott, Ullrich and Durgan")
      ).toBeInTheDocument();

      // Type in the search input
      userEvent.type(screen.getByRole("searchbox"), "tech");

      // Wait for the component to update after the debounce period
      await waitFor(() => {
        // After filtering, only Company3 should be visible
        expect(screen.queryByText("Abbott, Olson and Moen")).toBeNull();
        expect(screen.queryByText("Doyle-Kessler")).toBeNull();
        expect(
          screen.getByText("Abbott, Ullrich and Durgan")
        ).toBeInTheDocument();
      });
    });

    it("should returns `No results` if filter do not have a corresponding value", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      );

      // Initial render should display all items
      expect(screen.getByText("Abbott, Olson and Moen")).toBeInTheDocument();
      expect(screen.getByText("Doyle-Kessler")).toBeInTheDocument();
      expect(
        screen.getByText("Abbott, Ullrich and Durgan")
      ).toBeInTheDocument();

      // Type in the search input
      userEvent.type(screen.getByRole("searchbox"), "consulting");

      // Wait for the component to update after the debounce period
      await waitFor(() => {
        expect(
          screen.queryByText("Abbott, Olson and Moen")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Doyle-Kessler")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Abbott, Ullrich and Durgan")
        ).not.toBeInTheDocument();
        expect(screen.getByText("No results")).toBeInTheDocument();
      });
    });

    it("renders select status element with correct options", () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      );

      const selectElement = screen.getByRole("combobox");
      const allStatusOption = screen.getByRole("option", {
        name: "All Status",
      });
      const activeOption = screen.getByRole("option", { name: "Active" });
      const inactiveOption = screen.getByRole("option", { name: "Inactive" });

      expect(selectElement).toBeInTheDocument();
      expect(allStatusOption).toBeInTheDocument();
      expect(activeOption).toBeInTheDocument();
      expect(inactiveOption).toBeInTheDocument();
    });

    it("filters data by status", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      );

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "Active" } });

      expect(screen.getByText("Doyle-Kessler")).toBeInTheDocument();
    });

    it("filters data by industry and status", async () => {
      (useGetAllCustomers as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      );

      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "tech" } });

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "Inactive" } });
      screen.debug();
      expect(
        screen.getByText("Abbott, Ullrich and Durgan")
      ).toBeInTheDocument();
    });
  });
});
