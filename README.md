# Vest.io

Site estatico para acompanhar desempenho em simulados e provas antigas.

## Painel pessoal de performance

A versao atual separa Inicio, Registros e Caderno. Permite cadastrar, editar e excluir provas, acompanhar graficos, definir uma meta pessoal e organizar notas em um canvas por vestibular.

Sem Supabase configurado, os dados ficam salvos no navegador pelo `localStorage`.
Com Supabase configurado, cada usuario entra na propria conta e sincroniza provas, observacoes, notas do caderno, posicoes do canvas e meta pessoal.

A meta comeca vazia e e definida pelo proprio usuario.

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
