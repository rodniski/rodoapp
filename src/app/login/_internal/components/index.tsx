/* ───────────────────────────  LoginForm.tsx  ───────────────────────────
 * Formulário de login para o RodoApp.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Permite autenticação com usuário (nome.sobrenome) e
 *  ├────────────┤  senha, com validação Zod e feedback via toast (Promise-based).
 *  │  FUNCIONAL │  Usa react-hook-form, sonner, e custom hook useAuth.
 *  └────────────┘
 *  Integra com Protheus e suporta "Lembrar-me" para persistência.
 * -----------------------------------------------------------------------*/

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
  PasswordInput,
} from "ui";
import { useAuth } from "@login/hooks";
import {Logo} from "ui";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "O usuário é obrigatório")
    .regex(/^[a-z]+\.[a-z]+$/i, "Formato deve ser nome.sobrenome"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", rememberMe: false },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    form.clearErrors("root");

    // Wrap the login call in a Promise for toast.promise
    const loginPromise = new Promise<boolean>((resolve, reject) => {
      login(data.username, data.password)
        .then((ok) => {
          if (ok) {
            resolve(true);
          } else {
            reject(new Error("Usuário ou senha inválidos."));
          }
        })
        .catch((error) => reject(error));
    });

    toast.promise(loginPromise, {
      loading: "Entrando...",
      success: "Login bem-sucedido! Redirecionando…",
      error: (error: Error) => {
        form.setError("root", { message: error.message });
        return error.message;
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="p-8 shadow-lg backdrop-blur bg-muted/20">
        <CardHeader className="flex justify-center items-center gap-5 text-center mb-6 border-b pb-4 text-lg 2xl:text-2xl">
          <Logo className="size-14" color="var(--primary)" />
          <div>
            <CardTitle>Bem-vindo ao RodoApp</CardTitle>
            <CardDescription>
              Use seu acesso do Protheus para entrar
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nome.sobrenome"
                        disabled={isSubmitting || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        disabled={isSubmitting || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        disabled={isSubmitting || isLoading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Lembrar-me</FormLabel>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-red-500 text-center text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full flex justify-center items-center"
                disabled={isSubmitting || isLoading}
              >
                <LogIn className="mr-2" />
                {isSubmitting || isLoading ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
