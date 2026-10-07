import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CORES,
  formatarDuracao,
  useCriarMateria,
  useMaterias,
  useRemoverMateria,
  useSessoes,
} from "@/lib/estudos";

export const Route = createFileRoute("/_authenticated/materias/")({
  head: () => ({
    meta: [
      { title: "Matérias — Organiza Estudos" },
      {
        name: "description",
        content: "Cadastre suas matérias com cor identificadora e veja as horas acumuladas.",
      },
      { property: "og:title", content: "Matérias — Organiza Estudos" },
      { property: "og:description", content: "Suas matérias e horas acumuladas." },
    ],
  }),
  component: MateriasPage,
});

function MateriasPage() {
  const { data: materias = [] } = useMaterias();
  const { data: sessoes = [] } = useSessoes();
  const criar = useCriarMateria();
  const remover = useRemoverMateria();

  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState(CORES[0]!);

  const minutosPorMateria = (id: string) =>
    sessoes.filter((s) => s.materia_id === id).reduce((a, s) => a + s.duracao_minutos, 0);

  async function salvar() {
    if (!nome.trim()) {
      toast.error("Informe o nome da matéria.");
      return;
    }
    try {
      await criar.mutateAsync({ nome: nome.trim(), cor });
      toast.success("Matéria adicionada.");
      setNome("");
      setOpen(false);
    } catch {
      toast.error("Não foi possível salvar a matéria.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matérias</h1>
          <p className="text-sm text-muted-foreground">
            Cada matéria é uma estrela do seu plano de estudos.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Nova matéria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova matéria</DialogTitle>
              <DialogDescription>Escolha um nome e uma cor identificadora.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-materia">Nome</Label>
                <Input
                  id="nome-materia"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Direito Constitucional"
                />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {CORES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Cor ${c}`}
                      onClick={() => setCor(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        cor === c ? "scale-110 border-primary" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={salvar} disabled={criar.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {materias.length === 0 ? (
        <div className="card-soft p-8 text-center text-sm text-muted-foreground">
          Você ainda não cadastrou matérias. Comece adicionando a primeira.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materias.map((m) => (
            <div
              key={m.id}
              className="card-soft group relative p-5 transition-shadow hover:shadow-lift"
            >
              <Link to="/materias/$id" params={{ id: m.id }} className="block">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
                  style={{ color: m.cor }}
                >
                  <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <h2 className="mt-3 text-base font-semibold tracking-tight">{m.nome}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatarDuracao(minutosPorMateria(m.id))} acumuladas
                </p>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover ${m.nome}`}
                className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={async () => {
                  await remover.mutateAsync(m.id);
                  toast.success("Matéria removida.");
                }}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
