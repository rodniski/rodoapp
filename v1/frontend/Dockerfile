# 🏗 Stage 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

# Copiar arquivos necessários
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

# Ambiente de Desenvolvimento
ENV NEXT_PUBLIC_API_DEVELOPMENT_URL=http://172.16.0245:8410/rest/
ENV NEXT_PUBLIC_API_BORRACHARIA_URL=http://172.16.0.245:9010/rest/

# Ambiente de Produção
ENV NEXT_PUBLIC_API_PRODUCTION_URL=http://172.16.99.174:8400/rest/

#Backend
NEXT_PUBLIC_BACKEND_URL=http://172.16.99.182:8080
ENV NEXT_PUBLIC_CONEXAO_NFE_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb25leGFvbmZlLmNvbS5iciIsIm5hbWUiOiJtYXRldXMiLCJpZCI6NTYwNTF9.SDMelkA6zQz0BFtLb-bCH4y6t2pTxWyuI5Lr2Bu_YUo

# Build da aplicação Next.js
RUN npm run build

# 🏭 Stage 2: Production Image
FROM node:23-alpine AS runner

WORKDIR /app

# Copiar arquivos do builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Configurar ambiente
ENV NODE_ENV=production

# Criar usuário não root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expor porta
EXPOSE 3000

# Iniciar o Next.js
CMD ["node_modules/.bin/next", "start"]
