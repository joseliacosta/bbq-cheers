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
