# Vest.io / Z.Vest - proximas melhorias

## Prioridade alta

- Conferir visual no celular depois de cada ajuste de hero, switch, graficos e carrossel.
- Melhorar feedback de sync:
  - mostrar sucesso discreto depois do clique no icone;
  - mostrar erro amigavel se Supabase falhar;
  - evitar que o usuario ache que perdeu dados quando esta deslogado.
- Criar uma tela/estado claro para primeira vez:
  - explicar que dados locais so ficam naquele navegador;
  - incentivar login para sincronizar.
- [x] Revisar seeds publicas e garantir que nenhum dado privado do Gabriel esteja versionado.
  - Snapshots legados com notas reais removidos do repositorio em 09/07/2026.

## Provas e dados

- Revisar todas as distribuicoes de disciplina por vestibular com fonte oficial.
- Conferir UNESP 2021/Finalnes 2021 se novos dados forem informados.
- Melhorar entrada de dados para diferenciar claramente:
  - acertos;
  - erros;
  - nota convertida.
- Permitir importar/exportar por vestibular e tambem backup geral da conta.

## UX

- Ajustar microinteracoes do icone de sync.
- Melhorar carrossel/rolagem do `Mapa de cada prova` em telas pequenas.
- Criar visual mais claro para modo erros vs modo acertos.
- Melhorar tabela de provas registradas em mobile.
- Adicionar confirmacao mais bonita antes de excluir prova/observacao.

## Tecnico

- Considerar separar configuracoes de vestibular em um arquivo proprio.
- Considerar criar testes simples para calculos de total/conversao:
  - ENEM 180;
  - UNESP 90;
  - FAMEMA 40 + discursivas 8 separadas;
  - UNIFESP conversao dia 1/dia 2 para 0-100.
- Manter cache busting em `index.html` sempre que mudar CSS/JS.
- Revisar GitHub Actions se o deploy do Pages falhar com erro transitorio; normalmente reexecutar resolve.
