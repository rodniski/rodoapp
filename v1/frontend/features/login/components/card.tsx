"use client";

import React, {useState} from "react";
import {useAuth} from "%/hooks";
import {Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label} from "ui";

const LoginCard = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {loginMutation} = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Chama o login
        loginMutation.mutate({username, password});
    };

    return (
        <>
            <Card className="max-w-md bg-card/10 border border-muted shadow-xl dark:shadow-muted backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                        Bem-vindo ao RodoApp 2.0
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Acesse utilizando seu login do Protheus e veja as novidades do novo
                        sistema Rodoparaná!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuário do Protheus</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="nome.sobrenome"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                aria-label="Usuário do Protheus"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-label="Senha"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full shadow-lg shadow-sky-200 dark:shadow-sky-900"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
};

export default LoginCard;
