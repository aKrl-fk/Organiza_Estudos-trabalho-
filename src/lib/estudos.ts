import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Materia = {
  id: string;
  nome: string;
  cor: string;
  created_at: string;
};

export type Sessao = {
  id: string;
  materia_id: string;
  data: string;
  duracao_minutos: number;
  observacao: string | null;
};

export type CronogramaItem = {
  id: string;
  materia_id: string;
  dia_semana: number;
  horario_inicio: string;
  horario_fim: string;
};

export const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

export const CORES = [
  "#C9A876",
  "#8B9DC3",
  "#B08BC3",
  "#7FA6B8",
  "#C38B8B",
  "#9FB08B",
  "#C3A88B",
  "#8B8BC3",
];

export function formatarDuracao(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatarHora(hora: string) {
  return hora.slice(0, 5);
}

export function isoHoje() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function inicioDaSemana(base = new Date()) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function isoData(d: Date) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function useMaterias() {
  return useQuery({
    queryKey: ["materias"],
    queryFn: async (): Promise<Materia[]> => {
      const { data, error } = await supabase
        .from("materias")
        .select("id, nome, cor, created_at")
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSessoes(materiaId?: string) {
  return useQuery({
    queryKey: ["sessoes", materiaId ?? "todas"],
    queryFn: async (): Promise<Sessao[]> => {
      let q = supabase
        .from("sessoes_estudo")
        .select("id, materia_id, data, duracao_minutos, observacao")
        .order("data", { ascending: false });
      if (materiaId) q = q.eq("materia_id", materiaId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCronograma() {
  return useQuery({
    queryKey: ["cronograma"],
    queryFn: async (): Promise<CronogramaItem[]> => {
      const { data, error } = await supabase
        .from("cronograma_itens")
        .select("id, materia_id, dia_semana, horario_inicio, horario_fim")
        .order("horario_inicio");
      if (error) throw error;
      return data ?? [];
    },
  });
}

function useInvalidate(keys: string[]) {
  const qc = useQueryClient();
  return () => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

export function useCriarMateria() {
  const invalidate = useInvalidate(["materias"]);
  return useMutation({
    mutationFn: async (input: { nome: string; cor: string }) => {
      const { error } = await supabase.from("materias").insert(input);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useRemoverMateria() {
  const invalidate = useInvalidate(["materias", "sessoes", "cronograma"]);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("materias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useCriarSessao() {
  const invalidate = useInvalidate(["sessoes"]);
  return useMutation({
    mutationFn: async (input: {
      materia_id: string;
      data: string;
      duracao_minutos: number;
      observacao?: string | null;
    }) => {
      const { error } = await supabase.from("sessoes_estudo").insert(input);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useRemoverSessao() {
  const invalidate = useInvalidate(["sessoes"]);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sessoes_estudo").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useSalvarCronograma() {
  const invalidate = useInvalidate(["cronograma"]);
  return useMutation({
    mutationFn: async (input: {
      id?: string;
      materia_id: string;
      dia_semana: number;
      horario_inicio: string;
      horario_fim: string;
    }) => {
      const { id, ...values } = input;
      if (id) {
        const { error } = await supabase.from("cronograma_itens").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cronograma_itens").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: invalidate,
  });
}

export function useRemoverCronograma() {
  const invalidate = useInvalidate(["cronograma"]);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cronograma_itens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}
