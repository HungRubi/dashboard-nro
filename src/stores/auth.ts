import { create } from "zustand";
import { api, TOKEN_KEY, type LoginResponse, type MeAccount } from "@/lib/api";

export const NOT_ADMIN = "NOT_ADMIN";

export function isFullAdmin(u: MeAccount | null | undefined): boolean {
  return !!u && (u.is_admin === 1 || u.admin === 1) && u.ban !== 1;
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function clearStored() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

interface AuthState {
  token: string | null;
  user: MeAccount | null;
  login: (username: string, password: string) => Promise<void>;
  fetchMe: () => Promise<MeAccount>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()((set) => ({
  token: readStoredToken(),
  user: null,
  login: async (username, password) => {
    const { data } = await api.post<LoginResponse>("/auth/login", { username, password });
    if (!data.isAdmin) {
      const err = new Error(NOT_ADMIN);
      err.name = NOT_ADMIN;
      throw err;
    }
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
    } catch {
      /* ignore */
    }
    set({ token: data.token });
    const { data: me } = await api.get<MeAccount>("/auth/me");
    if (!isFullAdmin(me)) {
      clearStored();
      set({ token: null, user: null });
      const err = new Error(NOT_ADMIN);
      err.name = NOT_ADMIN;
      throw err;
    }
    set({ user: me });
  },
  fetchMe: async () => {
    const { data: me } = await api.get<MeAccount>("/auth/me");
    set({ user: me });
    return me;
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // best-effort: vẫn xóa session local
    }
    clearStored();
    set({ token: null, user: null });
  },
}));
