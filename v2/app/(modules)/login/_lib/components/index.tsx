"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
} from "ui";

// Schema de validação com Zod
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "O usuário é obrigatório")
    .regex(/^[a-z]+\.[a-z]+$/i, "O formato deve ser nome.sobrenome"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        form.setError("root", {
          message: "Falha na autenticação. Verifique suas credenciais.",
        });
        toast.error("Credenciais inválidas", {
          description: "Verifique seu usuário e senha e tente novamente.",
        });
      } else {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando para o dashboard...",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      if (error) {
        form.setError("root", {
          message: "Ocorreu um erro durante a autenticação.",
        });
        toast.error("Erro na autenticação", {
          description: "Algo deu errado. Tente novamente mais tarde.",
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      <Card className="shadow-lg w-md border-primary bg-background">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-foreground">
            Bem-vindo ao RodoApp
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Faça login para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        className="text-green-600"
                        placeholder="nome.sobrenome"
                        autoComplete="username"
                        disabled={isSubmitting}
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
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        className="text-green-600"
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
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-muted-foreground">
                      Lembrar-me
                    </FormLabel>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-sm text-red-500 text-center">
                  {form.formState.errors.root.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
