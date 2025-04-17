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
  PasswordInput,
} from "ui";
import { useCargaInicio } from "hooks";
import { useAuthStore, useCargaInicioStore } from "stores";

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
  const { fetchAndUpdateSession } = useAuthStore();
  const { setFiliais } = useAuthStore();
  const { setCargaInicioData } = useCargaInicioStore();
  const {
    data: cargaInicioData,
    refetch: fetchCargaInicio,
    isLoading: cargaInicioLoading,
  } = useCargaInicio();

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
        return;
      }

      // Atualizar sessão no useAuthStore
      await fetchAndUpdateSession();

      // Buscar dados da API CargaInicio
      const { data: cargaData } = await fetchCargaInicio();

      if (cargaData) {
        // Atualizar filiais na useAuthStore
        setFiliais(cargaData.Filiais);

        // Atualizar outros dados na useCargaInicioStore
        setCargaInicioData({
          unidadeMedida: cargaData.UnidadeMedida,
          condicoes: cargaData.Condicoes,
          centroCusto: cargaData.CentoCusto,
        });
      }

      toast.success("Login realizado com sucesso!", {
        description: "Redirecionando para o dashboard...",
      });
      router.push("/prenota");
    } catch (error) {
      form.setError("root", {
        message: "Ocorreu um erro durante a autenticação.",
      });
      toast.error("Erro na autenticação", {
        description: "Algo deu errado. Tente novamente mais tarde.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-primary bg-muted/20 backdrop-blur-lg p-5 lg:p-10 qhd:p-20 qhd:min-w-4xl qhd:min-h-[800px] flex flex-col justify-center">
        <CardHeader className="text-center space-y-1 qhd:space-y-5 border-b">
          <CardTitle className="text-2xl fhd:text-3xl qhd:text-[50pt] font-bold text-foreground">
            Bem-vindo ao RodoApp
          </CardTitle>
          <CardDescription className="text-base fhd:text-lg qhd:text-3xl text-muted-foreground">
            Utilize seu acesso do Protheus para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base lg:text-lg fhd:text-xl qhd:text-2xl">
                      Usuário:
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        className="text-primary text-sm sm:text-base lg:text-lg fhd:text-xl qhd:text-2xl"
                        placeholder="nome.sobrenome"
                        autoComplete="username"
                        disabled={isSubmitting || cargaInicioLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm lg:text-base fhd:text-lg qhd:text-2xl" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base lg:text-lg fhd:text-xl qhd:text-2xl">
                      Senha:
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isSubmitting || cargaInicioLoading}
                        className="text-primary text-sm sm:text-base lg:text-lg fhd:text-xl qhd:text-2xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm lg:text-base fhd:text-lg qhd:text-xl" />
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
                        disabled={isSubmitting || cargaInicioLoading}
                      />
                    </FormControl>
                    <FormLabel className="text-xs sm:text-sm lg:text-base fhd:text-lg qhd:text-xl text-muted-foreground">
                      Lembrar-me
                    </FormLabel>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-xs sm:text-sm lg:text-base fhd:text-lg qhd:text-xl text-red-500 text-center">
                  {form.formState.errors.root.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full text-base fhd:text-lg qhd:text-xl"
                disabled={isSubmitting || cargaInicioLoading}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fhd:w-7 fhd:h-7 qhd:size-6 mr-2" />
                {isSubmitting || cargaInicioLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
