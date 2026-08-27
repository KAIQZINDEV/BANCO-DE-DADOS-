# BANCO-DE-DADOS-

# 🗄️ DataCore — Sistema de Gerenciamento de Banco de Dados

<p align="center">
  <strong>DataCore</strong><br>
  Painel moderno para gerenciamento de clientes, dados, relatórios e logs do sistema.
</p>

---

## 📌 Sobre o projeto

O **DataCore** é uma aplicação web desenvolvida para simular um painel administrativo de gerenciamento de banco de dados.

O sistema possui uma interface moderna, responsiva e interativa, permitindo visualizar informações, cadastrar clientes, editar registros, excluir dados, consultar tabelas, acompanhar atividades e exportar informações em formato CSV.

O projeto foi desenvolvido utilizando tecnologias web nativas:

* HTML5
* CSS3
* JavaScript
* LocalStorage
* SVG
* CSV

A aplicação funciona diretamente no navegador, sem necessidade de servidor ou banco de dados externo.

---

## 🎯 Objetivo

O objetivo do DataCore é fornecer uma interface centralizada para gerenciamento e visualização de informações de um sistema.

A aplicação foi estruturada para apresentar conceitos de:

* CRUD de clientes;
* Organização de dados;
* Tabelas;
* Relatórios;
* Logs de atividades;
* Dashboard administrativo;
* Pesquisa e filtragem;
* Paginação;
* Exportação de dados;
* Persistência local;
* Interface responsiva.

---

# 🖥️ Funcionalidades

## 📊 Dashboard

O Dashboard apresenta uma visão geral do sistema.

Nele é possível visualizar:

* Total de clientes;
* Clientes ativos;
* Total de registros;
* Status do servidor;
* Uptime;
* Consumo de CPU;
* Memória;
* Armazenamento;
* Gráfico de atividade do banco;
* Clientes adicionados recentemente.

O sistema também apresenta indicadores visuais e gráficos de atividade para facilitar a interpretação dos dados.

---

## 👥 Gerenciamento de Clientes

A área **Clientes** permite administrar os registros cadastrados no sistema.

Cada cliente possui:

| Campo    | Descrição                      |
| -------- | ------------------------------ |
| ID       | Identificador único do cliente |
| Nome     | Nome do cliente                |
| E-mail   | E-mail cadastrado              |
| Telefone | Telefone do cliente            |
| Status   | Ativo ou Inativo               |
| Data     | Data de cadastro               |

O sistema permite:

* ➕ Adicionar cliente;
* ✏️ Editar cliente;
* 🗑️ Excluir cliente;
* 🔎 Pesquisar clientes;
* 🔽 Filtrar por status;
* 🔤 Ordenar por nome;
* 📅 Ordenar pelos registros mais recentes;
* 📄 Navegar através de paginação.

A tabela utiliza paginação de **6 registros por página**.

---

# ➕ Cadastro de clientes

Para adicionar um novo cliente, o sistema disponibiliza um formulário contendo:

* Nome;
* E-mail;
* Telefone;
* Status.

Antes de salvar o registro, o sistema realiza validações básicas:

* O nome deve possuir pelo menos 3 caracteres;
* O e-mail deve possuir formato válido;
* O telefone deve possuir pelo menos 8 caracteres.

Após o cadastro, o cliente recebe automaticamente um novo ID e a data de criação é registrada.

---

# ✏️ Edição de clientes

Os registros existentes podem ser modificados através do botão de edição.

Ao editar um cliente, o sistema carrega os dados atuais no formulário:

* Nome;
* E-mail;
* Telefone;
* Status.

Após salvar as alterações, o sistema atualiza o registro e registra a ação nos logs.

---

# 🗑️ Exclusão de clientes

A exclusão de um cliente utiliza uma janela de confirmação.

O sistema solicita uma confirmação antes de remover o registro.

Após a exclusão:

1. O cliente é removido da lista;
2. A ação é registrada nos logs;
3. Os dados são salvos;
4. O Dashboard é atualizado;
5. Uma mensagem de confirmação é exibida.

A exclusão é indicada pelo sistema como uma ação que não pode ser desfeita.

---

# 🗃️ Banco de Dados

A seção **Banco de dados** apresenta as estruturas disponíveis no sistema.

Atualmente existem três conjuntos principais:

### 👥 Clientes

Armazena os clientes cadastrados.

Campos:

```text
ID
Cliente
E-mail
Telefone
Status
Data
```

### 📑 Relatórios

Armazena informações sobre os relatórios disponíveis.

Campos:

```text
ID
Relatório
Tipo
Registros
Data
Status
```

### 🕐 Logs

Armazena o histórico das atividades realizadas no sistema.

Campos:

```text
ID
Usuário
Ação
Data
Horário
```

