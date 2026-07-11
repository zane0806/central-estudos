# Vest.io - contexto do projeto

Use este arquivo como contexto fixo do Projeto `Vest.io`.

## Identidade

- Nome visual atual do site: `Vest.io`.
- Repositorio GitHub: `zane0806/central-estudos`.
- Site publicado: `https://zane0806.github.io/central-estudos/`.
- Projeto local: `C:\Users\Gabriel\Documents\Vest.io\central-estudos`.
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
  - `public.essay_records`
  - `public.board_canvas_records`
  - `public.user_settings`
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
- Titulo do hero: `Vest.io`.
- Enquadramento atual da imagem: `url("./assets/hero.jpg") center 36% / cover`, para mostrar um pouco do rosto do homem e o livro.
- O cabecalho e fixo em todas as telas e contem navegacao para Inicio, Registros e Caderno, tema e sincronizacao.
- A landing/Inicio e isolada: nao e possivel chegar aos registros apenas rolando; e necessario usar um botao ou icone de navegacao.
- O botao de sincronizar fica no cabecalho. Deslogado, abre o modal privado; logado, sincroniza diretamente.
- O icone sincroniza todos os vestibulares e gira enquanto carrega.
- A animacao atual gira no sentido inverso: `rotate(-360deg)`.
- Existe modo claro/escuro; o icone alterna visualmente entre lua e sol.
- Existe seletor de vestibular: ENEM, UNESP, FAMEMA, FAMERP, UNIFESP.
- O login fica em modal e nao ocupa espaco permanente para usuarios conectados.
- A meta de acertos e configuravel, inicia vazia e fica em `localStorage` e em `user_settings` quando ha conta.
- A meta alimenta os status, o total-alvo e a linha verde do grafico.
- O Caderno e uma tela separada com canvas quadriculado e notas arrastaveis por vestibular.
- Notas do Caderno aceitam cor, tamanho de fonte, negrito e sublinhado.
- O canvas permite ligar cards com fios e desenhar livremente em modo caneta.
- Fios e tracos ficam em `board_canvas_records` como estado vetorial JSON privado por usuario/vestibular.
- Posicoes das notas usam `position_x` e `position_y` em `board_note_records`.
- A secao de redacao registra tema, nota e observacao, com escalas ENEM 1000, UNESP 28, FAMEMA 11, FAMERP 20 e UNIFESP 50.

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
  - `central-estudos.target-percent.v1`
  - `central-estudos.essay-records.v1.<vestibular>`
  - `central-estudos.canvas-state.v1.<vestibular>`
- O Caderno tambem possui uma mesa `GERAL`, sem vinculo com vestibular, salva sob o id `general`.
- Cards do canvas aceitam cor, tipografia, checklist, redimensionamento, conexoes e posicionamento livre.
- As conexoes sao criadas arrastando o ponto lateral de um card ate outro; nao ha botao nem modo separado de conexao.
- Um card e criado com duplo clique ou dois toques rapidos diretamente na grade; nao existe mais formulario lateral.
- O texto e editado dentro do proprio card, e o lapis no cabecalho abre cor, tamanho (10-48 px), negrito, sublinhado e checklist com pre-visualizacao imediata.
- O fundo da mesa pode ser arrastado com mouse ou toque para navegar pelo canvas ampliado.
- A instrucao de duplo clique possui um botao de fechar protegido do gesto de arrastar a mesa e, depois de dispensada, fica oculta permanentemente em todas as mesas pelo `localStorage` global; em `file://`, ela ainda fecha mesmo se o navegador bloquear o storage.
- A mesa aceita caneta e setas livres com uma paleta predefinida; o estado sincronizado inclui `links`, `strokes` e `arrows`.
- Caneta e setas sao renderizadas em uma camada acima dos cards; as conexoes permanecem abaixo deles.
- A animacao de entrada usa um identificador efemero e afeta somente o card recem-criado.
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
- Hero usa `assets/hero.jpg` em tela cheia, texto branco direto sobre a imagem e meta configuravel em destaque.
- O kicker atual do hero e `ANALISE SEUS RESULTADOS // AGORA MAIS AESTHETIC`; o antigo paragrafo descritivo foi removido.
- Interface usa grade reta, divisorias finas, pouco arredondamento e vermelho como cor de assinatura.
- Responsividade revisada em desktop e celular (375 px), sem overflow horizontal da pagina.
- A pagina inicial nao exibe os atalhos de navegacao do cabecalho; eles aparecem somente nas areas internas.
- O grafico ENEM por disciplina ajusta o limite inferior do eixo aos resultados registrados, mantendo a escala maxima de 45.

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
