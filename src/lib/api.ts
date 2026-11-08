import axios from "axios";

export const TOKEN_KEY = "dashboard_token";

const baseURL = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000/api"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface LoginResponse {
  id: number;
  username: string;
  isAdmin: boolean;
  token: string;
}

export interface MeAccount {
  id: number;
  username: string;
  vnd: number;
  tongnap: number;
  coin: number;
  money: number;
  balance: number;
  is_admin: number;
  admin: number;
  ban: number;
  active: number;
}

export interface AdminPlayer {
  id: number;
  account_id: number | null;
  username: string | null;
  name: string;
  gender: number;
  head: number;
  have_tennis_space_ship: number;
  clan_id_sv1: number;
  clan_id_sv2: number;
  create_time: string | null;
  pointPvp: number | null;
  vnd: number | null;
  violate: number | string | null;
}

export interface AdminPlayersResponse {
  page: number;
  pageSize: number;
  total: number;
  items: AdminPlayer[];
}

export interface AdminStats {
  accounts: { total: number; online: number; banned: number };
  players: { total: number };
  posts: { total: number };
  topups: { total: number; vnd: number };
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/admin/stats");
  return data;
}

export async function fetchAdminPlayers(page: number, q: string): Promise<AdminPlayersResponse> {
  const { data } = await api.get<AdminPlayersResponse>("/admin/players", {
    params: { page, q: q || undefined },
  });
  return data;
}

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = (err.response?.data as { error?: string } | undefined)?.error;
    if (msg) return msg;
    if (err.code === "ERR_NETWORK") return "Không kết nối được máy chủ API";
  }
  return "Có lỗi xảy ra, thử lại sau";
}

export type MissingAssetCategory = "items" | "npcs" | "maps";
export interface MissingAssetReference {
  category: MissingAssetCategory;
  entityId: number;
  entityName: string;
  resourceId: number;
  resourceType: "icon" | "map-data" | "tile-set" | "background";
  role: string;
  expectedPath: string;
}
export interface MissingAssetSummary {
  resources: number;
  references: number;
  entities: number;
}
export interface MissingGameAssetsResponse {
  scannedAt: string;
  atlasImageCount: number;
  summary: Record<MissingAssetCategory, MissingAssetSummary>;
  items: MissingAssetReference[];
}
export async function fetchMissingGameAssets(): Promise<MissingGameAssetsResponse> {
  const { data } = await api.get<MissingGameAssetsResponse>("/admin/missing-game-assets");
  return data;
}