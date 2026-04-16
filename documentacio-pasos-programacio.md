
Documentacio dels pasos de programacio

# Backend

## Instal·lar prisma:
Instal·lem prisma cli per les dev dependencies (--save-dev)
```bash
npm install prisma --save-dev
```
Instal·lem prisma client per les dev dependencies

```bash
npm install @prisma/client
```

```bash
npx prisma init
```
aixo ens crea la carpeta de prisma i un arxiu de configuracio del prisma



Per generar package.json:
```bash
npm init -y
```



## Instal·lar  express:
```bash
npm install express
```

## Instal·lar nodemon:
Instal·lem nodemon per les dev dependencies (-D)
```bash
npm install nodemon -D
```

## Instal·lar .env:
```bash
npm i dotenv
```
## forçar la versio de Node.js:

Creem l'arxiu .nvmrc ( node version manager run configuration/commands) per establir la versio de node que s'ha de tenir per utilitzar l'aplicacio durant el desenvolupament.

```bash
nvm install && nvm use
```


# Frontend


npm create vite@latest react-notes-app

React
Typescript
Install with npm and start now? -yes


npm install bootstrap

npm install react-router-dom


# executar projecte en desenvolupament

## backend 

Instal·lar dependencies:
```bash
npm i
```

Importar prisma client:
```bash
npx prisma generate
```

Arrancar servei:
```bash
npm run dev
```
Servei en funcionament:
```bash
> backend@1.0.0 dev
> nodemon index.js

[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
◇ injected env (8) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
Server running on port 3001
[nodemon] clean exit - waiting for changes before restart
```


