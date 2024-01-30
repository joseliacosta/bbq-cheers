import { ThemeProvider } from "styled-components";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QueryClient, QueryClientProvider } from "react-query";

import { useGetCustomerById } from "../../../services/queries/queries";
import {
  useUpdateCustomer,
  useDeleteCustomer,
} from "../../../services/mutations/mutations";
import Page from "./page";
import GlobalStyles from "@/app/theme/GlobalStyles";
import theme from "@/app/theme/theme";

jest.mock("../../../services/queries/queries");
jest.mock("../../../services/mutations/mutations", () => ({
  useUpdateCustomer: () => ({
    mutate: jest.fn(),
  }),
  useDeleteCustomer: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

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

function renderCustomerDetailsPage() {
  return render(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <Page params={{ id: "1" }} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

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
        renderCustomerDetailsPage();

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
        renderCustomerDetailsPage();

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

      renderCustomerDetailsPage();

      const loadingElement = screen.queryByText(/Loading.../i);
      const errorElement = screen.queryByText(/Error/i);
      const customerDetailsElements = screen.getAllByRole("term");
      const customerDetailsDefinitionElements =
        screen.getAllByRole("definition");
      const customerProjectsElement = screen.getByRole("table");
      const goBackButton = screen.getByRole("link");

      expect(loadingElement).not.toBeInTheDocument();
      expect(errorElement).not.toBeInTheDocument();
      expect(customerDetailsElements).toHaveLength(4);
      expect(customerDetailsDefinitionElements).toHaveLength(4);
      expect(customerProjectsElement).toBeInTheDocument();
      expect(goBackButton).toBeInTheDocument();
    });
    it("do not renders Projects table if customer has no projects", async () => {
      const modifiedMockData = mockData.map((item) => ({
        ...item,
        projects: [],
      }));

      (useGetCustomerById as jest.Mock).mockReturnValue({
        data: modifiedMockData,
        isLoading: false,
        isError: false,
        error: null,
      });

      renderCustomerDetailsPage();

      const customerProjectsElements = screen.queryByRole("table");
      const noProjectsMessage = screen.getByText(
        /This customer has no projects to be shown ☹️/i
      );

      expect(customerProjectsElements).not.toBeInTheDocument();
      expect(noProjectsMessage).toBeInTheDocument();
    });
  });

  it("enters editing state when the edit button is clicked", async () => {
    (useGetCustomerById as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderCustomerDetailsPage();

    const editButton = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editButton);

    await waitFor(() => {
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
  });

  it("exits editing state when the save button is clicked", async () => {
    // initial data
    (useGetCustomerById as jest.Mock).mockReturnValue({
      data: mockData[0],
      isLoading: false,
      isError: false,
      error: null,
    });

    renderCustomerDetailsPage();

    const mockedUpdatedData = { id: "123", company: "new company name" };
    (useUpdateCustomer().mutate as jest.Mock).mockResolvedValue(
      mockedUpdatedData
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editButton);
    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    await userEvent.click(saveButton);

    waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });
  });

  it("removes a user when click in delete button", async () => {
    (useGetCustomerById as jest.Mock).mockReturnValue({
      data: mockData[0],
      isLoading: false,
      isError: false,
      error: null,
    });
    const confirmSpy = jest.spyOn(window, "confirm");
    confirmSpy.mockImplementation(jest.fn(() => true));

    const alertSpy = jest.spyOn(window, "alert");
    alertSpy.mockImplementation(jest.fn());

    renderCustomerDetailsPage();

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(useDeleteCustomer).toHaveBeenCalled();
    });

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
