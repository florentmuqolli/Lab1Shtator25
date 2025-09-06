import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

const useLogout = (setLoading) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout", null, {
        withCredentials: true,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");

      toast.success("Logged out");

      setTimeout(() => {
        setLoading(false);
        navigate("/login", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed. Try again later.");
      setLoading(false);
    }
  };

  return handleLogout;
};

export default useLogout;