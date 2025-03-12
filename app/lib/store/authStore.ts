import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import axios from "axios";

interface User {
  id : string | null;
  full_name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
  token: string | null;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  setInitialized: (initialized: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      id : null,
      isLoggedIn: false,
      isInitialized: false,
      user: null,
      token: null,
      error: null,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post(
            `http://localhost:3000/api/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("data user login : ", response.data.data)

          const token = response.data.data.token;

          // Store token in both cookie and localStorage for redundancy
          Cookies.set("auth_token", token, {
            expires: 1 / 24, // 1 hour
            secure: true,
            sameSite: "strict",
          });

          // Store in localStorage with expiration
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_expiry", String(Date.now() + 3600000)); // 1 hour from now
          const full_name = response.data.data.user.full_name || ""; // Handle case where name might be null/undefined
          localStorage.setItem(
            "auth_user",
            JSON.stringify({ email, full_name })
          );

          set({
            isLoggedIn: true,
            token,
            user: {
              id : response.data.data.user.id,
              email,
              full_name: response.data.data.user.full_name || "", // Handle case where name might be null/undefined
              avatar: "https://avatar.iran.liara.run/public/boy",
              role: response.data.data.user.role,
            },
            error: null,
          });
        } catch (error) {
          set({ error: "Failed to login. Please check your credentials." });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove("auth_token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_expiry");
        localStorage.removeItem("auth_user");
        

        set({
          isLoggedIn: false,
          token: null,
          user: null,
          error: null,
        });
      },

      checkAuth: () => {
        const token =
          Cookies.get("auth_token") || localStorage.getItem("auth_token");
        const expiry = localStorage.getItem("auth_expiry");

        if (!token || !expiry) {
          return false;
        }

        // Check if token has expired
        if (Date.now() > parseInt(expiry)) {
          get().logout();
          return false;
        }

        return true;
      },

      setInitialized: (initialized: boolean) =>
        set({ isInitialized: initialized }),

      initialize: () => {
        const token =
          Cookies.get("auth_token") || localStorage.getItem("auth_token");
        const expiry = localStorage.getItem("auth_expiry");
        const storedUser = localStorage.getItem("auth_user");

        if (token && expiry && Date.now() < parseInt(expiry) && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({
              isLoggedIn: true,
              token,
              user: {
                id : user.id,
                email: user.email,
                full_name: user.full_name || "", // Handle case where full_name might not exist
                avatar: user.avatar || "https://avatar.iran.liara.run/public",
                role: user.role || "",
              },
              isInitialized: true,
            });
          } catch (error) {
            console.log(error);
            get().logout();
          }
        } else {
          get().logout();
        }

        set({ isInitialized: true });
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
