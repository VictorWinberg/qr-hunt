/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import { VueConstructor } from "vue/types/umd";
import Snackbar from "node-snackbar";

function isJson(str: any): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export async function customFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<{ data: any; err: any }> {
  try {
    const response = await fetch(input, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      ...init
    });
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
    const data = await response.text();
    return { data: isJson(data) ? JSON.parse(data) : data, err: false };
  } catch (err) {
    Snackbar.show({
      text: err,
      pos: "top-right",
      backgroundColor: "#d32f2f",
      actionTextColor: "#ccc"
    });
    return { data: {}, err };
  }
}

const CustomFetch = {
  install(Vue: VueConstructor<Vue>): void {
    Vue.prototype.$fetch = customFetch;
  }
};

Vue.use(CustomFetch);
