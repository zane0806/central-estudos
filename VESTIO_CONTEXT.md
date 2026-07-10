# Vest.io / Z.Vest - contexto do projeto

Use este arquivo como contexto fixo do Projeto `Vest.io`.

## Identidade

- Nome visual atual do site: `Z.Vest`.
- Repositorio GitHub: `zane0806/central-estudos`.
- Site publicado: `https://zane0806.github.io/central-estudos/`.
- Projeto local: `C:\Users\Gabriel\Documents\Codex\2026-07-03\cria-um-novo-site-em-um\central-estudos`.
- Objetivo: painel pessoal para registrar provas/simulados, acompanhar evolucao, ver graficos e comparar desempenho por vestibular.

## Stack

- Site estatico puro: `index.html`, `styles.css`, `app.js`.
- Sem build, sem npm e sem backend proprio.
- Publicacao via GitHub Pages por GitHub Actions em `.github/workflows/pages.yml`.
- Banco/login: Supabase Auth + Postgres com Row Level Security.
- Armazenamento local de fallback: `localStorage`.

## Deploy

- Branch principal: `main`.
- Workflow: `Deploy Pages`.
- O workflow copia para `dist`: `index.html`, `app.js`, `styles.css`, `README.md`, `supabase-config.js`, `supabase-schema.sql`, `.nojekyll` e `assets/`.
- Para publicar: commit em `main` e `git push`.
- Depois conferir `https://zane0806.github.io/central-estudos/`.
- Quando alterar CSS ou JS, atualizar a query string no `index.html` para evitar cache no celular, por exemplo `styles.css?v=20260706-7`.

## Supabase

- Project URL atual: `https://ieswpivdpwgcvzifmlkx.supabase.co`.
- Publishable key atual esta em `supabase-config.js`.
- Tabelas:
  - `public.exam_records`
  - `public.board_note_records`
- Schema esta em `supabase-schema.sql`.
- RLS esta ativado. Cada usuario autenticado so pode selecionar/inserir/alterar/deletar as proprias linhas com `auth.uid() = user_id`.
- O site usa login por email/senha do Supabase.
- A sessao fica persistida no navegador, entao nao precisa logar toda vez.
- Dados do usuario nao devem ser colocados em seed publico no `app.js`.
- Importante: houve um momento anterior em que dados pessoais foram restaurados no Supabase diretamente; nao reintroduzir esses dados no codigo publico.

## Privacidade e dados

- O site em si e publico porque esta no GitHub Pages.
- Os dados privados ficam protegidos pelo Supabase/RLS.
- Amigos podem acessar o site, criar/login na propria conta e preencher os proprios dados.
- Eles nao devem ver os dados do Gabriel, desde que estejam em outra conta e as politicas RLS continuem corretas.
- Nunca colocar dumps reais de notas pessoais em arquivos versionados do repo.

## Interface atual

- Hero/topo usa uma obra de arte em `assets/hero.jpg`.
- Titulo do hero: `Z.Vest`.
- Enquadramento atual da imagem: `url("./assets/hero.jpg") center 36% / cover`, para mostrar um pouco do rosto do homem e o livro.
- O botao de sincronizar virou um icone circular no canto superior direito da obra.
- O icone sincroniza todos os vestibulares e gira enquanto carrega.
- A animacao atual gira no sentido inverso: `rotate(-360deg)`.
- Existe modo claro/escuro.
- Existe seletor de vestibular: ENEM, UNESP, FAMEMA, FAMERP, UNIFESP.
- Existe painel de login/sessao chamado `Sincronizacao`.
- O botao antigo `Sincronizar` foi removido do painel de baixo.

## Vestibulares e regras

### ENEM

- Total: 180.
- Meta principal historica: 92%, equivalente a 166/180.
- Areas:
  - Humanas: 45
  - Linguagens: 45
  - Matematica: 45
  - Natureza: 45

### UNESP

- Total: 90.
- A primeira fase deve totalizar:
  - Linguagens: 30
  - Humanas: 30
  - Natureza + Matematica: 30
- O site mostra por disciplina, nao agrupado por area.
- Distribuicao atual no app:
  - Portugues: 10
  - Literatura: 8
  - Artes: 2
  - Ingles: 10
  - Historia: 10
  - Geografia: 10
  - Filo/Socio: 10
  - Biologia: 8
  - Quimica: 7
  - Fisica: 7
  - Matematica: 8
- Observacao historica: `Finalnes 2021`/UNESP 2021 foi corrigida para totalizar 13 erros, isto e, 77/90.

### FAMEMA

- Total objetivo principal: 40 questoes objetivas.
- Discursivas de Quimica e Biologia valem 4 + 4, mas nao entram no total de 40.
- O site deve ter duas contagens:
  - objetiva ate 40;
  - discursiva ate 8 separada.

