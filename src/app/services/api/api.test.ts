import { getAllCustomers, getCustomerById } from "./api";

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
describe("API", () => {
  beforeEach(() => {
    // Mock process.env for the test
    process.env.API_ENDPOINT = "http://localhost:4002";
  });

  afterEach(() => {
    // Restore process.env after the test
    delete process.env.API_KEY;
  });

  describe("getAllCustomers", () => {
    beforeEach(() => {
      // Mock the fetch function
      global.fetch = jest.fn(
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockedData),
          }) as Promise<Response>
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should fetch customers successfully", async () => {
      const customers = await getAllCustomers();

      expect(customers).toEqual(mockedData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies`
      );
    });

    it("should throw an error if the response is not ok", async () => {
      global.fetch = jest.fn(
        () =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Something went wrong" }),
          }) as Promise<Response> // Cast the return value to Promise<Response>
      );

      await expect(getAllCustomers()).rejects.toThrow("Something went wrong");
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if there is an error during the fetch", async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

      await expect(getAllCustomers()).rejects.toThrow("Network error");
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCustomerById", () => {
    it("should fetch a customer by id successfully", async () => {
      const customerId = "40c0bad7-f1a6-4173-bd44-7ebef044905d";

      global.fetch = jest.fn(
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockedData[0]),
          }) as Promise<Response>
      );

      const customer = await getCustomerById(customerId);

      expect(customer).toEqual(mockedData[0]);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.API_ENDPOINT}/companies?id=${customerId}`
      );
    });
  });
});
