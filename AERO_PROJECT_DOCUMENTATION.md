# AERO - Project Manager: Cronologia e Documentação Técnica

Este documento detalha toda a jornada de desenvolvimento do **AERO-PROJECT MANAGER**, desde a sua fundação até a recente migração para Radix UI Themes.

## 🚀 Visão Geral
O AERO é um clone avançado do Plane.so, focado em alta performance, UX premium e uma arquitetura escalável para gestão de projetos e equipes.

---

## 🛠️ Stack Tecnológica

### Core
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Linguagem**: TypeScript

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Banco de Dados**: PostgreSQL

### UI/UX
- **Componentes**: [@radix-ui/themes](https://www.radix-ui.com/themes) (Migrado de shadcn/ui)
- **Estilização**: Tailwind CSS (v4)
- **Ícones**: [lucide-react](https://lucide.dev/)
- **Editor**: [Tiptap](https://tiptap.dev/) (Rich Text)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

---

## 🎨 Design System & Branding

O AERO utiliza um sistema de design proprietário e moderno, com foco em legibilidade e hierarquia visual.

### Paleta de Cores (Premium Palette)
- **Primary (Brand)**: `#272D58` - Cor principal da marca, utilizada para ações primárias e identidade visual.
- **Success**: `#3E7711` - Indicadores de conclusão e estados positivos.
- **Info**: `#0078A8` - Informações neutras e destaques secundários.
- **Warning**: `#994204` - Alertas e estados que requerem atenção.
- **Danger**: `#9E171E` - Erros críticos, ações destrutivas e estados de urgência máxima.

Todas as cores contam com escalas completas de **100 a 900**, permitindo variações sutis em fundos, bordas e estados de hover, tudo controlado via variáveis CSS e integrado ao Tailwind v4.

---

## 📅 Histórico de Desenvolvimento

### Fase 1: Fundação e Infraestrutura
- Configuração do **Turborepo** para gerenciar `apps/web` e `packages/database`.
- Modelagem do banco de dados com **Drizzle ORM**, incluindo:
  - Tabelas de Usuários (Profiles), Workspaces e Membros.
  - Estrutura de Projetos, Estados de Issues, Issues, Descrições e Labels.
- Integração com **Supabase** para Autenticação e Row Level Security (RLS).

### Fase 2: Gestão de Workspaces e Projetos
- Implementação do fluxo de criação de Workspaces com slugs únicos.
- Desenvolvimento do sistema de Membros e permissões por Workspace.
- Criação de Projetos com identificadores customizados (ex: WEB-1).
- Implementação de Estados de Trabalho customizáveis (Backlog, Todo, In Progress, Done).

### Fase 3: Funcionalidades de Gestão de Tarefas (Issues)
- **Kanban Board**: Implementação completa de arrastar e soltar (Drag & Drop) para mudar estados de tarefas.
- **Rich Text Editor**: Integração do Tiptap para descrições ricas em detalhes.
- **Priority & Metadata**: Sistema de prioridade (Urgent, High, Medium, Low), datas de início e entrega.
- **Labels**: Sistema de categorização por tags coloridas.

### Fase 4: Refinamento de UX e Correções
- **Sidebar**: Reestruturação do menu lateral para incluir seções de Projetos, Visualizações, Analytics e Configurações de Usuário.
- **Tooltip Clipping**: Correção de bugs visuais onde tooltips eram cortados pela barra de ferramentas.
- **Filtragem Avançada**: Implementação de seletores de visualização (List vs Kanban) e filtros de busca.
- **RLS Fixes**: Ajuste fino nas políticas de segurança do Supabase para garantir que usuários só vejam dados de seus próprios Workspaces.

### Fase 5: Migração de UI e Performance (Atual)
- **Migração para Radix UI Themes**: Transição completa do `shadcn/ui` para `@radix-ui/themes` para uma base de componentes mais robusta e nativa.
- **Sistema de Cores Customizado**: Implementação de uma nova paleta visual premium (Primary #272D58, Success, Info, Warning, Danger) com escalas completas (100-900) integradas ao Tailwind v4 e Radix UI.
- **Padronização de Ícones**: Migração total para `lucide-react`.
- **Limpeza de Dependências**: Remoção de bibliotecas redundantes como `class-variance-authority` (cva) e `tw-animate-css`.
- **Otimização de Build**: Redução do bundle size e melhoria na velocidade de compilação.

---

## 🏗️ Estrutura do Projeto

```text
aero/
├── apps/
│   ├── web/                # Aplicação Next.js principal
│   └── api/                # Estrutura para backend futuro (atualmente usando Supabase)
├── packages/
│   ├── database/           # Schema do Drizzle e Migrações
│   ├── config/             # Configurações compartilhadas (ESLint, TS)
│   └── ui/                 # Componentes compartilhados
└── supabase/               # Configuração local do Supabase
```

---

## 🔒 Segurança (RLS - Row Level Security)
Implementamos políticas rigorosas no PostgreSQL para proteger a integridade dos dados:
- Usuários autenticados podem ver apenas Workspaces onde são membros.
- Apenas donos de projetos podem deletá-los.
- Issues são visíveis apenas para membros do Workspace correspondente.

---

## 🔮 Próximos Passos
- Implementação de **Analytics** e Dashboards de progresso.
- Sistema de **Notificações** em tempo real.
- **Ciclos (Sprints)** e Módulos para gestão avançada.
- **Gantt Chart** para visualização de cronogramas.
