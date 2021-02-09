import Snackbar from "node-snackbar";

const err = (text?: string): void =>
  Snackbar.show({
    text,
    pos: "top-right",
    backgroundColor: "#d32f2f",
    actionTextColor: "#ccc"
  });

export default { err };
