import { getApiUrl } from "../utils/envUtils";

export const registerUser = async (name, email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  };

  const result = await fetch(`${getApiUrl()}/users`, options);
  const response = await result.json();
  return response;
};
