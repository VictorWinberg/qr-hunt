import { toast, POSITION } from "@/plugins/toast";
import {
  ToastHtmlContent,
  createActionCloseButton
} from "@/plugins/snackbar-components";

type SnackbarPosition = "top-right" | "top-center" | "top-left" | undefined;

export interface SnackbarShowOptions {
  text?: string;
  textColor?: string;
  actionText?: string;
  actionTextColor?: string;
  backgroundColor?: string;
  duration?: number;
  pos?: SnackbarPosition;
  customClass?: string;
  onActionClick?: () => void | Promise<void>;
}

let activeToastId: string | number | null = null;

const positionFor = (pos?: SnackbarPosition): POSITION => {
  switch (pos) {
    case "top-center":
      return POSITION.TOP_CENTER;
    case "top-left":
      return POSITION.TOP_LEFT;
    case "top-right":
      return POSITION.TOP_RIGHT;
    default:
      return POSITION.TOP_CENTER;
  }
};

const show = (options: SnackbarShowOptions): void => {
  const {
    text = "",
    textColor,
    actionText,
    actionTextColor,
    backgroundColor,
    duration,
    pos,
    customClass,
    onActionClick
  } = options;

  const toastClassName = ["app-toast"];
  if (customClass) toastClassName.push(customClass);
  if (backgroundColor) toastClassName.push("app-toast--custom-bg");
  if (textColor === "black") toastClassName.push("app-toast--dark-text");

  let toastStyle: Record<string, string> | undefined;
  if (backgroundColor || actionTextColor) {
    toastStyle = {};
    if (backgroundColor) toastStyle.backgroundColor = backgroundColor;
    if (actionTextColor) toastStyle["--toast-action-color"] = actionTextColor;
  }

  activeToastId = toast(
    {
      component: ToastHtmlContent,
      props: { content: text }
    },
    {
      position: positionFor(pos),
      timeout: duration === 0 ? false : duration ?? 5000,
      icon: false,
      toastClassName,
      bodyClassName: "app-toast__body",
      closeButton: actionText
        ? createActionCloseButton(actionText, onActionClick)
        : "button",
      closeButtonClassName: actionText ? "toast-action-host" : undefined,
      ...(toastStyle ? { toastStyle } : {})
    }
  );
};

const close = (): void => {
  if (activeToastId !== null) {
    toast.dismiss(activeToastId);
    activeToastId = null;
  }
};

const err = (text?: string): void => {
  toast.error(text ?? "", {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    icon: false,
    toastClassName: "app-toast app-toast--error",
    closeButtonClassName: "toast-action-host",
    closeButton: createActionCloseButton("<i class='fas fa-times-circle'></i>")
  });
};

const warn = (text?: string): void => {
  toast.warning(text ?? "", {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    icon: false,
    toastClassName: "app-toast app-toast--warn app-toast--dark-text",
    closeButtonClassName: "toast-action-host",
    closeButton: createActionCloseButton("<i class='fas fa-times-circle'></i>")
  });
};

export default { err, warn, show, close };
