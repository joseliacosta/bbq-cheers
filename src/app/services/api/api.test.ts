import {
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "./api";
import * as apiFetch from "./fetch";

const mockedData = [
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
];

jest.mock("./fetch");

describe("API", () => {
  beforeEach(() => {
    process.env.API_ENDPOINT = "http://localhost:4002";
  });

  afterEach(() => {
    delete process.env.API_KEY;
  });

  describe("getAllCustomers", () => {
    afterEach(() => {
      // Reset the mock after each test
      jest.clearAllMocks();
    });

    it("should fetch customers successfully", async () => {
      (apiFetch.fetchData as jest.Mock).mockResolvedValueOnce(mockedData);
      const customers = await getAllCustomers();

      expect(customers).toEqual(mockedData);
      expect(apiFetch.fetchData).toHaveBeenCalledTimes(1);
      expect(apiFetch.fetchData).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies`
      );
    });

    it("should throw an error if the response is not ok", async () => {
      (apiFetch.fetchData as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch data")
      );

      await expect(getAllCustomers()).rejects.toThrowError(
        "Failed to fetch data"
      );
    });
  });

  describe("getCustomerById", () => {
    it("should fetch a customer by id successfully", async () => {
      const mockCustomerId = "1";
      const mockResponse = mockedData[0];

      // Mock the implementation of fetchData
      (apiFetch.fetchData as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getCustomerById(mockCustomerId);

      expect(apiFetch.fetchData).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies?id=${mockCustomerId}`
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateCustomer", () => {
    it("should call sendData with the correct parameters", async () => {
      const mockCompanyId = "123";
      const mockUpdatedData = { company: "Updated Company" };
      const mockResponse = {
        id: "123",
        name: "Updated Company",
        isAtive: true,
        industry: "insurance",
        about: "something about company",
      };

      // Mock the implementation of sendData
      (apiFetch.sendData as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await updateCustomer(mockCompanyId, mockUpdatedData);

      expect(apiFetch.sendData).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies/${mockCompanyId}`,
        "PATCH",
        mockUpdatedData
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if sendData fails", async () => {
      const mockCompanyId = "123";
      const mockUpdatedData = { company: "Updated Company" };

      // Mock sendData to throw an error
      (apiFetch.sendData as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to update")
      );

      await expect(
        updateCustomer(mockCompanyId, mockUpdatedData)
      ).rejects.toThrowError("Failed to update");

      expect(apiFetch.sendData).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies/${mockCompanyId}`,
        "PATCH",
        mockUpdatedData
      );
    });
  });

  describe("deleteCustomer", () => {
    it("should call deleteData with the correct parameters", async () => {
      const mockCompanyId = "40c0bad7-f1a6-4173-bd44-7ebef044905d";
      (apiFetch.deleteData as jest.Mock).mockResolvedValueOnce({
        id: "40c0bad7-f1a6-4173-bd44-7ebef044905d",
      });

      await deleteCustomer(mockCompanyId);

      expect(apiFetch.deleteData).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies/${mockCompanyId}`,
        `${mockCompanyId}`
      );
    });
  });
});
