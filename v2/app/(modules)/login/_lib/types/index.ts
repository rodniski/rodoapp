export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
  hasMFA: boolean;
}

export interface AuthError {
  code: number;
  message: string;
  detailedMessage: string;
}

export interface Filial {
  Loja: string;
}

export interface GrupoFilial {
  Grupo: string;
  Filial: Filial[];
}

export interface UserSession {
  username: string;
  accessToken: string;
  refreshToken: string;
  grupos: GrupoFilial[];
  expiresAt: number;
} 