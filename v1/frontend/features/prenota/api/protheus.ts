// #/api/protheus.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

interface ProtheusServiceConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}

class ProtheusService {
    private api: AxiosInstance;

    constructor(config: ProtheusServiceConfig) {
        this.api = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 10000,
            headers: {
                "Content-Type": "application/json",
                ...(config.headers || {}),
            },
        });

        this.api.interceptors.request.use(
            (config) => {
                console.log("Request Interceptor:", config);
                return config;
            },
            (error) => {
                console.error("Request Interceptor Error:", error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                console.log("Response Interceptor:", response);
                return response;
            },
            (error: AxiosError) => {
                console.error("Response Interceptor Error:", error.response || error);

                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data;

                    // Usando 'as any' como um workaround *TEMPORÁRIO*.
                    const typedData = data as any;

                    const errorMessage =
                        (typedData && (typedData.message || typedData.error)) ||
                        `Erro ${status} desconhecido`;
                    throw new Error(`Erro ${status}: ${errorMessage}`);
                } else if (error.request) {
                    throw new Error("Sem resposta do servidor.");
                } else {
                    throw new Error("Erro ao configurar a requisição.");
                }
            }
        );
    }

    async get<T>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response = await this.api.get<T>(endpoint, config);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Um erro desconhecido ocorreu no metodo get.");
        }
    }

}

const protheusServiceConfig: ProtheusServiceConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_PRODUCTION_URL || "http://localhost:3000",
    timeout: 15000,
};

export const protheusService = new ProtheusService(protheusServiceConfig);