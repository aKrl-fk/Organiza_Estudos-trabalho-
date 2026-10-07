import { createFileRoute } from "@tanstack/react-router";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatarDuracao, inicioDaSemana, isoData, useMaterias, useSessoes } from "@/lib/estudos";

export const Route = createFileRoute("/_authenticated/progresso")({
  head: () => ({
    meta: [
      { title: "Progresso — Organiza Estudos" },
      {
        name: "description",
        content: "Gráficos de horas por matéria e evolução das horas estudadas por semana.",
      },
      { property: "og:title", content: "Progresso — Organiza Estudos" },
      { property: "og:description", content: "Acompanhe sua evolução de estudos por semana." },
    ],
  }),
  component: ProgressoPage,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-popover-foreground)",
};

function ProgressoPage() {
  const { data: materias = [] } = useMaterias();
  const { data: sessoes = [] } = useSessoes();

  const porMateria = materias
    .map((m) => {
      const minutos = sessoes
        .filter((s) => s.materia_id === m.id)
        .reduce((a, s) => a + s.duracao_minutos, 0);
      return { nome: m.nome, cor: m.cor, minutos, horas: +(minutos / 60).toFixed(2) };
    })
    .sort((a, b) => b.minutos - a.minutos);

  const comEstudo = porMateria.filter((m) => m.minutos > 0);
  const mais = comEstudo[0];
  const menos = comEstudo[comEstudo.length - 1];

  const semanas = Array.from({ length: 8 }, (_, i) => {
    const ref = new Date();
    ref.setDate(ref.getDate() - (7 - i) * 7);
    const inicio = inicioDaSemana(ref);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    const minutos = sessoes
      .filter((s) => s.data >= isoData(inicio) && s.data <= isoData(fim))
      .reduce((a, s) => a + s.duracao_minutos, 0);
    return {
      semana: `${String(inicio.getDate()).padStart(2, "0")}/${String(inicio.getMonth() + 1).padStart(2, "0")}`,
      horas: +(minutos / 60).toFixed(2),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progresso</h1>
        <p className="text-sm text-muted-foreground">Como suas horas se distribuem e evoluem.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-soft p-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} />
            Matéria mais estudada
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">{mais?.nome ?? "—"}</p>
          <p className="text-sm text-muted-foreground">
            {mais ? formatarDuracao(mais.minutos) : "Sem sessões registradas"}
          </p>
        </div>
        <div className="card-soft p-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingDown className="h-4 w-4 text-lavender" strokeWidth={1.5} />
            Matéria menos estudada
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">
            {comEstudo.length > 1 ? menos?.nome : "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {comEstudo.length > 1 ? formatarDuracao(menos!.minutos) : "Registre mais sessões"}
          </p>
        </div>
      </div>

      <section className="card-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Horas por matéria
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={porMateria} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="nome"
                width={120}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [`${v} h`, "Estudo"]}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="horas" radius={[0, 6, 6, 0]}>
                {porMateria.map((m) => (
                  <Cell key={m.nome} fill={m.cor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Evolução nas últimas 8 semanas
        </h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={semanas}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="semana"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [`${v} h`, "Semana"]}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="horas"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-chart-1)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
