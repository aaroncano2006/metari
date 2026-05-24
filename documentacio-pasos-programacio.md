# Documentacio dels passos de programacio

## Taula de Continguts

- [Backend](#backend)
  - [Instal·lar prisma](#instal-lar-prisma)
  - [Aplicar seeders](#aplicar-seeders)
  - [Helmet](#helmet)
  - [Instal·lar express](#instal-lar-express)
  - [Instal·lar nodemon](#instal-lar-nodemon)
  - [Instal·lar dotenv](#instal-lar-dotenv)
  - [Forçar la versio de Node.js](#for%C3%A7ar-la-versio-de-nodejs)
  - [bcrypt](#bcrypt)
  - [JSONWebToken](#jsonwebtoken)
  - [Nodemailer](#nodemailer)
  - [Multer](#multer)
- [Frontend](#frontend)
- [executar projecte en desenvolupament](#executar-projecte-en-desenvolupament)
  - [backend](#backend-1)

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

Cada vegada que modifiquem `schema.prisma` haurem de generar una migració:

```bash
npx prisma migrate dev
```

O utilitzar l'script custom del projecte (especificat a `package.json`):

```bash
npm run migrate
```

I generar de nou el client de Prisma:

```bash
npx prisma generate
```

Si volem aplicar les ja existents:

```bash
npm run migrate:apply
```

O:

```bash
npx prisma migrate deploy
```

Si volem resetejar la base de dades i reaplicar les migracions:

```bash
npm run migrate:reset
```

O:

```bash
npx prisma migrate reset
```

## Aplicar seeders:

Si vols que la base de dades estigui poblada, pots afegir dades de prova amb la següent comanda:

```bash
npm run seed
```

## Helmet

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

Configurar origens:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin:
      environment === "dev"
        ? process.env.LOCAL_FRONTEND_URL
        : process.env.DOCKER_FRONTEND_URL,
  }),
);
```

## Instal·lar express:

Instala el servei web principal per crear la api:

```bash
npm install express
```

## Instal·lar nodemon:

Instal·lem nodemon per les dev dependencies (-D). S'utilitza per reiniciar el servidor automaticament quan hi ha canvis en el projecte en desenvolupament:

```bash
npm install nodemon -D
```

## Instal·lar dotenv:

Se'utilitza per carregar variables d'entron des dels fitxers .env:

```bash
npm i dotenv
```

## Forçar la versio de Node.js:

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

## JSONWebToken

El JSONWebToken serà el token que verificarà si l'usuari ha iniciat sessió en l'aplicació.

Instal·lem el mòdul:

```bash
npm i jsonwebtoken
```

Creem una nova variable d'entorn anomenada **SECRET** al .env, aquesta variable s'encarrega de signar el Token per després comprovar que sigui leigitim.
Ha de ser una clau segura ja que d'aquesta forma podem evitar que es signin tokens ilegitims.

Creem un fitxer de configuració i extraiem la variable d'entorn:

```javascript
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const SECRET = process.env.SECRET;

module.exports = {
  SECRET,
};
```

Creem un controlador de login i després l' assignem una ruta:

```javascript
const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;
const prisma = require("../../config/prisma");
const utils = require("../../helpers/Utils");

const login = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = {
      email_or_username: reqBody.email_or_username,
      password: String(reqBody.password),
    };

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email_or_username,
          },
          {
            username: data.email_or_username,
          },
        ],
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isSamePassword = await utils.compareHash(
      data.password,
      existingUser.password,
    );

    if (!isSamePassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      },
      SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
```

```javascript
const express = require("express");
const router = express.Router();
const { login } = require("../../controllers/auth/LoginController");

router.post("/", login);

module.exports = router;
```

La utilitzem a index.js:

```javascript
const loginRoutes = require("./routes/auth/LoginRoutes");

app.use("/api/login", loginRoutes);
```

**Protegir rutes**

Creem un middleware per verificar el JSONWebToken de l'usuari, si no existeix o no és legitim no deixarà accedir als endpoints protegits:

```javascript
const jwt = require("jsonwebtoken");
const SECRET = require("../../config/auth").SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(403);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
};
```

Per protegit una ruta, pasem el middleware com a paràmetre a les rutes que vulguem. per exemple:

```javascript
app.get("/api/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: req.user,
  });
});
```

Si l'autenticació passa, retorna el missatge i les dades de l'usuari:

```json
{
  "message": "Acceso permitido",
  "user": {
    "id": 5,
    "email": "manologafotas@test.com",
    "username": "ermanolito45",
    "iat": 1777556479,
    "exp": 1777560079
  }
}
```

`iat` (Issued At): Timestamp en segons del moment en que s'ha creat el token.

`exp` (Expiration): Timestamp en segons que indica quan expira el token.

Generats automàticament per JWT.

## Nodemailer

Llibreria per gestionar enviament de correus electrònics als control·ladors.

```bash
npm i nodemailer
```

En el .env haurem de configurar les següents variables d'entorn si volem utilitzar aquestes funcions:

```env
TRANSPORTER_SERVICE="gmail"
TRANSPORTER_USER="example@gmail.com"
TRANSPORTER_APP_PASS="sixu tqca pepv wman"
```

- `TRANSPORTER_SERVICE`: Servidor de correu electrònic utilitzat. Amb el valor gmail utilitzem els serveis de correu electrònic de Google.

- `TRANSPORTER_USER`: Correu electrònic que enviarà les notificacions.

- `TRANSPORTER_APP_PASS`: App password associada al correu electrònic introduït.

Per a més informació de com configurar les variables d'entorn i generar l'app password consulta [SETUP.md](SETUP.md)

Configurar nodemailer a Express:

```javascript
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.TRANSPORTER_SERVICE || "gmail",
  auth: {
    user: process.env.TRANSPORTER_USER,
    pass: process.env.TRANSPORTER_APP_PASS,
  },
});

module.exports = transporter;
```

Exemple d'ús:

```javascript
app.post("/api/test-email", async (req, res, next) => {
  const { to, subject, text } = req.body;

  try {
    const info = await nodemailer.sendMail({
      from: "Metari",
      to: to,
      subject: subject,
      text: text,
      html: `<p>${text}</p>`,
    });

    res.status(200).json({
      message: "Correo enviado correctamente",
      info: info.messageId,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
```

## Multer

```bash
npm install multer
```

backend/index.js — afegir:  
app.use("/uploads", express.static("uploads"));

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

git clone
cd metari
copiar arxius env, editarlos
cd backend
copiar .env
env production  
cd ..
docker compose up --build
