LEI022 - Laboratório de Desenvolvimento de Software (TP1 & TP2)

Descrição

Este projeto consiste no desenvolvimento de uma API REST (TP1) integrada com uma solução de comunicação alternativa orientada a eventos/APIs (TP2 - Opção A: GraphQL), utilizando Node.js e Express.

A API disponibiliza operações para gerir items, livros e clientes via REST, bem como um endpoint flexível em GraphQL centrado no domínio de livros.

Tecnologias utilizadas

Node.js

Express.js

GraphQL (graphql-http, graphql)

JavaScript

Postman / Insomnia

Requisitos

Para executar o projeto é necessário ter instalado:

Node.js (versão LTS)

npm

Postman ou Insomnia

Instalação

Entrar na pasta backend do projeto:

cd backend


Instalar as dependências:

npm install


Execução

Para iniciar o servidor:

node server.js


Quando o servidor estiver a funcionar, será apresentada a mensagem:

API a executar em http://localhost:3000


A API REST fica disponível em http://localhost:3000/api/... e o endpoint GraphQL em http://localhost:3000/graphql.

Endpoints REST (TP1)

Items

GET /api/items (suporta filtros por name, ordenação sort/order e paginação page/limit)

GET /api/items/:id

POST /api/items

PUT /api/items/:id

DELETE /api/items/:id

Livros (Recursos Adicionais)

GET /api/livros

GET /api/livros/:id

POST /api/livros (com validação de estados permitidos: disponivel, emprestado, avariado, e conflito 409 para títulos duplicados)

PUT /api/livros/:id

DELETE /api/livros/:id

Clientes

GET /api/clientes

Comunicação Alternativa - TP2: Opção A (GraphQL)

O projeto inclui um endpoint GraphQL integrado em /graphql que reutiliza o domínio de livros.

Schema e Operações Disponíveis

Queries:

livros(estado: Estado): [Livro!]! — Permite consultar todos os livros ou filtrar opcionalmente por estado.

livro(id: Int!): Livro — Obtém um livro específico pelo ID.

Mutations:

createLivro(titulo: String!, autor: String!, estado: Estado!): Livro! — Cria um novo livro com validações e regra de conflito por título duplicado.

updateLivro(id: Int!, titulo: String!, autor: String!, estado: Estado!): Livro! — Atualiza um livro existente.

Exemplos de Utilização (GraphQL)

Consultar dados selecionando apenas campos específicos (Query):

{
  "query": "{ livros { id titulo } }"
}


Criar um livro (Mutation):

{
  "query": "mutation { createLivro(titulo: \"Clean Code\", autor: \"Robert Martin\", estado: disponivel) { id titulo criadoEm } }"
}


Comparação e Justificação Técnica (REST vs GraphQL)

Conforme exigido no TP2, apresenta-se uma breve comparação entre a abordagem REST implementada no TP1 e a tecnologia GraphQL adicionada no TP2:

Padrão de comunicação e direção do fluxo: O REST baseia-se em múltiplos endpoints fixos mapeados para recursos com verbos HTTP (GET, POST, PUT, DELETE) num modelo tradicional de pedido/resposta unidirecional. O GraphQL utiliza um endpoint único (/graphql) onde o cliente envia queries ou mutations especificando exatamente a estrutura e os campos que pretende receber.

Adequação ao requisito: O GraphQL é altamente adequado para cenários onde diferentes clientes (web, mobile) necessitam de flexibilidade na obtenção de dados, evitando o over-fetching (receber campos desnecessários) ou under-fetching (necessidade de múltiplos pedidos a vários endpoints).

Complexidade de implementação e operação: O REST apresenta uma implementação mais direta e standard com o Express. O GraphQL exige a definição prévia de um esquema formal (schema.graphql) e a implementação de resolvers, elevando ligeiramente a complexidade inicial.

Tratamento de erros e validações: No REST, os erros são rigidamente mapeados para códigos de estado HTTP (ex: 400, 404, 409) com o formato RFC 9457 (application/problem+json). No GraphQL, os pedidos HTTP respondem frequentemente com 200 OK, encapsulando os erros num bloco específico de extensões (extensions: { code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_USER_INPUT' }).

Vantagem principal: Flexibilidade total na seleção de campos por parte do cliente num único pedido ao servidor.

Desvantagem principal: Maior complexidade na gestão de cache ao nível do HTTP e na monitorização de erros baseada estritamente em códigos de estado.

Tratamento de erros

A API utiliza códigos de estado HTTP e o formato application/problem+json para o REST, e extensões personalizadas para o GraphQL.
Os principais códigos incluem 200, 201, 204, 400, 404 e 409.

Testes e Evidências

Os testes da API REST e do endpoint GraphQL foram validados utilizando ferramentas como o Postman/Insomnia. Os ficheiros e coleções de teste encontram-se na pasta tests/.

Estrutura do projeto

lei022-tp1-Afonso-Coelho/
│
├── backend/
│   ├── server.js
│   ├── graphql.js
│   ├── schema.graphql
│   ├── package.json
│   └── package-lock.json
│
├── tests/
│
└── README.md


Declaração de utilização de Inteligência Artificial

Durante o desenvolvimento deste trabalho foi utilizada Inteligência Artificial como ferramenta de apoio.

A IA foi utilizada principalmente para esclarecimento de dúvidas, compreensão de conceitos, identificação e correção de erros no código e apoio na organização da documentação do projeto.

A implementação, testes, validação dos resultados e decisões finais relativas ao projeto foram realizadas pelo aluno, tendo o código sido analisado e adaptado de acordo com os requisitos do trabalho.