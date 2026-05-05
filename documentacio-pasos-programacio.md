
Documentacio dels pasos de programacio

# Backend

## Instal·lar prisma:
Creem el package.json, que es la base del projecte:
```bash
npm init -y
```

Instal·lem prisma cli per les dev dependencies (--save-dev)
```bash
npm install prisma --save-dev
```
Instal·lem prisma client per les dev dependencies

```bash
npm install @prisma/client
```

Creem la carpeta de prisma i l'arxiu de configuracio de prisma (schema.prisma)
```bash
npx prisma init
```

Helmet:
Helmet.js ens ajuda a millorar la seguretat d'aplicacions Node/Express, configura automaticament alguns "Headers" que ens protegeixen dels atacs mes comuns, com per exemple:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing attacks
- Injeccio de contingut malicios

Helmet intercepta les respostes HTTP i afegeix capçaleres (Headers) de seguretat automaticament.

Instal·lem helmet:

```bash
npm install helmet
```

Instalem cors:
```bash
npm install cors
```




## Instal·lar  express:

Instala el servei web principal per crear la api:
```bash
npm install express
```

## Instal·lar nodemon:
Instal·lem nodemon per les dev dependencies (-D). S'utilitza per reiniciar el servidor automaticament cuan hi ha canvis en el projecte en desenvolupament:
```bash
npm install nodemon -D
```

## Instal·lar .env:

Se'utilitza per carregar variables d'entron des dels fitxers .env:
```bash
npm i dotenv
```
## forçar la versio de Node.js:

Creem l'arxiu .nvmrc ( node version manager run configuration/commands) per establir la versio de node que s'ha de tenir instal·lada per utilitzar l'aplicacio durant el desenvolupament.


Per instal·lar i utilitzar la versio definida al arxiu:
```bash
nvm install && nvm use
```


## bcrypt

Instal·lem bcrypt, s'utilitza per fer hash de les contrasenyes:

```bash
npm install bcrypt
```

## Instal·lar prisma:
Instal·lem prisma cli per les dev dependencies (--save-dev)
```bash
npm install prisma --save-dev
```
Instal·lem prisma client per les dev dependencies

```bash
npm install @prisma/client
```
aixo ens crea la carpeta de prisma

i un arxiu de configuracio del prisma

# Frontend

Creem el projecte de l'aplicacio:
```bash
npm create vite@latest react-notes-app
```
Les opcions utilitzades per configurar el projecte:
- React
- Typescript
- Install with npm and start now? -yes

Instal·lem bootstrap:
```bash
npm install bootstrap
```
importem bootstrap al projecte:

```bash
// src/main.tsx
import "bootstrap/dist/css/bootstrap.min.css";
```

Intal·lem llibreria per fer pagines amb react:
```bash
npm install react-router-dom
```

Instal·lem axios:
```bash
npm install axios
```
Instal·lem zod:
```bash
npm install zod
```


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
Executar migracions:
```bash
npm run migrate
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


