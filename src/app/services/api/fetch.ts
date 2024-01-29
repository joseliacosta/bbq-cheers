export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Something went wrong`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function sendData<T>(
  url: string,
  method: string,
  data?: any
): Promise<T> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error fetching data:", (error as Error).message);
    throw error;
  }
}

export async function deleteData(url: string, customerId: string) {
  const apiUrl = url;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: customerId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete customer. Status: ${response.status}`);
    }
    console.log("Customer deleted successfully.");
  } catch (error) {
    console.error("Error deleting customer:", (error as Error).message);
    throw error;
  }
}
