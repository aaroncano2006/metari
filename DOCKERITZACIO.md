# Dockerització de Metari — Pla de canvis

Decisió presa: **URL relativa `/api`**. El frontend fa servir `/api` com a base URL. En dev, Vite proxyja al backend; en Docker, nginx fa de proxy.

Estat: ✅ = fet, 🔲 = pendent

---

## 🔴 Bloc 1 — URLs hardcodeades → variables d'entorn

| # | Fitxer | Línia | Problema | Solució | Estat |
|---|--------|-------|----------|---------|-------|
| 1 | `metari-app/src/services/axiosConnection.ts` | 4 | `baseURL: "http://localhost:3001/api"` fix | Canviar a `baseURL: "/api"` | 🔲 |
| 2 | `metari-app/vite.config.ts` | 9 | Proxy `/uploads` → `http://localhost:3001` fix | Afegir també proxy `"/api": "http://localhost:3001"` | 🔲 |
| 3 | `backend/controllers/InvitationController.js` | 8-9 | `FRONTEND_URL = process.env.FRONTEND_URL \|\| "http://localhost:5173"` sense distingir entorns | Canviar a `ENVIRONMENT === "dev" ? LOCAL_FRONTEND_URL : DOCKER_FRONTEND_URL` | ✅ |
| 4 | `backend/controllers/auth/RestorePasswordController.js` | 8-9 | Mateix | Mateix | ✅ |
| 5 | `metari-app/src/components/*.tsx` i `views/Profile.tsx` | varis | Placeholder images hardcodeades (URLs gstatic, wikimedia) | Opcional: moure a constants o variables d'entorn | 🔲 |

---

## 🔴 Bloc 2 — L'API no ha d'estar exposada

| # | Fitxer | Línia | Problema | Solució | Estat |
|---|--------|-------|----------|---------|-------|
| 6 | `backend/index.js` | 8 | `app.use(cors())` sense restriccions → qualsevol web pot cridar l'API | Canviar a `app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", ...], credentials: true }))` | 🔲 |
| 7 | `backend/index.js` | 10 | `app.set("trusty proxy", true)` — typo, l'opció correcta és `trust proxy` | Canviar a `app.set("trust proxy", true)` | 🔲 |
| 8 | `backend/index.js` | 193 | `app.use("/uploads", express.static("uploads"))` exposa fitxers sense auth | Treure-ho i que nginx serveixi directament els uploads | 🔲 |
| 9 | `backend/routes/CommentRoutes.js` | 4-10 | Auth middleware **comentat** → POST/PUT/DELETE públics | Descomentar `isAuthenticated` i `isAdmin`, afegir a les rutes | 🔲 |
| 10 | `backend/routes/IndexedMetaRoutes.js` | 10 | DELETE només `isAuthenticated`, hauria de ser `isAdmin` | Afegir `isAdmin` al delete | 🔲 |
| 11 | `backend/controllers/UserController.js` | 81-157 | PUT `/api/usuaris/:id` sense ownership check → usuari A pot modificar usuari B | Afegir: `if (req.user.id !== id && req.user.role !== "admin")` retornar 403 | 🔲 |
| 12 | `docker-compose.yml` | 47-56 | phpMyAdmin exposat al port 8089 amb accés root | Treure del `docker-compose.yml` principal, crear `docker-compose.override.yml` només per dev | 🔲 |
| 13 | `nginx/default.conf` | - | Sense security headers | Afegir: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Strict-Transport-Security` | 🔲 |

---

## 🟡 Bloc 3 — Millores d'infraestructura Docker

| # | Fitxer | Línia | Problema | Solució | Estat |
|---|--------|-------|----------|---------|-------|
| 14 | `.dockerignore` | 1-4 | No exclou `.env` → secrets a la imatge Docker | Afegir `*.env`, `**/.env`, `diagrames/`, `wireframe/`, `*.pdf`, etc. | 🔲 |
| 15 | `docker-compose.yml` | 29-36 | `depends_on: - db` sense healthcheck → el backend intenta connectar abans que DB estigui llesta | Canviar a `depends_on: db: condition: service_healthy` | 🔲 |
| 16 | `docker-compose.yml` | - | Sense xarxa custom, tot al bridge per defecte | Crear xarxa `internal` (backend + db, aïllada) i `frontend` (nginx + frontend) | 🔲 |
| 17 | `docker-compose.yml` | 37 | Bash loop fràgil per esperar DB | Treure el loop, confiar en `condition: service_healthy` | 🔲 |
| 18 | `backend/Dockerfile` | 1-12 | Single stage, corre com a root, sense `.dockerignore` específic | Multi-stage: `deps` amb `npm ci --only=production`, després copiar; crear usuari no-root | 🔲 |
| 19 | `backend/.env` | 51 | `SECRET` feble o buit | Generar amb `openssl rand -hex 32` | 🔲 |
| 20 | `nginx/default.conf` | - | Sense TLS | Afegir `listen 443 ssl`, redirigir port 80 → 443, certificats autofirmats | 🔲 |
| 21 | `docker-compose.yml` | - | Sense volum per uploads compartit entre backend i nginx | Crear volum `uploads_data` muntat a backend i nginx | 🔲 |

---

## Certificats autofirmats

El nginx genera els certificats automàticament a l'arrencada al `docker-compose.yml`:

```yaml
nginx:
  command: >
    sh -c "mkdir -p /etc/nginx/ssl && \
      openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/server.key \
        -out /etc/nginx/ssl/server.crt \
        -subj '/C=ES/ST=Barcelona/L=Barcelona/O=Metari/CN=localhost' 2>/dev/null && \
      nginx -g 'daemon off;'"
