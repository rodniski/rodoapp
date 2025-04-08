import {useMutation, useQuery} from "@tanstack/react-query";
import {useAtom} from "jotai";
import {tokenAtom, usernameAtom} from "%/atoms";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {config} from "config";

interface LoginCredentials {
    username: string;
    password: string;
}

async function loginUser({username, password}: LoginCredentials) {
    const myHeaders = new Headers();
    myHeaders.append("grant_type", "password");
    myHeaders.append("username", username);
    myHeaders.append("password", password);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
        `${config.API_PRODUCTION_URL}api/oauth2/v1/token`,
        requestOptions
    );
    if (!response.ok) {
        throw new Error("Login failed");
    }
    const data = await response.json();
    return {username, token: data.access_token};
}

async function checkAuth(token: string) {
    // Implemente a lógica para verificar o token com seu backend
    const response = await fetch("/api/check-auth", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Token inválido");
    }
    return true;
}

export function useAuth() {
    const [username, setUsername] = useAtom(usernameAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            try {
                // O Jotai já vai salvar no localStorage automaticamente
                setUsername(data.username);
                setToken(data.token);

                // Mantemos o cookie também por redundância
                document.cookie = `token=${data.token}; path=/; max-age=86400`;

                // Função para verificar storage
                const checkStorage = () => {
                    const cookieToken = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('token='))
                        ?.split('=')[1];

                    // Verificando tanto Jotai/localStorage quanto cookie
                    const jotaiToken = token; // atom atual
                    const localToken = localStorage.getItem('token'); // direto do storage

                    console.log('Estado atual:', {
                        cookieToken: !!cookieToken,
                        jotaiToken: !!jotaiToken,
                        localToken: !!localToken
                    });

                    return cookieToken && localToken && jotaiToken;
                };

                const storageCheck = checkStorage();
                if (!storageCheck) {
                    toast.error("Aviso: Dados não foram salvos corretamente");
                }

                toast.success("Login realizado com sucesso!");
                router.push("/central");
            } catch (error) {
                console.error('Erro no login:', error);
                toast.error("Erro ao processar login");
            }
        },
        onError: (error) => {
            console.error('Erro na mutation:', error);
            toast.error("Falha no login. Por favor, tente novamente.");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            // O Jotai já vai limpar do localStorage
            setUsername(null);
            setToken(null);

            // Limpamos o cookie também
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        },
        onSuccess: () => {
            toast.success("Logout realizado com sucesso!");
            router.push("/");
        },
    });

    const {data: isAuthenticated, isLoading: isCheckingAuth} = useQuery({
        queryKey: ["auth", token],
        queryFn: () => checkAuth(token || ""),
        enabled: !!token,
    });

    return {
        loginMutation,
        logoutMutation,
        isAuthenticated,
        isCheckingAuth,
        username,
    };
}
