import { toast as sonnerToast } from 'sonner';
/**
 * Custom Toast wrapper
 * Default type: "default"
 *
 * Usage:
 *  toast("Hello world")
 *  toast.success("Action successful!", { description: "Extra info here" })
 *  toast.error("Something went wrong", { action: { label: "Retry", onClick: () => {} } })
 */

export const toast = (message, options = {}) => {
  return sonnerToast(message, {
    ...options,
    closeButton: true,
    className: 'custom-toast',
  });
};

// Shorthand helpers
toast.success = (message, options = {}) =>
  sonnerToast.success(message, {
    ...options,
    className: 'custom-toast success',
  });
toast.error = (message, options = {}) =>
  sonnerToast.error(message, {
    ...options,
    className: 'custom-toast error',
  });

toast.info = (message, options = {}) =>
  sonnerToast.info(message, {
    ...options,
    className: 'custom-toast info',
  });
toast.warning = (message, options = {}) =>
  sonnerToast.warning(message, {
    ...options,
    className: 'custom-toast info',
  });
