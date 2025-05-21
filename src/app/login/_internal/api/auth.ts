import { config } from "config";
import type { AuthResponse, AuthError } from "@/app/login/_internal/types";
import axios from "axios";

const AUTH_API_URL = `${config.API_PRODUCTION_URL}api/oauth2/v1/token`;

export async function authenticateUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(AUTH_API_URL, null, {
      headers: {
        grant_type: "password",
        username,
        password,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AuthError;
    }
    throw error;
  }
}
