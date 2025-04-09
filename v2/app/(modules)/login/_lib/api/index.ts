import axios from 'axios';
import { AuthResponse, AuthError, GrupoFilial } from '../types';

const AUTH_API_URL = 'http://172.16.99.174:8400/rest/api/oauth2/v1/token';
const GRUPO_FILIAL_API_URL = 'http://172.16.0.251:9010/rest/MovPortaria/GrupoFilial';

export async function authenticateUser(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post(AUTH_API_URL, null, {
      headers: {
        'grant_type': 'password',
        'username': username,
        'password': password
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AuthError;
    }
    throw error;
  }
}

export async function getUserGrupoFilial(username: string, accessToken: string): Promise<GrupoFilial[]> {
  try {
    const response = await axios.get(`${GRUPO_FILIAL_API_URL}?Usuario=${username}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar grupos e filiais:', error);
    throw error;
  }
} 