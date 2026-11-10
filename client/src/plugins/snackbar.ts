export interface SnackbarOptions {
  text?: string;
  textColor?: string;
  width?: string;
  showAction?: boolean;
  actionText?: string;
  actionTextColor?: string;
  backgroundColor?: string;
  pos?:
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "top-left"
    | "top-center"
    | "top-right";
  duration?: number;
  customClass?: string;
  onActionClick?: (element: HTMLElement) => void;
  onClose?: (element: HTMLElement) => void;
}

const defaults: Required<
  Pick<
    SnackbarOptions,
    | "text"
    | "textColor"
    | "width"
    | "showAction"
    | "actionText"
    | "actionTextColor"
    | "backgroundColor"
    | "pos"
    | "duration"
    | "customClass"
  >
> & {
  onActionClick: (element: HTMLElement) => void;
  onClose: (element: HTMLElement) => void;
} = {
  text: "",
  textColor: "#FFFFFF",
  width: "auto",
  showAction: true,
  actionText: "Dismiss",
  actionTextColor: "#4CAF50",
  backgroundColor: "#323232",
  pos: "bottom-left",
  duration: 5000,
  customClass: "",
  onActionClick: element => {
    element.style.opacity = "0";
  },
  onClose: () => {}
};

let current: HTMLElement | null = null;

const mergeOptions = (options: SnackbarOptions): typeof defaults => ({
  ...defaults,
  ...options
});

const show = (options: SnackbarOptions): void => {
  const merged = mergeOptions(options);

  if (current) {
    current.style.opacity = "0";
    const previous = current;
    setTimeout(() => {
      previous.parentElement?.removeChild(previous);
    }, 500);
  }

  const snackbar = document.createElement("div");
  snackbar.className = `snackbar-container ${merged.customClass}`.trim();
  snackbar.style.width = merged.width;

  const text = document.createElement("p");
  text.style.margin = "0";
  text.style.padding = "0";
  text.style.color = merged.textColor;
  text.style.fontSize = "14px";
  text.style.fontWeight = "300";
  text.style.lineHeight = "1em";
  text.innerHTML = merged.text;
  snackbar.appendChild(text);
  snackbar.style.background = merged.backgroundColor;

  if (merged.showAction) {
    const actionButton = document.createElement("button");
    actionButton.className = "action";
    actionButton.innerHTML = merged.actionText;
    actionButton.style.color = merged.actionTextColor;
    actionButton.addEventListener("click", () => {
      merged.onActionClick(snackbar);
    });
    snackbar.appendChild(actionButton);
  }

  if (merged.duration) {
    setTimeout(() => {
      if (current === snackbar) {
        snackbar.style.opacity = "0";
        snackbar.style.top = "-100px";
        snackbar.style.bottom = "-100px";
      }
    }, merged.duration);
  }

  snackbar.addEventListener("transitionend", function onTransitionEnd(
    event: TransitionEvent
  ) {
    if (event.propertyName === "opacity" && this.style.opacity === "0") {
      merged.onClose(this);
      this.parentElement?.removeChild(this);
      if (current === this) {
        current = null;
      }
    }
  });

  current = snackbar;
  document.body.appendChild(snackbar);
  snackbar.style.opacity = "1";
  snackbar.className = `snackbar-container ${merged.customClass} snackbar-pos ${merged.pos}`.trim();
};

const close = (): void => {
  if (current) {
    current.style.opacity = "0";
  }
};

const err = (text?: string): void =>
  show({
    text,
    pos: "top-right",
    actionText: "<i class='fas fa-times-circle'></i>",
    backgroundColor: "#d32f2f",
    actionTextColor: "#ccc"
  });

const warn = (text?: string): void =>
  show({
    text,
    textColor: "black",
    pos: "top-right",
    actionText: "<i class='fas fa-times-circle'></i>",
    backgroundColor: "#ff9800",
    actionTextColor: "black"
  });

export default { show, close, err, warn };
