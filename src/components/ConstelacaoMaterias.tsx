import { BookOpen } from "lucide-react";
import type { Materia } from "@/lib/estudos";

/**
 * Faixa decorativa: ícones das matérias conectados por linhas finas pontilhadas
 * (motivo de constelação). Puramente visual, sem lógica associada.
 */
export function ConstelacaoMaterias({ materias }: { materias: Materia[] }) {
  if (materias.length === 0) return null;
  const itens = materias.slice(0, 7);
  const step = 100 / (itens.length + 1);
  const pontos = itens.map((_, i) => ({
    x: step * (i + 1),
    y: i % 2 === 0 ? 34 : 66,
  }));

  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl border border-border bg-card/60 px-2">
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          className="constellation-line"
          points={pontos.map((p) => `${p.x},${p.y}`).join(" ")}
        />
      </svg>
      {itens.map((m, i) => (
        <div
          key={m.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${pontos[i]!.x}%`, top: `${pontos[i]!.y}%` }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background"
            style={{ color: m.cor }}
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <span className="max-w-20 truncate text-[10px] text-muted-foreground">{m.nome}</span>
        </div>
      ))}
    </div>
  );
}
