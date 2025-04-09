"use client";
import { Background } from 'comp';
import dynamic from 'next/dynamic'; // Importa a função dynamic
const LoginForm = dynamic(() => import('./_lib/components').then(mod => mod.LoginForm), { ssr: false });

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Background />

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
