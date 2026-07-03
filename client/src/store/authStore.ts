import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { saveToken, removeToken } from "../utils/token.utils";
import type { AuthState, User } from "../types/auth.types";

const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user: User, token: string) => {
        saveToken(token);
        set(
          {
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          },
          false,
          "setAuth"
        );
      },

      setUser: (user: User) => {
        set({ user }, false, "setUser");
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading");
      },

      logout: () => {
        removeToken();
        set(
          {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          },
          false,
          "logout"
        );
      },
    }),
    { name: "TrackVault Auth Store" }
  )
);

export default useAuthStore;
