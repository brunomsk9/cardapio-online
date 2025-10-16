# Sistema de Gerenciamento de Restaurantes Multi-tenant

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Funcionalidades por Perfil](#funcionalidades-por-perfil)
5. [Estrutura de Dados](#estrutura-de-dados)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [Recursos Principais](#recursos-principais)
8. [Instalação e Configuração](#instalação-e-configuração)
9. [Deploy](#deploy)

---

## 🎯 Visão Geral

Sistema completo de gerenciamento de restaurantes com arquitetura multi-tenant, permitindo que múltiplos restaurantes operem de forma independente na mesma plataforma. Cada restaurante possui seu próprio subdomínio, cardápio, equipe e configurações.

**URL do Projeto**: https://lovable.dev/projects/3434bf00-2eb7-47e8-a877-b8846ab2d596

---

## 🏗️ Arquitetura do Sistema

### Multi-tenancy via Subdomínios

O sistema utiliza subdomínios para separar os restaurantes:
- `restaurante1.seudominio.com` → Restaurante 1
- `restaurante2.seudominio.com` → Restaurante 2
- `seudominio.com` → Página principal com lista de restaurantes

### Componentes Principais

```
├── Frontend (React + TypeScript)
│   ├── Páginas Públicas
│   │   ├── Landing Page
│   │   └── Cardápio do Restaurante
│   ├── Áreas Autenticadas
│   │   ├── Admin Panel
│   │   ├── Kitchen Display
│   │   └── Super Admin Panel
│   └── Componentes Compartilhados
├── Backend (Supabase)
│   ├── PostgreSQL Database
│   ├── Row Level Security (RLS)
│   ├── Edge Functions
│   └── Realtime Subscriptions
└── Integrações
    ├── WhatsApp API
    └── QR Code Generator
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Router DOM** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security
  - Realtime subscriptions
  - Edge Functions

### Bibliotecas Adicionais
- **@tanstack/react-query** - Gerenciamento de estado servidor
- **date-fns** - Manipulação de datas
- **qrcode.react** - Geração de QR codes
- **sonner** - Notificações toast

---

## 👥 Funcionalidades por Perfil

### 1. **Super Admin** (super_admin)

Acesso total ao sistema com capacidade de gerenciar todos os restaurantes.

#### Funcionalidades:
- ✅ Gerenciar todos os restaurantes
  - Criar, editar, ativar/desativar restaurantes
  - Configurar subdomínios
  - Definir informações (nome, endereço, telefone, email, logo)
- ✅ Gerenciar usuários do sistema
  - Criar usuários com qualquer perfil
  - Atribuir/remover perfis (admin, kitchen, user)
  - Associar usuários a restaurantes
  - Visualizar todos os usuários e seus emails
- ✅ Visualizar relatórios consolidados de todos os restaurantes
- ✅ Acesso a todos os painéis (Admin e Kitchen)

### 2. **Admin do Restaurante** (admin)

Gerencia um ou mais restaurantes específicos aos quais está associado.

#### Funcionalidades:
- ✅ **Gerenciamento de Cardápio**
  - Criar, editar e excluir itens do menu
  - Definir categorias personalizadas
  - Controlar disponibilidade de itens
  - Upload de imagens dos pratos
  - Definir preços e descrições

- ✅ **Gerenciamento de Pedidos**
  - Visualizar todos os pedidos em tempo real
  - Filtrar por status (pendente, confirmado, preparando, pronto, entregue, cancelado)
  - Atualizar status dos pedidos
  - Enviar notificações por WhatsApp
  - Visualizar detalhes completos dos pedidos

- ✅ **Gerenciamento de Categorias**
  - Criar e editar categorias do menu
  - Definir ordem de exibição
  - Categorias padrão do sistema

- ✅ **Relatórios e Análises**
  - Relatórios de pedidos (receita, tickets médios, etc.)
  - Relatórios de clientes (frequência, gastos, etc.)
  - Gráficos de desempenho
  - Exportação de dados

- ✅ **Configurações do Restaurante**
  - Editar informações básicas
  - Personalizar mensagem de WhatsApp
  - Gerar QR Code do cardápio
  - Configurar método de entrega

- ✅ **Gestão de Usuários do Restaurante**
  - Criar usuários kitchen para o restaurante
  - Visualizar equipe associada

### 3. **Kitchen (Cozinha)** (kitchen)

Interface simplificada focada na operação da cozinha.

#### Funcionalidades:
- ✅ **Display de Pedidos**
  - Visualização em tempo real de novos pedidos
  - Cards coloridos por status
  - Som de notificação para novos pedidos
  - Layout otimizado para tablets/displays de cozinha

- ✅ **Atualização de Status**
  - Atualizar pedidos de: pendente → confirmado → preparando → pronto → entregue
  - Interface touch-friendly com botões grandes

- ✅ **Estatísticas em Tempo Real**
  - Total de pedidos ativos
  - Pedidos em preparação
  - Pedidos prontos para entrega
  - Tempo médio de preparação

- ✅ **Notificações Sonoras**
  - Bipe duplo ao receber novo pedido
  - Toast notification com detalhes

### 4. **Cliente/Usuário** (user ou não autenticado)

Experiência de pedido simples e intuitiva.

#### Funcionalidades:
- ✅ **Visualização do Cardápio**
  - Navegação por categorias
  - Filtros de categoria
  - Detalhes completos dos pratos
  - Imagens dos produtos

- ✅ **Carrinho de Compras**
  - Adicionar/remover itens
  - Atualizar quantidades
  - Visualizar total em tempo real
  - Persistência do carrinho na sessão

- ✅ **Checkout**
  - Formulário de endereço de entrega
  - Seleção de método de pagamento (PIX, Cartão, Dinheiro)
  - Campo de observações
  - Finalização via WhatsApp ou sistema

- ✅ **Pedidos Sem Cadastro**
  - Possibilidade de fazer pedidos como convidado
  - Apenas nome, telefone e email necessários

- ✅ **Perfil (se autenticado)**
  - Visualizar histórico de pedidos
  - Gerenciar endereços salvos
  - Editar informações pessoais

---

## 📊 Estrutura de Dados

### Tabelas Principais

#### `restaurants`
Armazena informações dos restaurantes.
```sql
- id (uuid)
- name (text)
- description (text)
- address (text)
- phone (text)
- email (text)
- logo_url (text)
- subdomain (varchar) - UNIQUE
- whatsapp_message (text)
- is_active (boolean)
- created_at, updated_at (timestamp)
```

#### `menu_items`
Itens do cardápio de cada restaurante.
```sql
- id (uuid)
- restaurant_id (uuid) → restaurants.id
- name (text)
- description (text)
- category (text)
- price (numeric)
- image_url (text)
- available (boolean)
- created_at, updated_at (timestamp)
```

#### `menu_categories`
Categorias personalizadas do menu.
```sql
- id (uuid)
- restaurant_id (uuid) → restaurants.id
- name (text)
- display_order (integer)
- is_system_default (boolean)
- created_at, updated_at (timestamp)
```

#### `orders`
Pedidos realizados pelos clientes.
```sql
- id (uuid)
- restaurant_id (uuid) → restaurants.id
- user_id (uuid) - nullable para pedidos guest
- customer_name (text)
- customer_phone (text)
- customer_email (text)
- delivery_address (text)
- items (jsonb) - array de itens do pedido
- total (numeric)
- status (text) - pending, confirmed, preparing, ready, delivered, cancelled
- payment_method (text) - pix, card, cash
- notes (text)
- created_at, updated_at (timestamp)
```

#### `user_roles`
Perfis dos usuários no sistema.
```sql
- id (uuid)
- user_id (uuid) → auth.users.id
- role (app_role) - enum: super_admin, admin, kitchen, user
- created_at (timestamp)
- UNIQUE(user_id, role)
```

#### `user_restaurants`
Associação entre usuários e restaurantes.
```sql
- id (uuid)
- user_id (uuid) → auth.users.id
- restaurant_id (uuid) → restaurants.id
- created_at (timestamp)
- UNIQUE(user_id, restaurant_id)
```

#### `profiles`
Perfis de usuários com informações adicionais.
```sql
- id (uuid) → auth.users.id
- full_name (text)
- phone (text)
- created_at, updated_at (timestamp)
```

#### `addresses`
Endereços salvos dos usuários.
```sql
- id (uuid)
- user_id (uuid) → auth.users.id
- street (text)
- number (text)
- complement (text)
- neighborhood (text)
- city (text)
- state (text)
- zip_code (text)
- is_default (boolean)
- created_at (timestamp)
```

#### `notifications`
Notificações do sistema.
```sql
- id (uuid)
- type (varchar) - new_order, status_change
- title (varchar)
- message (text)
- order_id (uuid)
- user_id (uuid)
- read (boolean)
- created_at (timestamp)
```

### Views de Relatórios

#### `order_reports`
Relatórios agregados de pedidos.
```sql
- date (timestamp)
- restaurant_id (uuid)
- total_orders (bigint)
- total_revenue (numeric)
- average_order_value (numeric)
- unique_customers (bigint)
- delivered_orders (bigint)
- cancelled_orders (bigint)
```

#### `customer_reports`
Relatórios de clientes.
```sql
- restaurant_id (uuid)
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- total_orders (bigint)
- completed_orders (bigint)
- total_spent (numeric)
- average_order_value (numeric)
- first_order_date (timestamp)
- last_order_date (timestamp)
```

---

## 🔐 Autenticação e Autorização

### Sistema de Perfis (Roles)

O sistema implementa um controle de acesso baseado em perfis usando uma enum:

```sql
CREATE TYPE app_role AS ENUM ('super_admin', 'admin', 'kitchen', 'user');
```

### Row Level Security (RLS)

Todas as tabelas possuem políticas RLS implementadas:

#### Exemplos de Políticas:

**restaurants** - Super admins gerenciam tudo, usuários veem seus restaurantes
```sql
- Super admins manage all restaurants
- Users view associated restaurants  
- Public can view active restaurants
```

**menu_items** - Público vê itens disponíveis, admins gerenciam
```sql
- Public view available menu items
- Restaurant managers manage their menu items
- Super admins manage all menu items
```

**orders** - Usuários veem seus pedidos, kitchen/admin gerenciam
```sql
- Users can view their own orders
- Kitchen can view/update restaurant orders
- Admins can view/update restaurant orders
- Guest users can create orders
```

### Funções de Segurança

```sql
-- Verifica se usuário tem determinado perfil
has_role(user_id uuid, role app_role) → boolean

-- Verifica se é super admin
is_super_admin() → boolean

-- Verifica se é admin ou super admin
is_admin_or_super() → boolean

-- Obtém perfil do usuário atual
get_current_user_role() → text
```

### Fluxo de Autenticação

1. **Cadastro**: Novo usuário recebe perfil 'user' automaticamente
2. **Login**: Supabase gerencia sessão e tokens
3. **Verificação de Perfil**: Hook `useUserRole` busca perfil do banco
4. **Controle de Acesso**: Componentes protegidos verificam perfil
5. **Redirecionamento**: Usuários são direcionados conforme perfil

---

## 🚀 Recursos Principais

### 1. Detecção Automática de Restaurante via Subdomain

```typescript
// Hook: useSubdomainRestaurant
- Detecta subdomain da URL
- Busca restaurante correspondente
- Carrega dados do restaurante
- Disponibiliza para componentes
```

### 2. Notificações em Tempo Real

- **Supabase Realtime**: Subscriptions para novos pedidos
- **Web Audio API**: Sons de notificação
- **Toast Notifications**: Alertas visuais
- **Badge de contagem**: Pedidos não lidos

### 3. Integração com WhatsApp

- Envio de pedidos via WhatsApp Web
- Mensagem personalizada por restaurante
- Formatação automática do pedido
- Link direto para conversa

### 4. QR Code do Cardápio

- Geração dinâmica de QR Code
- Link direto para subdomain do restaurante
- Download da imagem
- Integração com material impresso

### 5. Sistema de Carrinho Persistente

```typescript
// Hook: useCart
- Estado gerenciado localmente
- Adicionar/remover itens
- Atualizar quantidades
- Cálculo automático de totais
```

### 6. Checkout Flexível

- Pedidos com ou sem autenticação
- Múltiplos métodos de pagamento
- Validação de formulários com Zod
- Integração com endereços salvos

### 7. Dashboard de Cozinha (KDS)

- Interface otimizada para tablets
- Atualização em tempo real
- Layout por cards de status
- Estatísticas ao vivo

### 8. Relatórios e Analytics

- Gráficos de receita
- Top clientes
- Análise de pedidos
- Exportação de dados
- Filtros por período

### 9. Gerenciamento de Categorias

- Categorias personalizadas
- Ordem de exibição
- Categorias do sistema (Entradas, Principais, Bebidas, Sobremesas)
- Validação de uso antes de excluir

### 10. Multi-Restaurant Management

- Um admin pode gerenciar múltiplos restaurantes
- Seletor de restaurante no painel
- Contexto isolado por restaurante
- RLS garante isolamento de dados

---

## 💻 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ e npm
- Conta Supabase
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

4. **Execute o projeto localmente**
```bash
npm run dev
```

5. **Acesse o sistema**
```
http://localhost:5173
```

### Configuração do Supabase

1. **Crie um projeto no Supabase**
2. **Execute as migrations** (localizadas em `supabase/migrations/`)
3. **Configure Authentication Providers** (Email por padrão)
4. **Ajuste as RLS policies** conforme necessário
5. **Configure os domínios permitidos** nas configurações do projeto

### Primeiro Acesso

1. O primeiro usuário cadastrado recebe automaticamente perfil `super_admin`
2. Use este usuário para criar restaurantes
3. Crie usuários admin e kitchen conforme necessário
4. Configure os subdomínios dos restaurantes

---

## 📦 Deploy

### Deploy no Lovable

1. Abra o [projeto no Lovable](https://lovable.dev/projects/3434bf00-2eb7-47e8-a877-b8846ab2d596)
2. Clique em **Share → Publish**
3. O sistema será publicado automaticamente

### Deploy Manual (Vercel/Netlify)

1. **Build do projeto**
```bash
npm run build
```

2. **Configure as variáveis de ambiente** no serviço de hosting

3. **Deploy da pasta `dist`**

### Domínio Customizado

Para conectar um domínio personalizado:

1. Acesse **Project > Settings > Domains** no Lovable
2. Clique em **Connect Domain**
3. Siga as instruções para configurar DNS
4. Configure wildcard subdomain (*.seudominio.com) para multi-tenancy

Mais informações: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## 📱 Estrutura de Rotas

```
/                          - Landing page / Lista de restaurantes
/auth                      - Login / Cadastro
/admin                     - Painel administrativo
  /admin/menu             - Gerenciamento de cardápio
  /admin/orders           - Gerenciamento de pedidos
  /admin/categories       - Gerenciamento de categorias
  /admin/customers        - Relatório de clientes
  /admin/reports          - Relatórios e análises
  /admin/settings         - Configurações do restaurante
  /admin/users            - Gerenciamento de usuários (Restaurant)
/super-admin              - Painel super admin
  /super-admin/restaurants - Gerenciamento de restaurantes
  /super-admin/users      - Gerenciamento global de usuários
/kitchen                  - Display de cozinha (KDS)
```

---

## 🔧 Hooks Customizados

| Hook | Descrição |
|------|-----------|
| `useAuth` | Gerencia autenticação e sessão |
| `useUserRole` | Obtém e verifica perfil do usuário |
| `useUserRestaurant` | Lista restaurantes do usuário e seleção |
| `useSubdomainRestaurant` | Detecta restaurante via subdomain |
| `useSubdomainAccess` | Valida acesso ao subdomain |
| `useDomainDetection` | Detecta domínio e subdomain |
| `useCart` | Gerencia carrinho de compras |
| `useRestaurantMenu` | Carrega itens do menu |
| `useMenuItems` | CRUD de itens do menu (admin) |
| `useMenuCategories` | CRUD de categorias (admin) |
| `useKitchenOrders` | Lista e atualiza pedidos (kitchen) |
| `useNotifications` | Gerencia notificações |
| `useOrderNotificationSound` | Som para novos pedidos |

---

## 🎨 Design System

O projeto utiliza Tailwind CSS com tokens semânticos definidos em `src/index.css`:

- Cores baseadas em HSL
- Suporte a dark mode
- Componentes shadcn/ui customizados
- Design responsivo mobile-first

---

## 🐛 Troubleshooting

### Erro ao criar pedido
- Verificar RLS policies na tabela `orders`
- Confirmar que o método de pagamento é válido (pix, card, cash)

### Subdomain não funciona
- Verificar configuração DNS (wildcard)
- Conferir campo `subdomain` na tabela `restaurants`
- Testar em ambiente de produção (localhost não suporta subdomains)

### Notificações não aparecem
- Verificar subscription do Realtime no Supabase
- Confirmar que tabela `orders` está na publicação `supabase_realtime`
- Verificar console para erros de conexão

### Usuário não consegue acessar
- Verificar perfil em `user_roles`
- Conferir associação em `user_restaurants` (para admins/kitchen)
- Validar RLS policies

---

## 📄 Licença

Este projeto foi desenvolvido usando [Lovable](https://lovable.dev).

---

## 🤝 Suporte

Para suporte e dúvidas:
- [Documentação Lovable](https://docs.lovable.dev/)
- [Documentação Supabase](https://supabase.com/docs)
- [Comunidade Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
