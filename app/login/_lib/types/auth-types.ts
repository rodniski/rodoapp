//* "@login/types/auth-types.ts" *\\

/**
 * Resposta da API de autenticação
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
  hasMFA: boolean;
}

/**
 * Erro retornado pela API de autenticação
 */
export interface AuthError {
  code: number;
  message: string;
  detailedMessage: string;
}

/**
 * Representa uma filial retornada em GrupoFilial
 */
export interface FilialGrupo {
  Loja: string;
}

/**
 * Grupo de acesso e suas filiais associadas
 */
export interface GrupoFilial {
  Grupo: string;
  Filial: FilialGrupo[];
}
export interface FilialAcesso {
  M0_CODFIL: string;
  M0_FILIAL: string;
  M0_CGC: string;
}
/**
 * Sessão do usuário armazenada na store
 */
export interface UserSession {
  username: string;
  grupos: GrupoFilial[];
  filiais: FilialAcesso[];
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  /** Sessão do usuário */
  user: UserSession | null;

  /** Filiais de acesso do usuário */
  filiais: FilialAcesso[];

  /** Grupos de acesso do usuário */
  grupos: GrupoFilial[];

  isAuthenticated: boolean;
  isLoading: boolean;

  /** Seta toda a sessão (user + tokens + expiresAt) */
  setUser: (user: UserSession | null) => void;

  /** Seta as filiais de acesso */
  setFiliais: (filiais: FilialAcesso[]) => void;

  /** Seta os grupos de acesso */
  setGrupos: (grupos: GrupoFilial[]) => void;

  /** Limpa sessão, filiais e grupos */
  logout: () => Promise<void>;
}
