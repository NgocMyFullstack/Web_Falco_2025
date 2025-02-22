import apiClient from "./Api";
import { useAuth } from "../views/Login/authcontext";

export const useLogin = () => {
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      const response = await apiClient.post("account/token/", credentials);
      const { access, refresh, user } = response.data;
      login(user, access, refresh);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      throw new Error("Login failed: " + error.message);
    }
  };

  return { handleLogin };
};
