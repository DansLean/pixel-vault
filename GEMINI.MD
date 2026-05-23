# Pixel Vault: Documentação do Projeto

## 1. Conceito do Projeto

Este projeto é a Prova de Conceito (POC) do frontend para o "Pixel Vault", um marketplace de assets para desenvolvedores de jogos independentes. A concepção do projeto, detalhada em um artigo acadêmico, visa resolver um problema central para desenvolvedores indie: a fragmentação de assets em diversas plataformas e, mais importante, a ambiguidade e complexidade das licenças de uso.

O objetivo principal é oferecer um catálogo centralizado de assets onde as permissões de licença (uso comercial, modificação, atribuição, etc.) são apresentadas de forma visualmente clara e de fácil compreensão.

## 2. Arquitetura e Tecnologias

*   **Framework**: Next.js com App Router.
*   **Linguagem**: TypeScript.
*   **Estilização**: CSS-in-JS (inline styles) utilizando variáveis de CSS definidas em `app/globals.css` para manter um tema consistente.
*   **Gerenciamento de Estado Global**: O estado da UI, como status de login e itens no carrinho, é gerenciado via Contexto React (`contexts/AuthContext.tsx`) e persistido no `localStorage`.
*   **Fonte de Dados**: O projeto está em um **estado de transição**. Originalmente usando apenas dados mockados (`lib/mock-data.ts`), agora ele se comunica com um backend real (Python/FastAPI em `http://localhost:5000`) para funcionalidades-chave, enquanto outras partes ainda dependem dos dados antigos.

## 3. Estado da Integração com a API

A aplicação está parcialmente integrada com o backend. Abaixo está o detalhamento do que está e não está conectado.

### 3.1. Funcionalidades Conectadas à API

*   **Listagem de Produtos na Home (`/`)**: A página principal agora busca e exibe os produtos dinamicamente através da função `getAssetFeed` do serviço `services/api.ts`.
*   **Sistema de Favoritos (Ação de Favoritar)**: A ação de favoritar/desfavoritar um produto no `ProductCard` foi refatorada. Ela agora utiliza as funções `addFavorite` e `removeFavorite` da API, persistindo o estado de favoritos diretamente no backend para o usuário logado.

### 3.2. Funcionalidades que AINDA USAM Dados Mockados

*   **Página de Detalhes do Produto (`/produto/[id]`)**: Esta página **não é dinâmica**. Ela ignora o `id` da URL e sempre exibe os dados do objeto `PRODUCT_DETAIL` do arquivo `lib/mock-data.ts`.
*   **Página de Favoritos (`/favoritos`)**: Esta página **está funcionalmente quebrada**. Ela tenta filtrar a lista de `PRODUCTS` mockados usando um estado de `favorites` que não existe mais no `AuthContext`, pois a lógica foi movida para o backend. A página precisa ser reconstruída para buscar os dados da API.
*   **Sistema de Carrinho de Compras (`/carrinho`)**: Toda a lógica do carrinho (adicionar, remover, exibir) é puramente client-side, gerenciada pelo `AuthContext` e `localStorage`, e opera sobre o array de `PRODUCTS` mockado.
*   **Carrossel de Banners (`BannerCarousel.tsx`)**: O conteúdo dos banners é estático e vem da variável `BANNERS` do arquivo de mock.

### 3.3. Fluxo de Autenticação (Simulado)

O fluxo de autenticação permanece o mesmo: um sistema simulado que armazena o estado `isLoggedIn` e um `userId` fixo no `localStorage` para permitir o uso de funcionalidades que dependem de um usuário, como o sistema de favoritos conectado à API.

*   **`AuthContext.tsx`**: Provê o estado `isLoggedIn`, `userId`, e as funções `login()` e `logout()`.
*   **`/login`**: A página chama `login()` e redireciona para a home.

## 4. Notas Técnicas e Correções

*   **Refatoração do `AuthContext`**: O contexto foi modificado para gerenciar o `userId` e para que a função `toggleFavorite` realize chamadas de API, em vez de manipular um array local. A gestão do `cart` permanece no `localStorage`.
*   **Parâmetros Dinâmicos (Next.js)**: A página de produto (`/produto/[id]`) usa `React.use(params)` para resolver o ID da URL, embora o ID ainda não seja usado para buscar dados da API.
*   **Refatoração de Componentes**: O `ProductGrid.tsx` foi refatorado para aceitar uma lista de produtos como `prop`, tornando-o reutilizável nas páginas da home (com dados da API) e de favoritos/carrinho (com dados mockados).

## 5. Regras de Colaboração

1.  **Permissão para Alterações:** Sempre pedirei sua permissão antes de fazer qualquer modificação nos arquivos do projeto.
2.  **Atualização do GEMINI.MD:** Após qualquer alteração na implementação do código, atualizarei este arquivo para refletir o estado atual do projeto, garantindo que tenhamos um ponto de partida claro para sessões futuras.
3.  **Postura Profissional:** Atuarei como um desenvolvedor sênior com mais de 10 anos de experiência, focando em soluções de alta qualidade que sejam eficazes e elegantes, sem complexidade desnecessária.
