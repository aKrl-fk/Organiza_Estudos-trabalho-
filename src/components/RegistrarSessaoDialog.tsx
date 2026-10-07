import { useState, type ReactNode } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isoHoje, useCriarSessao, useMaterias } from "@/lib/estudos";

const ATALHOS = [25, 45, 60, 90];

export function RegistrarSessaoDialog({
  trigger,
  materiaId,
}: {
  trigger: ReactNode;
  materiaId?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: materias = [] } = useMaterias();
  const criar = useCriarSessao();

  const [materia, setMateria] = useState(materiaId ?? "");
  const [data, setData] = useState(isoHoje());
  const [minutos, setMinutos] = useState("60");
  const [observacao, setObservacao] = useState("");

  const materiaSelecionada = materiaId ?? materia;

  async function salvar() {
    if (!materiaSelecionada) {
      toast.error("Escolha uma matéria.");
      return;
    }
    const duracao = Number(minutos);
    if (!Number.isFinite(duracao) || duracao <= 0) {
      toast.error("Informe a duração em minutos.");
      return;
    }
    try {
      await criar.mutateAsync({
        materia_id: materiaSelecionada,
        data,
        duracao_minutos: Math.round(duracao),
        observacao: observacao.trim() || null,
      });
      toast.success("Sessão registrada.");
      setOpen(false);
      setObservacao("");
    } catch {
      toast.error("Não foi possível registrar a sessão.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar sessão de estudo</DialogTitle>
          <DialogDescription>Poucos cliques: matéria, tempo e pronto.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!materiaId && (
            <div className="space-y-2">
              <Label>Matéria</Label>
              <Select value={materia} onValueChange={setMateria}>
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
          )}

          <div className="space-y-2">
            <Label>Duração (minutos)</Label>
            <div className="flex flex-wrap gap-2">
              {ATALHOS.map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={minutos === String(v) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinutos(String(v))}
                >
                  {v} min
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={1}
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-sessao">Data</Label>
            <Input
              id="data-sessao"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs-sessao">Observação (opcional)</Label>
            <Textarea
              id="obs-sessao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="O que você estudou?"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={salvar} disabled={criar.isPending}>
            Salvar sessão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
