# report

## Error al importar prisma client

```bash
Node.js v24.14.1
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
◇ injected env (3) from .env // tip: ⌘ suppress logs { quiet: true }
node:internal/modules/cjs/loader:1459
  throw err;
  ^

Error: Cannot find module '.prisma/client/default'
Require stack:
- /media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/node_modules/@prisma/client/default.js
- /media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/controllers/CategoryController.js
- /media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/routes/CategoryRoutes.js
- /media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1456:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1066:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1071:22)
    at Module._load (node:internal/modules/cjs/loader:1242:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.require (node:internal/modules/cjs/loader:1556:12)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1812:14)
    at Object..js (node:internal/modules/cjs/loader:1943:10) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/node_modules/@prisma/client/default.js',
    '/media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/controllers/CategoryController.js',
    '/media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/routes/CategoryRoutes.js',
    '/media/aaroncafdez/aaroncanodisk/2nDAW/ProjecteFinal/metari/backend/index.js'
  ]
}
```



