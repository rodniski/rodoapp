"use client";
import Logo from "@/public/logo/logo";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic"; // Importa a função dynamic
import { Button } from "ui";
import Link from "next/link";
const LoginForm = dynamic(
  () => import("./_lib/components").then((mod) => mod.LoginForm),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen lg:min-h-[calc(100vh)] overflow-hidden flex-col items-center justify-center bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-950">
      <Link href="/">
        <Button
          variant="ghost"
          size="lg"
          className="absolute top-0 left-0 lg:text-lg m-3 lg:m-5 border border-primary text-primary fhd:text-xl qhd:text-4xl"
        >
          <ArrowLeftIcon /> Voltar
        </Button>
      </Link>
      <Logo
        className="size-200 lg:size-250 qhd:size-650 z-0 absolute top-0 lg:-top-60 -right-65 qhd:-top-140 qhd:-right-170 opacity-5"
        color="var(--foreground)"
      />

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