### FAMERP

- Total: 80.
- Por disciplina:
  - Portugues, Ingles, Historia, Geografia, Biologia, Quimica, Fisica, Matematica.
  - Cada uma com maximo 10.

### UNIFESP

- Deve converter para nota de 0 a 100.
- Dia 1: Portugues + Ingles, total de 25.
  - Exemplo: 20/25 vira 80/100.
- Dia 2: Biologia, Quimica, Fisica, Matematica, total de 20.
  - Cada disciplina pode receber decimal de 0 a 5.
  - Exemplo: 17/20 vira 85/100.
- Media exibida como media dos dias convertidos.
- Inputs precisam aceitar numeros quebrados/decimais.

## Graficos e visualizacoes

- Grafico principal: evolucao por prova.
- Card lateral: `Mapa de cada prova`, em formato carrossel/rolagem vertical.
- O mapa tem alternancia entre:
  - acertos;
  - erros.
- O controle e um switch visual discreto, com texto `acertos/erros` acima.
- Verde/ativado = acertos.
- Vermelho/desativado = erros.
- No modo acertos, a barra e proporcional ao maximo da disciplina.
- No modo erros, a barra e proporcional ao numero absoluto de erros dentro da prova.
  - Exemplo: 2 erros deve ser o dobro de 1 erro, independentemente do maximo da disciplina.
- No modo erros, nao mostrar denominador como `4/10`; mostrar so `4`.

## Observacoes por vestibular

- A antiga secao `Metas por bloco` foi substituida por uma area de observacoes gerais por vestibular.
- As observacoes podem ser salvas.
- Devem aparecer em formato de carrossel/area equivalente ao antigo `Mapa de cada prova`.
- Observacoes tambem sincronizam com Supabase na tabela `board_note_records`.

## Estado de dados

- Dados locais ficam em chaves `localStorage` com prefixo `central-estudos`.
- Principais chaves:
  - `central-estudos.board.v2`
  - `central-estudos.active-board.v1`
  - `central-estudos.board-notes.v1`
  - `central-estudos.theme.v1`
  - `central-estudos.map-mode.v1`
- Se Supabase estiver configurado e o usuario estiver logado, o site sincroniza dados entre celular e PC.
- Se nao estiver logado, o site salva apenas localmente naquele navegador.

## Cuidados tecnicos

- Antes de editar, verificar `git status --short`.
- Nao usar `git reset --hard` nem reverter alteracoes do usuario sem pedido explicito.
- Usar `apply_patch` para editar arquivos.
- Rodar `node --check app.js` quando mexer em JS.
- Rodar `git diff --check` antes de commit.
- Ao publicar, usar o Git embutido do Codex se `git` nao estiver no PATH.
- A rede do sandbox costuma bloquear GitHub; pode ser necessario pedir permissao para `git push` e para verificar Pages.

## Identidade visual atual (10/07/2026)

- Nome oficial: `Vest.io`.
- Dark mode e o padrao; light mode continua disponivel pelo botao no hero.
- Direcao visual editorial e tecnologica, inspirada sem copia em LABASAD, Oryzo e Units.
- Tipografia:
  - `Bebas Neue` para titulos e numeros de impacto;
  - `Archivo` para interface, formularios e textos.
- Hero usa `assets/hero.jpg` em tela cheia, texto branco direto sobre a imagem e meta de 92% em destaque.
- Interface usa grade reta, divisorias finas, pouco arredondamento e vermelho como cor de assinatura.
- Responsividade revisada em desktop e celular (375 px), sem overflow horizontal da pagina.

## Historico recente de mudancas

- `7e9e352`: inversao do sentido de rotacao do icone de sync.
- `1b1a067`: botao de sync virou icone no hero.
- `ddceb88`: titulo atualizado para `Z.Vest` e enquadramento da obra ajustado.
- `df7b9b9`: switch do mapa reduzido e levemente transparente.
- `2b029d9`: barras de erro proporcionais ao numero absoluto de erros.
- `c6f1742`: alternancia acertos/erros no mapa.
- `9ac7ea8`: configuracao do Supabase.
- `fe09c36`: login/sync com Supabase.

## Prompt curto para iniciar um novo chat no Projeto Vest.io

Continue o projeto `Vest.io` (`central-estudos`) no repo local:

`C:\Users\Gabriel\Documents\Vest.io\central-estudos`

Site publicado:

`https://zane0806.github.io/central-estudos/`

Leia primeiro `VESTIO_CONTEXT.md`, depois confira `git status --short`. O site e um dashboard estatico com GitHub Pages + Supabase. Preserve os dados privados no Supabase/RLS e nao coloque notas pessoais em seed publico.
