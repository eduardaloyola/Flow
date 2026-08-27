# ✓ TaskFlow

Aplicação full-stack de gerenciamento de tarefas, pensada como projeto de portfólio para demonstrar fundamentos sólidos de **React + TypeScript** no front-end e **Node.js + Express + TypeScript** no back-end.

O usuário cria uma conta, cadastra tarefas com categoria, prioridade e prazo, marca como concluídas e acompanha seu progresso em um painel de estatísticas — um caso de uso simples e universal ("usuário comum"), mas que cobre praticamente todo o ciclo de um CRUD autenticado.

## ✨ Funcionalidades

- Cadastro e login com autenticação via **JWT** e senha com hash (**bcrypt**)
- CRUD completo de tarefas (criar, listar, editar, concluir, excluir)
- Categorias e níveis de prioridade (baixa / média / alta)
- Data limite com destaque visual para tarefas atrasadas
- Painel com estatísticas (total, concluídas, pendentes, atrasadas e taxa de conclusão)
- Filtros (pendentes / concluídas / todas) e busca por título ou categoria
- Rotas protegidas no front-end (redireciona para login se não autenticado)
- Interface responsiva, sem dependência de bibliotecas de UI prontas

## 🛠️ Stack técnica

**Front-end**
- React 18 + TypeScript
- Vite
- React Router (rotas e proteção de rotas)
- Context API (estado de autenticação)
- Axios (com interceptor para injetar o token JWT)
- CSS puro, organizado por componente

**Back-end**
- Node.js + Express + TypeScript
- Autenticação com JSON Web Token
- bcryptjs para hash de senha
- Persistência em arquivo JSON (`db.json`) — zero configuração de banco de dados, ideal para rodar localmente sem dependências externas
- Arquitetura em camadas: `routes` → `controllers` → `data`

## 📁 Estrutura do projeto

```
taskflow/
├── client/                 # Front-end (React + TS)
│   └── src/
│       ├── api/            # Cliente HTTP (axios)
│       ├── components/     # Componentes reutilizáveis
│       ├── context/        # Contexto de autenticação
│       ├── pages/          # Páginas (Login, Registro, Dashboard)
│       ├── types/          # Tipos TypeScript compartilhados
│       └── styles/         # CSS global
│
└── server/                 # Back-end (Node + Express + TS)
    └── src/
        ├── config/          # Camada de acesso a dados
        ├── controllers/     # Regras de negócio
        ├── middleware/      # Autenticação e tratamento de erros
        ├── routes/          # Definição das rotas da API
        ├── types/           # Tipos TypeScript compartilhados
        └── utils/           # JWT helpers
```

## 🚀 Como rodar localmente

Pré-requisitos: **Node.js 18+** instalado.

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

A API sobe em `http://localhost:4000`.

### 2. Frontend

Em outro terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

Crie uma conta pela tela de cadastro e comece a usar — os dados ficam salvos em `server/src/data/db.json`.

## 🔌 Principais endpoints da API

| Método | Rota                     | Descrição                          | Autenticação |
|--------|---------------------------|-------------------------------------|:---:|
| POST   | `/api/auth/register`      | Cria uma nova conta                 | não |
| POST   | `/api/auth/login`         | Autentica e retorna um token        | não |
| GET    | `/api/auth/me`            | Retorna o usuário autenticado       | sim |
| GET    | `/api/tasks`               | Lista as tarefas do usuário         | sim |
| POST   | `/api/tasks`               | Cria uma nova tarefa                | sim |
| PATCH  | `/api/tasks/:id`           | Atualiza uma tarefa                 | sim |
| DELETE | `/api/tasks/:id`           | Remove uma tarefa                   | sim |
| GET    | `/api/tasks/stats/summary` | Retorna estatísticas do usuário     | sim |

## 💡 Decisões de arquitetura 

- **Persistência em JSON em vez de banco real**: escolha deliberada para manter o projeto 100% autocontido e fácil de rodar em qualquer máquina em segundos, sem exigir instalação de SGBD. A camada `config/db.ts` isola essa lógica, então trocar por Postgres/MongoDB no futuro afetaria só um arquivo.
- **JWT + bcrypt**: padrão de mercado para autenticação stateless — o servidor não guarda sessão, só valida o token a cada requisição.
- **Separação de responsabilidades**: rotas cuidam só de mapear endpoints, controllers concentram a lógica de negócio, middleware cuida de autenticação/erros — facilita testes e manutenção.
- **Tipagem compartilhada**: os mesmos conceitos (`Task`, `Priority`, etc.) são tipados tanto no client quanto no server, reduzindo bugs de contrato entre front e back.

## 🔭 Possíveis evoluções

- Migrar a persistência para PostgreSQL com Prisma
- Adicionar testes automatizados (Jest + Supertest no back-end, Testing Library no front-end)
- Deploy (back-end no Render/Railway, front-end na Vercel)
- Notificações de tarefas próximas do vencimento
- Modo escuro

---

Projeto construído para fins de aprendizado.
