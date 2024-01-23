export function getAllCustomers() {
  return fetch(
    `https://parloafrontendchallenge.z6.web.core.windows.net/customers.json`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong`);
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}
