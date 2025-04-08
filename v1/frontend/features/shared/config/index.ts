interface Config {
    API_RUST_URL: string;
    API_BORRACHARIA_URL: string;
    API_DEVELOPMENT_URL: string;
    API_PRODUCTION_URL: string;
    CONEXAO_NFE_BASE_URL: string;
    CONEXAO_NFE_TOKEN: string;
}

export const config: Config = {
    API_RUST_URL: "http://172.16.99.182:8080",
    API_BORRACHARIA_URL: "http://172.16.0.245:9011/rest/",
    API_DEVELOPMENT_URL: "http://172.16.0.245:8410/rest/",
    API_PRODUCTION_URL: "http://172.16.99.174:8400/rest/",
    CONEXAO_NFE_BASE_URL: "https://api.conexaonfe.com.br/v1",
    CONEXAO_NFE_TOKEN:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb25leGFvbmZlLmNvbS5iciIsIm5hbWUiOiJtYXRldXMiLCJpZCI6NTYwNTF9.SDMelkA6zQz0BFtLb-bCH4y6t2pTxWyuI5Lr2Bu_YUo",
} as const;
