import { getAllCustomers } from "./api";

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
];
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
    expect(fetch).toHaveBeenCalledWith("http://localhost:4002/companies");
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
