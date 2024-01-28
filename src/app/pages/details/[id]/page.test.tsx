import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetCustomerById } from "../../../services/queries/queries";
import Page from "./page";

jest.mock("../../../services/queries/queries");

const queryClient = new QueryClient();

const mockData = [
  {
    id: "1",
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
  },
];

describe("Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("when fetching data", () => {
    it("renders loading state", async () => {
      (useGetCustomerById as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      }),
        render(
          <QueryClientProvider client={queryClient}>
            <Page params={{ id: "1" }} />
          </QueryClientProvider>
        );

      const loadingElement = screen.getByText(/Loading.../i);
      expect(loadingElement).toBeInTheDocument();
    });

    it("renders error when isError from is true", async () => {
      (useGetCustomerById as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Error"),
      }),
        render(
          <QueryClientProvider client={queryClient}>
            <Page params={{ id: "1" }} />
          </QueryClientProvider>
        );

      const loadingElement = screen.queryByText(/Loading.../i);
      const errorElement = screen.getByText(/Error/i);

      expect(loadingElement).not.toBeInTheDocument();
      expect(errorElement).toBeInTheDocument();
    });

    it("renders customer details when data is fetched successfully", async () => {
      (useGetCustomerById as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null,
      });
      render(
        <QueryClientProvider client={queryClient}>
          <Page params={{ id: "1" }} />
        </QueryClientProvider>
      );

      const loadingElement = screen.queryByText(/Loading.../i);
      const errorElement = screen.queryByText(/Error/i);
      const customerDetailsElements = screen.getAllByRole("term");
      const customerDetailsDefinitionElements =
        screen.getAllByRole("definition");
      const customerProjectsElements = screen.getByRole("table");
      const goBackButton = screen.getByRole("link");

      expect(loadingElement).not.toBeInTheDocument();
      expect(errorElement).not.toBeInTheDocument();
      expect(customerDetailsElements).toHaveLength(4);
      expect(customerDetailsDefinitionElements).toHaveLength(4);
      expect(customerProjectsElements).toBeInTheDocument();
      expect(goBackButton).toBeInTheDocument();
    });
  });
});
