import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — Organiza Estudos" },
      {
        name: "description",
        content: "Acesse sua conta do Organiza Estudos para planejar e acompanhar seus estudos.",
      },
      { property: "og:title", content: "Entrar — Organiza Estudos" },
      { property: "og:description", content: "Login e cadastro do Organiza Estudos." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setAguardandoConfirmacao(true);
          toast.success("Confira seu e-mail para confirmar o cadastro.");
          return;
        }
        if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, nome: nome || email, email });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-tight">Organiza Estudos</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.5} />
            )}
          </Button>
        </div>

        <div className="card-soft p-6">
          <h1 className="text-xl font-semibold tracking-tight">
            {modo === "entrar" ? "Entrar na sua conta" : "Criar conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seu planejamento de estudos, organizado e sempre à mão.
          </p>

          {aguardandoConfirmacao ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Enviamos um link de confirmação para <strong>{email}</strong>. Depois de confirmar,
              volte aqui e faça login.
            </p>
          ) : (
            <form onSubmit={enviar} className="mt-6 space-y-4">
              {modo === "cadastrar" && (
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como devemos te chamar"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete={modo === "entrar" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={enviando}>
                {modo === "entrar" ? "Entrar" : "Criar conta"}
              </Button>
            </form>
          )}

          <button
            type="button"
            className="mt-5 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              setAguardandoConfirmacao(false);
              setModo(modo === "entrar" ? "cadastrar" : "entrar");
            }}
          >
            {modo === "entrar" ? "Não tenho conta — cadastrar" : "Já tenho conta — entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
