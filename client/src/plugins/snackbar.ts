import Snackbar from "node-snackbar";

const err = (text?: string): void =>
  Snackbar.show({
    text,
    pos: "top-right",
    actionText: "<i class='fas fa-times-circle'></i>",
    backgroundColor: "#d32f2f",
    actionTextColor: "#ccc"
  });

const warn = (text?: string): void =>
  Snackbar.show({
    text,
    textColor: "black",
    pos: "top-right",
    actionText: "<i class='fas fa-times-circle'></i>",
    backgroundColor: "#ff9800",
    actionTextColor: "black"
  });

export default { err, warn };