As três estruturas podem ser abertas individualmente e pesquisadas dentro da interface.

---

# 🔎 Pesquisa no Banco de Dados

Cada tabela possui um campo de pesquisa.

A pesquisa permite localizar registros de acordo com os dados disponíveis em cada tabela.

Na tabela de clientes, por exemplo, é possível pesquisar utilizando:

* Nome;
* E-mail;
* Telefone.

A tabela de relatórios permite pesquisa pelo:

* Nome do relatório;
* Tipo.

Já a tabela de logs permite pesquisa por:

* Usuário;
* Ação.

---

# 📥 Exportação CSV

O DataCore possui sistema de exportação de dados.

É possível exportar:

```text
clientes.csv
relatorios.csv
logs.csv
```

Os arquivos são gerados diretamente pelo navegador no formato CSV.

### Clientes

```text
ID, Nome, Email, Telefone, Status, Data
```

### Relatórios

```text
ID, Nome, Tipo, Registros, Data, Status
```

### Logs

```text
ID, Usuário, Ação, Data, Horário
```

A aplicação utiliza a API `Blob` do navegador para gerar e realizar o download dos arquivos CSV.

---

# 📋 Relatórios

A seção **Relatórios** apresenta informações estatísticas do sistema.

Entre os indicadores apresentados estão:

* Total de clientes;
* Clientes ativos;
* Taxa de crescimento;
* Relatórios disponíveis;
* Quantidade de registros;
* Data de geração;
* Status do relatório.

Também existe uma opção para exportar os relatórios em CSV.

---

# 📝 Sistema de Logs

O DataCore possui um sistema de registro de atividades.

As ações realizadas pelo administrador podem gerar registros como:

```text
Cliente "Nome" cadastrado
Cliente "Nome" atualizado
Cliente "Nome" excluído
```

Cada log possui:

| Campo   | Descrição                     |
| ------- | ----------------------------- |
| ID      | Identificador do log          |
| Usuário | Usuário responsável pela ação |
| Ação    | Atividade realizada           |
| Data    | Data da atividade             |
| Horário | Horário da atividade          |

O usuário padrão utilizado pelo sistema atualmente é:

```text
Administrador
```

Os logs também aparecem nas notificações de atividade recente.

---

# 💾 Armazenamento dos dados

O DataCore utiliza o **LocalStorage** do navegador para manter os dados.

As principais chaves utilizadas são:

```javascript
datacore_clients_v2
datacore_logs_v2
datacore_theme
```

Os clientes e logs são convertidos para JSON antes de serem armazenados.

### ⚠️ Importante

O projeto atualmente **não utiliza um banco de dados real**, como:

* MySQL;
* PostgreSQL;
* MongoDB;
* SQLite;
* SQL Server.

Os dados ficam armazenados localmente no navegador.

Por isso, essa versão deve ser considerada uma **aplicação front-end / protótipo funcional de gerenciamento de dados**.

---

# 🌓 Tema claro e escuro

O sistema possui suporte para:

* ☀️ Tema claro;
* 🌙 Tema escuro.

A preferência selecionada pelo usuário é salva no navegador e pode ser recuperada posteriormente.

O CSS também possui variáveis específicas para os dois temas.

---

# 🔍 Pesquisa global

O sistema possui uma barra de pesquisa global acessível através da interface.

Também existe suporte ao atalho:

```text
Ctrl + K
```

A pesquisa global pode localizar clientes pelo nome ou e-mail e direcionar o usuário para a página de clientes com o registro encontrado.

---

# 📱 Responsividade

A interface foi desenvolvida para diferentes tamanhos de tela.

O sistema possui:

* Menu lateral;
* Menu mobile;
* Barra superior;
* Tabelas responsivas;
* Painéis adaptáveis;
* Layout flexível;
* Suporte a diferentes resoluções.

O CSS utiliza `media queries` para adaptar elementos da interface em telas menores.

---

# 🎨 Design

O DataCore utiliza uma identidade visual baseada em um painel administrativo moderno.

### Características

* Interface minimalista;
* Sidebar escura;
* Cards;
* Ícones SVG;
* Gráficos;
* Indicadores de status;
* Animações;
* Tema claro/escuro;
* Tipografia moderna.

### Fontes utilizadas

```text
Sora
Inter
IBM Plex Mono
```

### Cor de destaque

A interface utiliza uma cor de destaque azul baseada na variável:

```css
--accent: #3358FF;
```

No tema escuro, a cor de destaque é ajustada para:

```css
--accent: #5C7DFF;
```

---

# 🧩 Estrutura do projeto

```text
DataCore/
│
├── index.html
├── style.css
└── script.js
```

### `index.html`

