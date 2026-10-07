import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ConstelacaoMaterias } from "@/components/ConstelacaoMaterias";
import { RegistrarSessaoDialog } from "@/components/RegistrarSessaoDialog";
import {
  DIAS,
  formatarDuracao,
  formatarHora,
  inicioDaSemana,
  isoData,
  useCronograma,
  useMaterias,
  useSessoes,
} from "@/lib/estudos";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Organiza Estudos" },
      {
        name: "description",
        content: "Resumo do dia, horas estudadas na semana e registro rápido de sessões.",
      },
      { property: "og:title", content: "Dashboard — Organiza Estudos" },
      { property: "og:description", content: "Seu resumo diário de estudos." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: materias = [] } = useMaterias();
  const { data: cronograma = [] } = useCronograma();
  const { data: sessoes = [] } = useSessoes();

  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const blocosHoje = cronograma.filter((c) => c.dia_semana === diaSemana);

  const inicio = inicioDaSemana(hoje);
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return d;
  });
  const porDia = dias.map((d) => {
    const iso = isoData(d);
    const minutos = sessoes
      .filter((s) => s.data === iso)
      .reduce((acc, s) => acc + s.duracao_minutos, 0);
    return { dia: DIAS[d.getDay()]!.slice(0, 3), horas: +(minutos / 60).toFixed(2), minutos };
  });
  const totalSemana = porDia.reduce((acc, d) => acc + d.minutos, 0);

  const nomeMateria = (id: string) => materias.find((m) => m.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Seu dia de estudos</h1>
          <p className="text-sm text-muted-foreground">
            {DIAS[diaSemana]}, {hoje.toLocaleDateString("pt-BR")}
          </p>
        </div>
        <RegistrarSessaoDialog
          trigger={
            <Button size="lg">
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Registrar sessão agora
            </Button>
          }
        />
      </div>

      <ConstelacaoMaterias materias={materias} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarDays className="h-4 w-4" strokeWidth={1.5} />
            Planejado para hoje
          </h2>
          {blocosHoje.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nada no cronograma para hoje.{" "}
              <Link to="/cronograma" className="text-primary underline-offset-4 hover:underline">
                Montar cronograma
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {blocosHoje.map((b) => {
                const m = nomeMateria(b.materia_id);
                return (
                  <li
                    key={b.id}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: m?.cor ?? "#8B9DC3" }}
                    />
                    <span className="text-sm font-medium">{m?.nome ?? "Matéria"}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {formatarHora(b.horario_inicio)} – {formatarHora(b.horario_fim)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card-soft p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock className="h-4 w-4" strokeWidth={1.5} />
            Horas na semana
          </h2>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {formatarDuracao(totalSemana)}
          </p>
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porDia}>
                <XAxis
                  dataKey="dia"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  formatter={(v: number) => [`${v} h`, "Estudo"]}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar dataKey="horas" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
