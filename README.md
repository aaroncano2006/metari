# Metari

[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=fff)](#)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](#)



Plataforma comunitària per a la gestió de reptes i tasques. Crea, assigna i completa **metes** (tasques individuals o reptes en grup) mentre competeixes per la puntuació més alta amb els teus amics i grups.

---

## Índex

- [Funcionalitats](#funcionalitats)
- [Tecnologies](#tecnologies)
- [Requisits](#requisits)
- [Desenvolupament local](#desenvolupament-local)
  - [1. Base de dades](#1-base-de-dades)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
  - [Posada en producció (Docker)](#posada-en-producció-docker)
- [Estructura del projecte](#estructura-del-projecte)
- [Documentació addicional](#documentació-addicional)
- [Llicència](#llicència)

---

## Funcionalitats

- **Gestió d'usuaris** — Registre, inici de sessió, personalització de perfil i recuperació de contrasenya
- **Sistema de grups** — Grups públics i privats amb rols (membre, moderador, propietari)
- **Metes (tasques i desafiaments)** — Creació de tasques individuals i reptes grupals amb categoria, prioritat, dificultat i puntuació. Les metes poden ser creades de forma pública i privada.
- **Assignacions** — Assigna metes a usuaris o grups; seguiment de l'estat de finalització
- **Sistema de proves** — Pujada d'imatges com a justificant de finalització; moderadors validen les proves
- **Comentaris** — Sistema de comentaris en cada assignació
- **Invitacions** — Invitacions a amics i sol·licituds d'unió a grups
- **Rànquings** — Classificacions per puntuació dins de grups i entre usuaris de la plataforma.
- **Indexació** - Abans de que una meta sigui pública o part d'un grup, els moderadors han d'aprovar-la per a que surti al llistat. També tenen l'opció de rebutjar-la en cas de que contingui llenguatge ofensiu o incompleixi les polítiques de la plataforma.
- **Panell d'administració** — CRUD complet d'usuaris, grups, metes, categories i comentaris
- **Notificacions per correu** — Recuperació de contrasenya i notificacions via Nodemailer
- **Cerca global** — Cerca en grups i metes

## Tecnologies

| Capa | Tecnologia |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Bootstrap 5, CSS, React Router 7, Axios, Zod |
| **Backend** | Node.js, ExpressJS, Prisma ORM, JWT (jsonwebtoken), Bcrypt, Multer, Nodemailer, Helmet |
| **Base de dades** | MariaDB 11 |
| **Proxy invers i servidor web** | Nginx |
| **Contenidors** | Docker i Docker Compose |

## Requisits

- Git
- Docker i Docker Compose
- Node.js 24 (per a desenvolupament local)

## Desenvolupament local

Per treballar en local sense Docker, cal engegar cada component per separat. La base de dades és l'única que necessita Docker (o tenir MariaDB instal·lat localment).

### 1. Base de dades

El directori `db/` conté un `docker-compose.yml` que engega MariaDB i phpMyAdmin. Això evita haver d'instal·lar MariaDB al sistema.

Abans d'engegar-lo, crea el fitxer `.env` dins de `db/` a partir de l'exemple:

```bash
cd db
cp .env.example .env
```

Edita `db/.env` i configura les següents variables:

| Variable | Descripció | Exemple |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | Contrasenya de l'usuari root de MariaDB | `"P@ssw0rd*"` |
| `MYSQL_DATABASE` | Nom de la base de dades que es crearà automàticament | `"metari_db"` |
| `MYSQL_USER` | Usuari addicional (no root) que es crearà (pots deixar-la buida) | `"metari_user"` |
| `MYSQL_PASSWORD` | Contrasenya per a l'usuari anterior (pots deixar-la buida) | `"P@ssw0rd*"` |
| `MYSQL_PORT` | Port on escoltarà MariaDB (per defecte `3306`) | `3306` |
| `PHPMYADMIN_PORT` | Port on escoltarà phpMyAdmin (per defecte `8080`) | `8080` |

Un cop configurat, engega els contenidors:

```bash
docker compose up -d
```

Això posa en marxa:
- **MariaDB** al port indicat a `MYSQL_PORT` (per defecte `3306`)
- **phpMyAdmin** a `http://localhost:PHPMYADMIN_PORT` (per defecte `http://localhost:8080`), usuari: `root`, contrasenya: la de `MYSQL_ROOT_PASSWORD`

Per aturar-ho: `docker compose down`

### 2. Backend

Ens situem a l'arrel del projecte i anem al directori backend.

```bash
cd backend
```

Primer, copia el fitxer d'exemple de variables d'entorn i configura'l:

```bash
cp .env.example .env
```

Obre `backend/.env` i configura les variables segons l'entorn en què treballis:

#### Configuració general

| Variable | Descripció | Exemple |
|---|---|---|
| `ENVIRONMENT` | Entorn d'execució: `dev` per local, `production` per Docker. En aquest cas hauries d'escollir `dev` | `"dev"` |
| `SECRET` | **(OBLIGATORI)** Clau secreta per firmar els tokens JWT | `"clau_super_segura_123"` |

L'aplicació carrega un bloc o un altre de variables segons el valor d'`ENVIRONMENT`:

#### Bloc per a entorn local (`ENVIRONMENT="dev"`)

| Variable | Descripció | Exemple |
|---|---|---|
| `LOCAL_PORT` | Port del servidor Express | `3001` |
| `LOCAL_DATABASE_URL` | URL de connexió a MariaDB (per Prisma) | `"mysql://root:contrasenya@localhost:3306/metari_db"` |
| `LOCAL_ADAPTER_HOST` | Host de MariaDB | `localhost` |
| `LOCAL_ADAPTER_PORT` | Port de MariaDB | `3306` |
| `LOCAL_ADAPTER_USER` | Usuari de MariaDB | `root` |
| `LOCAL_ADAPTER_PASSWORD` | Contrasenya de MariaDB | `"P@ssw0rd*"` |
| `LOCAL_ADAPTER_DATABASE` | Nom de la base de dades | `metari_db` |
| `LOCAL_FRONTEND_URL` | URL del frontend per a CORS | `"http://localhost:5173"` |

#### Notificacions per correu (Nodemailer) — opcional

Si vols activar l'enviament de correus (recuperació de contrasenya), configurar:

| Variable | Descripció | Exemple |
|---|---|---|
| `TRANSPORTER_SERVICE` | Servei de correu | `"gmail"` |
| `TRANSPORTER_USER` | Adreça de correu | `"tucorreu@gmail.com"` |
| `TRANSPORTER_APP_PASS` | Contrasenya d'aplicació del correu | `"abcd1234efgh5678"` |

Un cop configurat, instal·la les dependències i aplica les migracions per crear les taules a la base de dades:

```bash
npm install
npx prisma generate
npx run migrate:apply
```

> **Nota**: `npm run migrate:apply` és una comanda custom especificada a `package.json`, si vols utilitzar la comanda original:

```bash
npx prisma migrate dev
```

Si vols carregar dades de prova (usuaris, categories, metes, etc.):

```bash
npm run seed
```

Finalment, engega el servidor en mode desenvolupament:

```bash
npm run dev
```

L'API estarà disponible a `http://localhost:3001/api`.

### 3. Frontend

Obre un altre terminal i vés al directori del frontend:

```bash
cd metari-app
```

Instal·la les dependències:

```bash
npm install
```

Engega el servidor de desenvolupament de Vite:

```bash
npm run dev
```

L'aplicació estarà disponible a `http://localhost:5173`. Vite ja està configurat per redirigir les crides `/api` al backend (`http://localhost:3001`), de manera que tot funciona de manera integrada.

### Posada en producció (Docker)

>Per a posada en producció consulta [la guia de desplegament](SETUP.md).

## Estructura del projecte

```
metari/
├── backend/           # API REST amb Express i Prisma
│   ├── config/        # Configuració (auth, upload, email)
│   ├── controllers/   # Lògica dels endpoints
│   ├── middlewares/    # Autenticació, validació, errors
│   ├── routes/        # Definició de rutes
│   ├── prisma/        # Esquema i migracions
│   └── seeders/       # Dades de prova
├── metari-app/        # Frontend amb React + TypeScript
│   ├── src/views/     # Pàgines de l'aplicació
│   ├── src/components/# Components reutilitzables
│   └── src/services/  # Cridades a l'API amb Axios
├── db/                # Docker Compose per a BD local
├── nginx/             # Configuració del proxy invers
├── diagrames/         # Diagrames UML (PlantUML)
└── img/               # Imatges per a documentació
```

## Documentació addicional

- [`SETUP.md`](SETUP.md) — Guia de desplegament detallada
- [`manual-usuari.md`](manual-usuari.md) — Manual d'usuari
- [`estudi-previ.md`](estudi-previ.md) — Estudi previ del projecte
- [`proposta-projecte.md`](proposta-projecte.md) — Proposta inicial
- [`diagrames/`](diagrames/) — Diagrames d'arquitectura, classes i casos d'ús

## Llicència

Aquest projecte és educatiu i no té una llicència específica.
