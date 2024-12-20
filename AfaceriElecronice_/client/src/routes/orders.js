import { getApiUrl } from "../utils/envUtils";

export const createOrder = async (payload, token) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  };

  const result = await fetch(`${getApiUrl()}/orders/create`, options);
  const response = await result.json();
  return response;
};
