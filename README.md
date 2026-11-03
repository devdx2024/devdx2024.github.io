# Notas Offline — exemplo de PWA

Exemplo em HTML, CSS e JavaScript puro (sem TypeScript e sem bibliotecas).

## Executar localmente

Service Workers exigem contexto seguro: use HTTPS ou `localhost`.

Com Node.js instalado, dentro desta pasta execute:

```bash
npx http-server -p 8080
```

Ou use outro servidor HTTP local. Abra `http://localhost:8080`.

## Testar offline

1. Abra online e aguarde o Service Worker instalar (recarregue uma vez se necessário).
2. Crie algumas anotações.
3. No DevTools, use Network > Offline, ou desligue a conexão.
4. Recarregue: a interface deve abrir e as notas continuam no IndexedDB do mesmo navegador/origem.

## Instalar no celular

Publique os arquivos em um endereço HTTPS. No Android, use a opção de instalar/adicionar à tela inicial do navegador. No iPhone/iPad, abra no Safari, toque em Compartilhar > Adicionar à Tela de Início.

## Limitações desta demonstração

- As anotações ficam somente neste dispositivo e nesta origem; não há servidor nem sincronização.
- Limpar dados do navegador pode apagar as anotações.
- A estratégia de cache é didática. Em produção, revise atualizações, tratamento de erros, cache de navegação e compatibilidade.
- O navegador pode remover dados sob pressão de armazenamento. Não use este exemplo como único armazenamento de dados importantes.