Responsável pela estrutura da aplicação e pelos componentes da interface.

Inclui:

* Sidebar;
* Dashboard;
* Clientes;
* Banco de dados;
* Relatórios;
* Modais;
* Tabelas;
* Barra de pesquisa;
* Notificações.

O título principal da aplicação é:

```text
DataCore — Painel de Banco de Dados
```

### `style.css`

Responsável pelo design visual da aplicação.

Contém:

* Variáveis de estilo;
* Cores;
* Tipografia;
* Layout;
* Cards;
* Tabelas;
* Botões;
* Sidebar;
* Responsividade;
* Tema claro;
* Tema escuro;
* Animações.

### `script.js`

Responsável pela lógica e interatividade do sistema.

Entre suas responsabilidades estão:

* Gerenciamento de clientes;
* CRUD;
* LocalStorage;
* Logs;
* Dashboard;
* Relatórios;
* Pesquisa;
* Filtros;
* Paginação;
* Exportação CSV;
* Notificações;
* Tema claro/escuro.

---

# ⚙️ Como executar

Não é necessário instalar dependências.

### 1. Baixe ou clone o projeto

```bash
git clone SEU-REPOSITORIO
```

### 2. Entre na pasta

```bash
cd DataCore
```

### 3. Abra o projeto

Abra o arquivo:

```text
index.html
```

diretamente no navegador.

Também é possível utilizar uma extensão como **Live Server** no Visual Studio Code para executar o projeto localmente.

---

# 🧪 Fluxo de utilização

O fluxo básico do sistema é:

```text
Dashboard
    │
    ├── Clientes
    │      ├── Adicionar
    │      ├── Editar
    │      ├── Excluir
    │      ├── Pesquisar
    │      └── Filtrar
    │
    ├── Banco de dados
    │      ├── Clientes
    │      ├── Relatórios
    │      └── Logs
    │
    └── Relatórios
           └── Exportar CSV
```

---

# 🔄 Fluxo de dados

Quando um cliente é cadastrado:

```text
Usuário
   ↓
Formulário
   ↓
Validação
   ↓
Novo registro
   ↓
LocalStorage
   ↓
Log da atividade
   ↓
Atualização do Dashboard
```

Quando um cliente é editado:

```text
Usuário
   ↓
Editar registro
   ↓
Atualizar dados
   ↓
LocalStorage
   ↓
Registrar Log
   ↓
Atualizar interface
```

Quando um cliente é excluído:

```text
Usuário
   ↓
Excluir
   ↓
Confirmação
   ↓
Remover registro
   ↓
Registrar Log
   ↓
LocalStorage
   ↓
Atualizar sistema
```

---

# 🛠️ Tecnologias

| Tecnologia   | Utilização                      |
| ------------ | ------------------------------- |
| HTML5        | Estrutura da aplicação          |
| CSS3         | Interface e responsividade      |
| JavaScript   | Lógica e funcionalidades        |
| LocalStorage | Persistência local              |
| JSON         | Estrutura dos dados armazenados |
| SVG          | Ícones e gráficos               |
| CSV          | Exportação de dados             |

---

# 🚧 Limitações atuais

Por utilizar armazenamento local, esta versão possui algumas limitações:

* Os dados não são compartilhados entre diferentes computadores;
* Não existe servidor backend;
* Não existe autenticação real;
* Não existe banco SQL;
* Não existe API;
* Não existe sistema de usuários real;
* Os dados dependem do armazenamento do navegador.

As opções **Configurações** e **Segurança** também estão indicadas como funcionalidades em construção na interface atual.

---

# 🚀 Próximas evoluções

Uma evolução natural do projeto seria transformar o protótipo em uma aplicação full-stack.

### Backend

Adicionar uma API utilizando, por exemplo:

```text
Node.js + Express
```

### Banco de dados

Migrar o armazenamento do LocalStorage para:

```text
MySQL
```

ou:

```text
PostgreSQL
```

### Autenticação

Implementar:

* Login;
* Senha;
* Controle de sessão;
* Permissões;
* Administradores;
* Usuários comuns.

### API

Estruturar endpoints como:

```http
GET    /api/clientes
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id
GET    /api/logs
GET    /api/relatorios
```

Dessa forma, o DataCore poderia deixar de ser apenas uma aplicação front-end e se tornar um **sistema completo de gerenciamento de banco de dados**.

---

# 👨‍💻 Autor

**Kaique Dias**

Estudante de Análise e Desenvolvimento de Sistemas (ADS), com interesse em desenvolvimento web, criação de sistemas, prototipação e tecnologias de desenvolvimento.

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos, educacionais e de demonstração.

---

<p align="center">
  <strong>DataCore</strong> — Gerenciamento de dados de forma simples, organizada e moderna.
</p>
