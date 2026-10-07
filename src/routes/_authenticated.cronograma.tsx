import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DIAS,
  formatarHora,
  useCronograma,
  useMaterias,
  useRemoverCronograma,
  useSalvarCronograma,
  type CronogramaItem,
} from "@/lib/estudos";

export const Route = createFileRoute("/_authenticated/cronograma")({
  head: () => ({
    meta: [
      { title: "Cronograma semanal — Organiza Estudos" },
      {
        name: "description",
        content: "Monte seu cronograma semanal de estudos com blocos por matéria, dia e horário.",
      },
      { property: "og:title", content: "Cronograma semanal — Organiza Estudos" },
      { property: "og:description", content: "Blocos de estudo organizados por dia da semana." },
    ],
  }),
  component: CronogramaPage,
});

type Form = {
  id?: string;
  materia_id: string;
  dia_semana: number;
  horario_inicio: string;
  horario_fim: string;
};

const VAZIO: Form = {
  materia_id: "",
  dia_semana: 1,
  horario_inicio: "19:00",
  horario_fim: "20:30",
};

function CronogramaPage() {
  const { data: materias = [] } = useMaterias();
  const { data: itens = [] } = useCronograma();
  const salvar = useSalvarCronograma();
  const remover = useRemoverCronograma();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(VAZIO);

  function abrirNovo(dia: number) {
    setForm({ ...VAZIO, dia_semana: dia, materia_id: materias[0]?.id ?? "" });
    setOpen(true);
  }

  function abrirEdicao(item: CronogramaItem) {
    setForm({
      id: item.id,
      materia_id: item.materia_id,
      dia_semana: item.dia_semana,
      horario_inicio: formatarHora(item.horario_inicio),
      horario_fim: formatarHora(item.horario_fim),
    });
    setOpen(true);
  }

  async function submeter() {
    if (!form.materia_id) {
      toast.error("Escolha uma matéria.");
      return;
    }
    if (form.horario_fim <= form.horario_inicio) {
      toast.error("O horário final deve ser depois do inicial.");
      return;
    }
    try {
      await salvar.mutateAsync(form);
      toast.success(form.id ? "Bloco atualizado." : "Bloco adicionado.");
      setOpen(false);
    } catch {
      toast.error("Não foi possível salvar o bloco.");
    }
  }

  const materia = (id: string) => materias.find((m) => m.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cronograma semanal</h1>
          <p className="text-sm text-muted-foreground">
            Adicione blocos de estudo por dia e horário.
          </p>
        </div>
        <Button onClick={() => abrirNovo(new Date().getDay())} disabled={materias.length === 0}>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Novo bloco
        </Button>
      </div>

      {materias.length === 0 && (
        <div className="card-soft p-6 text-sm text-muted-foreground">
          Cadastre uma matéria antes de montar o cronograma.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DIAS.map((nome, dia) => {
          const blocos = itens.filter((i) => i.dia_semana === dia);
          return (
            <section key={nome} className="card-soft flex flex-col p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {nome}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Adicionar bloco em ${nome}`}
                  onClick={() => abrirNovo(dia)}
                  disabled={materias.length === 0}
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                {blocos.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sem blocos.</p>
                ) : (
                  blocos.map((b) => (
                    <div key={b.id} className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: materia(b.materia_id)?.cor ?? "#8B9DC3" }}
                        />
                        <span className="truncate text-sm font-medium">
                          {materia(b.materia_id)?.nome ?? "Matéria"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatarHora(b.horario_inicio)} – {formatarHora(b.horario_fim)}
                        </span>
                        <span className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Editar bloco"
                            onClick={() => abrirEdicao(b)}
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remover bloco"
                            onClick={async () => {
                              await remover.mutateAsync(b.id);
                              toast.success("Bloco removido.");
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar bloco" : "Novo bloco de estudo"}</DialogTitle>
            <DialogDescription>Matéria, dia da semana e horário.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Matéria</Label>
              <Select
                value={form.materia_id}
                onValueChange={(v) => setForm((f) => ({ ...f, materia_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dia da semana</Label>
              <Select
                value={String(form.dia_semana)}
                onValueChange={(v) => setForm((f) => ({ ...f, dia_semana: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIAS.map((nome, i) => (
                    <SelectItem key={nome} value={String(i)}>
                      {nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="inicio">Início</Label>
                <Input
                  id="inicio"
                  type="time"
                  value={form.horario_inicio}
                  onChange={(e) => setForm((f) => ({ ...f, horario_inicio: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fim">Fim</Label>
                <Input
                  id="fim"
                  type="time"
                  value={form.horario_fim}
                  onChange={(e) => setForm((f) => ({ ...f, horario_fim: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submeter} disabled={salvar.isPending}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
