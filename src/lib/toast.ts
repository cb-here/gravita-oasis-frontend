type ToastVariant = "success" | "error" | "warning" | "info";

let triggerToast:
  | ((
      variant: ToastVariant,
      title?: string,
      message?: string,
      duration?: number
    ) => void)
  | null = null;

export const registerToastTrigger = (fn: typeof triggerToast) => {
  triggerToast = fn;
};

export const showToast = (
  variant: ToastVariant,
  title?: string,
  message?: string,
  duration = 3000
) => {
  if (triggerToast) {
    triggerToast(variant, title, message, duration);
  } else {
    console.warn("Toast system not initialized");
  }
};
