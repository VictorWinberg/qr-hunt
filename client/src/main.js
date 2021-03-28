import { app } from "hyperapp";
import initState from "./state";
import App from "./App";
import "./main.css";
import "./registerServiceWorker";

app({
  node: document.getElementById("app"),
  init: initState,
  view: App,
});