```

---

## docker-compose.yml final (proposta)

```yaml
version: "3.9"

services:
  db:
    image: mariadb:11
    container_name: metari-mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
    healthcheck:
      test: ["CMD-SHELL", "mariadb-admin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} --silent"]
      interval: 5s
      timeout: 5s
      retries: 10
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - internal

  backend:
    build: ./backend
    container_name: metari-backend
    restart: always
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - .env
    environment:
      - ENVIRONMENT=production
    volumes:
      - uploads_data:/app/uploads
    networks:
      - internal

  frontend:
    build: ./metari-app
    container_name: metari-frontend
    restart: always
    depends_on:
      - backend
    networks:
      - frontend

  nginx:
    image: nginx:latest
    container_name: metari-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - uploads_data:/var/www/uploads:ro
    depends_on:
      - frontend
      - backend
    networks:
      - frontend
      - internal
    command: >
      sh -c "mkdir -p /etc/nginx/ssl && \
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
          -keyout /etc/nginx/ssl/server.key \
          -out /etc/nginx/ssl/server.crt \
          -subj '/C=ES/ST=Barcelona/L=Barcelona/O=Metari/CN=localhost' 2>/dev/null && \
        nginx -g 'daemon off;'"

volumes:
  db_data:
  uploads_data:

networks:
  internal:
    driver: bridge
    internal: true
  frontend:
    driver: bridge
```

---

## nginx/default.conf final (proposta)

```nginx
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name _;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## docker-compose.override.yml (phpMyAdmin només en dev)

```yaml
version: "3.9"

services:
  phpmyadmin:
    image: phpmyadmin:5.2.3-apache
    container_name: metari-phpmyadmin
    restart: always
    depends_on:
      db:
        condition: service_healthy
    environment:
      PMA_HOST: db
    ports:
      - "${PHPMYADMIN_PORT:-8089}:80"
    networks:
      - internal
```

---

## .dockerignore final

```gitignore
*.md
*.pdf
node_modules
.git
.gitignore
.env
.env.*
backend/uploads/*
diagrames/
wireframe/
img/
documentacio-*
Estimacio-hores.md
estudi-previ.md
proposta-projecte.md
proteccio-rutes.md
README.md
Report.md
SETUP.MD
```

---

## backend/.env — noves variables

```
ENVIRONMENT="dev"   # "dev" per local, "production" per Docker

LOCAL_FRONTEND_URL="http://localhost:5173"
DOCKER_FRONTEND_URL="http://ipohostname:5173"

SECRET=<generar amb: openssl rand -hex 32>
```
