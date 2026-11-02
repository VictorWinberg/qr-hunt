import { EVENT_TYPE } from "@/constants";
import CustomSnackbar from "@/plugins/snackbar";
import EventBus from "@/plugins/event-bus";

function isJson(str): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const apiFetch = (method?: string) => async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<{ data; err }> => {
  try {
    const response = await fetch(input, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      method,
      ...init
    });
    if (method !== "GET") EventBus.$emit(EVENT_TYPE.API_REQUEST_UPDATE);
    const data = await response.text();
    if (!response.ok) {
      throw new Error(`${response.status} - ${data || response.statusText}`);
    }
    return { data: isJson(data) ? JSON.parse(data) : data, err: false };
  } catch (err) {
    CustomSnackbar.err(err as string);
    return { data: null, err };
  }
};

export const api = {
  get: apiFetch("GET"),
  put: apiFetch("PUT"),
  post: apiFetch("POST"),
  delete: apiFetch("DELETE")
};
