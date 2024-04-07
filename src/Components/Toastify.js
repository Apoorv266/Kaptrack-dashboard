import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (data) => toast.success(data);
export const notifyError = () => toast.success("Something went wrong !");
export const notifyComponent = () => (
  <ToastContainer autoClose={1000} position="bottom-right" />
);
