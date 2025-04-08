"use server";
import {createClient} from 'redis';

// Seu IP Redis sem senha
const redisUrl = 'redis://172.16.99.182:6379';

let redisClient: ReturnType<typeof createClient> | null = null;

// Singleton para obter o cliente Redis
// Garante que só será usado no servidor
export const getRedisClient = async () => {
    console.log('Tentando obter cliente Redis...'); // Log para debug
    if (typeof window !== 'undefined') {
        throw new Error('Cliente Redis não pode ser acessado no lado do cliente!');
    }

    if (!redisClient) {
        console.log(`Criando novo cliente Redis para ${redisUrl}`);
        redisClient = createClient({
            url: redisUrl,
        });

        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        redisClient.on('connect', () => console.log('Redis: Conectando...'));
        redisClient.on('ready', () => console.log('Redis: Cliente pronto!'));
        redisClient.on('reconnecting', () => console.log('Redis: Reconectando...'));
        redisClient.on('end', () => console.log('Redis: Conexão finalizada.'));

        try {
            // Conecta apenas se não estiver conectado
            if (!redisClient.isOpen) {
                console.log('Conectando ao Redis...');
                await redisClient.connect();
                console.log('Conectado ao Redis com sucesso!');
            }
        } catch (err) {
            console.error('Falha ao conectar ao Redis:', err);
            redisClient = null; // Reseta para tentar de novo
            throw err;
        }
    }

    // Garante que está conectado antes de retornar
    if (!redisClient.isOpen) {
        console.warn('Cliente Redis não estava aberto, tentando (re)conectar...');
        try {
            await redisClient.connect();
            console.log('(Re)conectado ao Redis.');
        } catch (err) {
            console.error('Falha ao (re)conectar ao Redis:', err);
            redisClient = null;
            throw err;
        }
    }

    console.log('Retornando cliente Redis.');
    return redisClient;
};

// Opcional: Função para desconectar (menos usada em serverless)
export const disconnectRedis = async () => {
    if (redisClient && redisClient.isOpen) {
        await redisClient.quit();
        redisClient = null;
        console.log('Desconectado do Redis.');
    }
};