# central-estudos

Site estatico para acompanhar desempenho em simulados e provas antigas.

## zane's performance

A versao atual permite cadastrar, editar, excluir, importar e exportar provas direto pelo site.

Sem Supabase configurado, os dados ficam salvos no navegador pelo `localStorage`.
Com Supabase configurado, cada usuario entra na propria conta e sincroniza as provas/observacoes online.

Meta principal: 92% de acertos, ou 166 de 180 questoes.

## Supabase

1. Crie um projeto no Supabase.
2. Rode o arquivo `supabase-schema.sql` no SQL Editor.
3. Copie a Project URL e a anon/publishable key.
4. Preencha `supabase-config.js`:

```js
window.ZAN_SUPABASE_CONFIG = {
  url: "https://seu-projeto.supabase.co",
  anonKey: "sua-chave-publica"
};
```

O app usa Row Level Security: cada usuario autenticado so acessa as proprias linhas.
