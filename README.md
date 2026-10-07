# Organiza Estudos

Plataforma fullstack de organização e planejamento pessoal de estudos voltada para vestibulares e concursos públicos. O sistema oferece cronograma semanal, rastreamento de horas estudadas, métricas de evolução e gestão de matérias em uma interface temática cósmica com suporte a temas claro e escuro.

\---

## Recursos Principais

* **Dashboard Diário**: visualização das matérias programadas para o dia atual, total de horas acumuladas na semana e acesso rápido ao registro de sessões.
* **Gestão de Matérias**: cadastro de matérias com cores personalizadas e acompanhamento do total de horas dedicadas a cada disciplina.
* **Cronograma Semanal**: planejamento em blocos por dia da semana e faixa de horário, com edição e exclusão simplificadas.
* **Registro de Sessões**: lançamento rápido de horas e minutos estudados com data e observações opcionais.
* **Acompanhamento de Progresso**: gráficos de distribuição por matéria (Recharts) e histórico das semanas recentes com identificação das disciplinas com maior e menor dedicação.
* **Autenticação Segura**: autenticação via Supabase Auth (email e senha) com Row Level Security (RLS) habilitado em todas as tabelas.
* **Identidade Visual Cósmica**: paleta personalizada com tons profundos de azul e acentos dourados/lavanda, elementos decorativos de constelação e alternância suave entre temas escuro e claro.

\---

## Tecnologias Utilizadas

* **Framework**: [TanStack Start](https://tanstack.com/start) com [React 19](https://react.dev/)
* **Roteamento**: [TanStack Router](https://tanstack.com/router) (file-based routing)
* **Gerenciamento de Estado de Servidor**: [TanStack Query v5](https://tanstack.com/query)
* **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com CSS variables OKLCH
* **Componentes de UI**: Radix UI, Lucide Icons e Sonner (toasts)
* **Gráficos**: [Recharts](https://recharts.org/)
* **Backend \& Autenticação**: [Supabase](https://supabase.com/) (PostgreSQL, Auth e RLS)
* **ORM \& Migrações**: [Drizzle ORM](https://orm.drizzle.team/) e Drizzle Kit
* **Bundler \& Servidor**: Vite e Nitro

\---

## Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 20 ou superior) ou [Bun](https://bun.sh/)
* Um arquivo `.env` com as chaves do Supabase (veja abaixo). Não é necessário criar conta própria no Supabase nem instalar nada além do Node/npm para simplesmente rodar o projeto.

\---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

```env
# Supabase Client — obrigatórias para rodar a aplicação
VITE\\\_SUPABASE\\\_URL=https://seu-projeto.supabase.co
VITE\\\_SUPABASE\\\_PUBLISHABLE\\\_KEY=sua-chave-anon-ou-publishable
```

> \\\*\\\*Nota:\\\*\\\* a variável `DATABASE\\\_URL` (usada pelo Drizzle ORM) é \\\*\\\*opcional\\\*\\\* e só é necessária
> se for alterar a estrutura do banco de dados diretamente (`npm run db:generate`). Para apenas
> instalar e rodar o projeto normalmente, as duas chaves do Supabase acima já são suficientes.

\---

## Instalação e Execução

1. Clone o repositório e acerte o diretório:

```bash
   git clone https://github.com/seu-usuario/cosmic-planner.git
   cd cosmic-planner
   ```

2. Instale as dependências:

```bash
   npm install
   ```

3. Inicie o servidor em modo de desenvolvimento:

```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:5173`.

\---

## Scripts Disponíveis

|Comando|Descrição|
|-|-|
|`npm run dev`|Executa o servidor de desenvolvimento Vite/TanStack Start|
|`npm run build`|Compila o projeto para produção|
|`npm run preview`|Executa a versão compilada localmente para validação|
|`npm run lint`|Executa a verificação estática com ESLint|
|`npm run format`|Formata o código-fonte utilizando o Prettier|

\---

## Estrutura do Projeto

```
├── drizzle/              # Schemas e migrações do banco de dados (Drizzle ORM)
├── src/
│   ├── components/       # Componentes compartilhados e componentes de UI (Radix)
│   ├── hooks/            # Hooks utilitários customizados
│   ├── integrations/     # Integrações com serviços externos (Supabase)
│   ├── lib/              # Funções de autenticação, tema, dados e utilitários
│   ├── routes/           # Rotas da aplicação baseadas no TanStack Router
│   ├── router.tsx        # Configuração do router
│   ├── server.ts         # Ponto de entrada do servidor SSR
│   ├── start.ts          # Inicialização e middlewares do TanStack Start
│   └── styles.css        # Configurações globais de estilos e tema Tailwind v4
├── supabase/             # Configurações do Supabase CLI
├── package.json          # Metadados e dependências do projeto
└── vite.config.ts        # Configurações de compilação do Vite
```



