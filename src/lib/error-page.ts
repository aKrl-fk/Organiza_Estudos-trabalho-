export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Erro ao carregar página — Organiza Estudos</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #12172b; color: #f5f1ea; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; border-radius: 0.75rem; border: 1px solid rgba(139, 157, 195, 0.2); background: rgba(22, 27, 51, 0.7); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; font-weight: 600; color: #f5f1ea; }
      p { color: #8b9dc3; margin: 0 0 1.5rem; font-size: 0.95rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1.25rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; font-size: 0.875rem; transition: opacity 0.2s; }
      a:hover, button:hover { opacity: 0.9; }
      .primary { background: #c9a876; color: #12172b; font-weight: 500; border-color: #c9a876; }
      .secondary { background: transparent; color: #f5f1ea; border-color: rgba(139, 157, 195, 0.3); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Esta página não carregou</h1>
      <p>Ocorreu uma falha no servidor ao processar sua requisição. Tente atualizar ou voltar para o início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
