/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import { VueConstructor } from "vue/types/umd";

const CustomFetch = {
  install(Vue: VueConstructor<Vue>): void {
    Vue.prototype.fetch = async function(
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
        return { data: await response.json(), err: false };
      } catch (err) {
        alert(err);
        return { data: {}, err };
      }
    };
  }
};

Vue.use(CustomFetch);
