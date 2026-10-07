import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RegistrarSessaoDialog } from "@/components/RegistrarSessaoDialog";
import { formatarDuracao, useMaterias, useRemoverSessao, useSessoes } from "@/lib/estudos";

export const Route = createFileRoute("/_authenticated/materias/$id")({
  head: () => ({
    meta: [
      { title: "Histórico da matéria — Organiza Estudos" },
      {
        name: "description",
        content: "Veja todas as sessões de estudo registradas para esta matéria.",
      },
      { property: "og:title", content: "Histórico da matéria — Organiza Estudos" },
      { property: "og:description", content: "Sessões de estudo registradas por matéria." },
    ],
  }),
  component: MateriaDetalhe,
});

function MateriaDetalhe() {
  const { id } = Route.useParams();
  const { data: materias = [] } = useMaterias();
  const { data: sessoes = [] } = useSessoes(id);
  const remover = useRemoverSessao();

  const materia = materias.find((m) => m.id === id);
  const total = sessoes.reduce((a, s) => a + s.duracao_minutos, 0);

  return (
    <div className="space-y-6">
      <Link
        to="/materias"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Matérias
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: materia?.cor ?? "#8B9DC3" }}
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{materia?.nome ?? "Matéria"}</h1>
            <p className="text-sm text-muted-foreground">
              {formatarDuracao(total)} em {sessoes.length}{" "}
              {sessoes.length === 1 ? "sessão" : "sessões"}
            </p>
          </div>
        </div>
        <RegistrarSessaoDialog
          materiaId={id}
          trigger={
            <Button>
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Registrar sessão
            </Button>
          }
        />
      </div>

      <section className="card-soft divide-y divide-border">
        {sessoes.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma sessão registrada nesta matéria ainda.
          </p>
        ) : (
          sessoes.map((s) => (
            <div key={s.id} className="flex items-start gap-3 p-4">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {new Date(`${s.data}T00:00:00`).toLocaleDateString("pt-BR")} ·{" "}
                  {formatarDuracao(s.duracao_minutos)}
                </p>
                {s.observacao && (
                  <p className="mt-1 text-sm text-muted-foreground">{s.observacao}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remover sessão"
                onClick={async () => {
                  await remover.mutateAsync(s.id);
                  toast.success("Sessão removida.");
                }}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
