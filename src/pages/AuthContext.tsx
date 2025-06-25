import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown; // Sesuaikan dengan tipe data user Anda
  isLoading: boolean; // Tambahkan isLoading ke interface
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown>(null); // Sesuaikan dengan tipe data user Anda
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state isLoading

  // Cek status autentikasi saat komponen dimuat
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        try {
          const response = await axiosInstance.get("/api/auth/check-auth", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.data.status) {
            setIsAuthenticated(true);
            const userData = localStorage.getItem("user");
            if (userData) {
              setUser(JSON.parse(userData));
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Set isLoading ke false setelah pengecekan selesai
    };

    checkAuth();
  }, []);

  // Fungsi untuk login
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.data.status) {
        localStorage.setItem(
          "access_token",
          response.data.data.session.access_token
        );
        localStorage.setItem(
          "refresh_token",
          response.data.data.session.refresh_token
        );
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        setIsAuthenticated(true);
        setUser(response.data.data.user);
        navigate("/admin"); // Navigasi setelah login berhasil
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login"); // Navigasi setelah logout
  };

  // Fungsi untuk memperbarui access token menggunakan refresh token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/refresh-token", {
        refresh_token: refreshToken,
      });

      if (response.data.status) {
        localStorage.setItem("access_token", response.data.data.access_token);
        localStorage.setItem("refresh_token", response.data.data.refresh_token);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Refresh token failed:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        refreshAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
