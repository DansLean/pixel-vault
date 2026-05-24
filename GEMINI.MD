# Pixel Vault: Documentação do Projeto

## 1. Conceito do Projeto

Este projeto é a Prova de Conceito (POC) do frontend para o "Pixel Vault", um marketplace de assets para desenvolvedores de jogos independentes. O objetivo principal é oferecer um catálogo centralizado de assets onde as permissões de licença são apresentadas de forma clara e de fácil compreensão, resolvendo um problema central para desenvolvedores indie.

## 2. Arquitetura e Tecnologias

*   **Framework**: Next.js com App Router e Turbopack.
*   **Linguagem**: TypeScript.
*   **Estilização**: CSS-in-JS (inline styles) e variáveis de CSS em `app/globals.css`.
*   **Gerenciamento de Estado Global**: O estado da sessão do usuário é gerenciado pelo `AuthContext` (`contexts/AuthContext.tsx`), que persiste os dados no `localStorage`.
*   **Fonte de Dados**: A aplicação está **majoritariamente integrada** com um backend real (Python/FastAPI em `http://localhost:5000`). Apenas funcionalidades menores, como o carrossel de banners, ainda utilizam dados mockados. O estado do carrinho de compras também permanece inteiramente no lado do cliente.
*   **Gerenciamento de Estado de UI (Filtros)**: O estado dos filtros da página inicial é gerenciado via **parâmetros de consulta na URL**, permitindo que as buscas sejam compartilháveis e linkáveis.

## 3. Funcionalidades Implementadas

### 3.1. Fluxo de Autenticação Real
O sistema de login, antes simulado, agora é totalmente funcional e integrado com a API.

*   **API de Login**: A função `loginUser` em `services/api.ts` foi implementada para se comunicar com o endpoint `POST /user/login`.
*   **`AuthContext` Refatorado**: O contexto agora armazena o objeto de usuário (`UserRead`) completo no estado e no `localStorage`, em vez de um ID simulado. Ele também busca os tipos de usuário (`user_types`) da API para determinar permissões.
*   **Página de Login**: A página `/login` agora é um formulário controlado que captura email e senha, chama a API de login e, em caso de sucesso, atualiza o `AuthContext` com os dados do usuário, redirecionando-o para a home.
*   **Navbar Dinâmica**: A barra de navegação foi refatorada para:
    *   Exibir "Olá, [nome do usuário]!" e um botão "Sair" funcional quando o usuário está logado.
    *   Renderizar condicionalmente o botão "Adicionar Asset" apenas se o tipo de usuário logado for `VENDOR` ou `BUYER/VENDOR` (lógica controlada pela flag `canSell` no `AuthContext`).

### 3.2. Listagem e Filtro de Assets
A página inicial agora possui um sistema de filtro dinâmico e robusto.

*   **Fonte da Verdade na URL**: O estado dos filtros (busca por título, categoria, preço) é armazenado diretamente nos parâmetros da URL (ex: `/?title=sword&category_id=3`). Isso garante que o estado da UI seja consistente e compartilhável.
*   **Busca Centralizada na Navbar**: A barra de pesquisa na `Navbar` é agora a única fonte para a busca por texto. Ela atualiza o parâmetro `title` na URL com um *debounce* de 500ms para evitar requisições excessivas.
*   **`FilterBar` Controlada**: Os dropdowns de Categoria e Preço na `FilterBar` também atualizam os parâmetros da URL (`category_id`, `price_min`, `price_max`), disparando uma nova busca de produtos. O layout do componente também foi ajustado para melhor alinhamento.
*   **Feedback de UI**: Quando uma busca ou filtro não retorna nenhum resultado, a página exibe uma mensagem informativa para o usuário (ex: "Nenhum resultado encontrado para 'espada' na categoria 'Armas'").
*   **Paginação Removida**: O botão "Carregar Mais", que existia anteriormente, foi removido. A paginação pode ser reimplementada futuramente através dos parâmetros `page` e `page_size` da API.

### 3.3. Criação e Edição de Assets (`/vender`)
A página de criação de assets foi implementada e é funcional.

*   **Upload de Imagens**: Foi adicionada a funcionalidade de upload de imagens. O sistema permite múltiplas imagens, seleção de capa e remoção. As imagens são convertidas para **base64** e enviadas para a API junto com os outros dados do asset, sem a necessidade de bibliotecas externas (`react-dropzone` foi removido).

### 3.4. Correções de Bugs e Refinamentos

*   **Página de Favoritos (`/favoritos`)**: A página, que estava quebrada por usar dados mockados, foi completamente corrigida. Agora, ela busca os dados da API `getAssetFeed` e filtra os produtos onde `is_favorite` é verdadeiro, exibindo a lista de favoritos real do usuário.
*   **Botão "Adicionar ao Carrinho"**: O bug que fazia o botão nos cards de produto não funcionar foi corrigido. O problema não era no botão, mas na página `/carrinho`, que lia dados mockados. A página foi refatorada para buscar os detalhes dos produtos da API, filtrando-os com base nos IDs armazenados localmente no carrinho.
*   **Sistema de Avaliações (`/produto/[id]`)**: A funcionalidade foi implementada por completo. A função `createReview` foi adicionada à `services/api.ts` e o `ReviewForm` foi conectado a ela, permitindo que usuários logados publiquem avaliações. A lista de avaliações é atualizada automaticamente após a publicação.
*   **Detalhes de Arquivo Removidos**: A seção "Detalhes do arquivo" no `PurchaseCard` foi removida, pois a API não fornece essas informações (`formato`, `tamanho`, etc.), limpando a interface.
*   **Estabilidade do Ambiente**: Uma série de problemas de build relacionados a dependências e configurações (`next.config`, `postcss.config`) foram resolvidos. O `postcss.config.mjs` foi removido em favor da configuração automática do Next.js.

## 4. Regras de Negócio e Notas Técnicas

1.  **Ordenação Fixa**: O backend ordena os resultados por "Mais Recentes" de forma fixa. O dropdown de ordenação na `FilterBar` é apenas um elemento visual no momento.
2.  **Carrinho Client-Side**: A funcionalidade do carrinho (adição e remoção de IDs) permanece inteiramente no lado do cliente, usando `localStorage`. Apenas a exibição dos detalhes dos produtos no carrinho foi conectada à API. A integração completa com o backend foi adiada por falta de endpoints na API.
3.  **Filtragem de Categoria**: A API aceita apenas um `category_id` por vez e não é recursiva (filtrar por uma categoria pai não inclui os filhos).
4.  **Autenticação**: O `AuthContext` é a fonte da verdade para o estado do usuário. Ele se hidrata a partir do `localStorage` no lado do cliente para evitar erros de SSR.
