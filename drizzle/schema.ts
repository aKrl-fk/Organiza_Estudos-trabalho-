import { pgTable, uuid, text, timestamp, date, integer, smallint, time } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  nome: text("nome").notNull().default(""),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const materias = pgTable("materias", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  nome: text("nome").notNull(),
  cor: text("cor").notNull().default("#8B9DC3"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessoesEstudo = pgTable("sessoes_estudo", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  materiaId: uuid("materia_id")
    .notNull()
    .references(() => materias.id, { onDelete: "cascade" }),
  data: date("data").notNull().defaultNow(),
  duracaoMinutos: integer("duracao_minutos").notNull(),
  observacao: text("observacao"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cronogramaItens = pgTable("cronograma_itens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  materiaId: uuid("materia_id")
    .notNull()
    .references(() => materias.id, { onDelete: "cascade" }),
  diaSemana: smallint("dia_semana").notNull(),
  horarioInicio: time("horario_inicio").notNull(),
  horarioFim: time("horario_fim").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type Materia = typeof materias.$inferSelect;
export type SessaoEstudo = typeof sessoesEstudo.$inferSelect;
export type CronogramaItem = typeof cronogramaItens.$inferSelect;
