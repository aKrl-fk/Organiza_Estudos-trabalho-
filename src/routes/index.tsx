import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Organiza Estudos — planeje e acompanhe seus estudos" },
      {
        name: "description",
        content:
          "Organize matérias, monte seu cronograma semanal e acompanhe as horas estudadas para concursos e vestibulares.",
      },
      { property: "og:title", content: "Organiza Estudos" },
      {
        property: "og:description",
        content: "Cronograma semanal, registro de sessões e gráficos de progresso em um só lugar.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    navigate({ to: session ? "/dashboard" : "/auth", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4">
      <Sparkles className="h-6 w-6 animate-pulse text-primary" strokeWidth={1.5} />
      <h1 className="text-lg font-semibold tracking-tight">Organiza Estudos</h1>
      <p className="text-sm text-muted-foreground">Preparando seu céu de estudos…</p>
    </div>
  );
}
