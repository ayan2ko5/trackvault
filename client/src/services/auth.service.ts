import api from "./api";

import type {
  AuthApiResponse,
  ProfileApiResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

// --------------------
// Login
// --------------------
export const login = async (
  data: LoginRequest
): Promise<AuthApiResponse> => {
  const response = await api.post<AuthApiResponse>("/auth/login", data);
  return response.data;
};

// --------------------
// Register
// --------------------
export const register = async (
  data: RegisterRequest
): Promise<AuthApiResponse> => {
  const response = await api.post<AuthApiResponse>("/auth/register", data);
  return response.data;
};

// --------------------
// Get Logged-in User
// --------------------
export const getMe = async (): Promise<ProfileApiResponse> => {
  const response = await api.get<ProfileApiResponse>("/auth/me");
  return response.data;
};

// --------------------
// Update Profile
// --------------------
export const updateProfile = async (data: {
  name?: string;
  phone?: string | null;
  currency?: string;
}): Promise<ProfileApiResponse> => {
  const response = await api.put<ProfileApiResponse>(
    "/auth/profile",
    data
  );

  return response.data;
};

const authService = {
  login,
  register,
  getMe,
  updateProfile,
};

export default authService;