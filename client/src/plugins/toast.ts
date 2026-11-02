import { createToastInterface, POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

export const toast = createToastInterface({
  hideProgressBar: true,
  draggable: false,
  closeOnClick: false,
  transition: "Vue-Toastification__fade"
});

export { POSITION, TYPE };
