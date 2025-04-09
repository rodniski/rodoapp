"use client";

export default function DocumentacaoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute -right-36 -top-36 h-[500px] w-[500px] dark:bg-emerald-500/20 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-36 -left-36 h-[500px] w-[500px] dark:bg-lime-500/20 bg-lime-500/10 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 text-2xl font-bold flex items-center justify-center">
        Documentação de Processos
      </div>
    </div>
  );
}
