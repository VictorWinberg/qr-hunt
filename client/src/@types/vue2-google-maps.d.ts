declare module "vue2-google-maps" {
  import { PluginFunction } from "vue";
  export const install: PluginFunction<{}>;
  /// <reference types="@types/googlemaps" />
}

declare global {
  namespace JSX {
    const google: any;
  }
}
