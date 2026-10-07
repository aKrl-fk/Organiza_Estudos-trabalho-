-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  nome text NOT NULL DEFAULT '',
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- materias
CREATE TABLE public.materias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  nome text NOT NULL,
  cor text NOT NULL DEFAULT '#8B9DC3',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materias TO authenticated;
GRANT ALL ON public.materias TO service_role;
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own materias select" ON public.materias FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own materias insert" ON public.materias FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own materias update" ON public.materias FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own materias delete" ON public.materias FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX materias_user_idx ON public.materias(user_id);

-- sessoes_estudo
CREATE TABLE public.sessoes_estudo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  materia_id uuid NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  duracao_minutos integer NOT NULL CHECK (duracao_minutos > 0),
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessoes_estudo TO authenticated;
GRANT ALL ON public.sessoes_estudo TO service_role;
ALTER TABLE public.sessoes_estudo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sessoes select" ON public.sessoes_estudo FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own sessoes insert" ON public.sessoes_estudo FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own sessoes update" ON public.sessoes_estudo FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own sessoes delete" ON public.sessoes_estudo FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX sessoes_user_data_idx ON public.sessoes_estudo(user_id, data);

-- cronograma_itens
CREATE TABLE public.cronograma_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  materia_id uuid NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
  dia_semana smallint NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  horario_inicio time NOT NULL,
  horario_fim time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cronograma_itens TO authenticated;
GRANT ALL ON public.cronograma_itens TO service_role;
ALTER TABLE public.cronograma_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cronograma select" ON public.cronograma_itens FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own cronograma insert" ON public.cronograma_itens FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own cronograma update" ON public.cronograma_itens FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own cronograma delete" ON public.cronograma_itens FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX cronograma_user_idx ON public.cronograma_itens(user_id, dia_semana);
