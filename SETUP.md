# Metari - Guia de desplegament

## Requisits previs

### 0.1 dependencies pel desplegament
- **Docker** (versió 20.10 o superior)
- **Docker Compose** (versió 2.0 o superior)

Per verificar que tens Docker instal·lat:
```bash
docker --version
docker compose --version
```

### 0.2 Projecte a desplegar (Ignorar si es proporciona el projecte per altres metodes)

Situar-nos a la ruta on volem copiar el projecte.

Copiar el projecte del repositori:
 ```bash
 git clone git@github.com:aaroncano2006/metari.git
 ```

---

## 1. Configuració inicial

Situar-nos dins del projecte:

```bash
cd metari
```

### Crear els fitxer `.env`

El projecte necessita dos fitxers `.env` que contenen les variables d'entorn.
Es necessari fer una copia dels arxius d'exemple `.env.default`, tant al directory backend com a l'arrel del projecte.

### 1.1. Configurar les variables d'entorn del backend

Edita el fitxer `.env` de la carpeta backend i assigna els valors corresponents.

Ens situem a la carpeta backend:  
```bash
cd backend
```
Copiem l'arxiu d'exemple i el renombrem a `.env`.  
```bash
cp .env.example .env
```
Editem l'arxiu:  
```bash
nano .env
```

**Variables:**

| Variable | Descripció | Exemple |
|----------|------------|---------|
| `DOCKER_PORT` | Port que utilitzara prisma (no cal canviar) | `3001` |  
| `DOCKER_DATABASE_URL` | Credencials per prisma, conexio a la bbdd | `mysql://root:root_password@db:3306/nom_de_la_teva_database"` |  
| `DOCKER_ADAPTER_HOST` | Nom del servei de la bbdd (No cal canviar) | `bd` |  
| `DOCKER_ADAPTER_PORT` | Port per phpMyAdmin (opcional) | `8089` |  
| `DOCKER_ADAPTER_USER` | Usuari de la base de dades | `root` |  
| `DOCKER_ADAPTER_PASSWORD` | Contrasenya de root per MariaDB | `Canvi@2024` |  
| `DOCKER_ADAPTER_DATABASE` | Nom de la base de dades | `metari_db` |  


### 1.2 Configurar les variables d'entorn de l'arrel del projecte

Edita el fitxer `.env` de l'arrel del projecte "metari/"  i assigna valors:

Ens situem a l'arrel del projecte: 
```bash
cd ..
```
Copiem l'arxiu d'exemple i el renombrem a `.env`.  
```bash
cp .env.example .env
```
Editem l'arxiu:  
```bash
nano .env
```

| Variable | Descripció | Exemple |
|----------|------------|---------|
| `MYSQL_ROOT_PASSWORD` | Password Root | `root` |
| `MYSQL_DATABASE` | Nom de la base de dades | `metari_db` |
| `PHPMYADMIN_PORT` | Port per accedir al php my admin | `8089` |


 ### 1.3 Important!
 Hi ha una carpeta anomenada `db` que tambe conte un arxiu `.env.exemple`.   
 IGNORAR-LA.  
 Nomes s'utilitza en el process de desenvolupament de l'aplicació.


---

## 2. Desplegament

### 2.1. Construir i iniciar els contenidors

A directori arrel del projecte:

```bash
docker compose up --build -d
```

Aquesta comanda fa:
- Construeix les imatges del backend i frontend
- Crea els contenidors de MariaDB, Backend, Frontend, nginx i phpMyAdmin
- Inicia la base de dades i executa les migracions automàticament

### 2.2. Verificar que els serveis estan aixecats:

```bash
docker compose ps
```

Tots els serveis haurien d'estar en estat **Up**:

```
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS        PORTS                                     NAMES
fe07d875b1d2   nginx:latest              "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes  0.0.0.0:80->80/tcp, [::]:80->80/tcp       metari-nginx
517e78bee10b   metari-frontend           "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes  80/tcp                                    metari-frontend
7134c5a6d978   phpmyadmin:5.2.3-apache   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes  0.0.0.0:8089->80/tcp, [::]:8089->80/tcp   metari-phpmyadmin
98d0aa818079   metari-backend            "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes  3001/tcp                                  metari-backend
080671264dc5   mariadb:11                "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes  3306/tcp                                  metari-mariadb
```

---

## 3. Accés als serveis

Un cop desplegat, pots accedir a:

| Servei | URL | Descripció |
|--------|-----|------------|
| **Frontend** | `http://localhost` | Aplicació web |
| **Backend API** | `http://localhost/api` | API REST |
| **phpMyAdmin** | `http://localhost:8089` | Administració de la base de dades |

### 3.1. Credencials per defecte (phpMyAdmin)

| Camp | Valor |
|------|-------|
| Servidor | `db` |
| Usuari | `root` |
| Contrasenya | (la que has posat a `MYSQL_ROOT_PASSWORD`) |

---

## 4. Seeders

Després del primer desplegament, s'executaran seeders i la base de dades ja estarà poblada amb dades de prova.

---

## 5. Aturada i neteja

### 5.1. Aturar els contenidors

```bash
docker compose down
```

### 5.2. Aturar i eliminar les dades

Si vols netejar les dades de la bbdd:

```bash
docker compose down -v
```

### 5.3. Reconstruir des de zero

```bash
docker compose down -v
docker compose up --build -d
```

---

## 6. Comandaments útils

### Veure logs
```bash
# Tots els serveis
docker compose logs -f

# Només un servei
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Reiniciar un servei
```bash
docker compose restart backend
```

### Accedir al contenidor del backend
```bash
docker compose exec backend sh
```

### Accedir a la base de dades des de la línia de comandes
```bash
docker compose exec db mariadb -u root -p
```

---

## 7. Resolució de problemes

### Error: "Cannot connect to database"

Esperar uns segons més i provar:
```bash
docker compose logs db
```

### Error: Port en ús

Canvia el port al fitxer `.env`:
```
FRONTEND_PORT=8088
```

### Les variables d'entorn no funcionen

Assegura't que el fitxer `.env` està a l'arrel del projecte (on hi ha `docker-compose.yml`).

---

## 8. Estructura del projecte

```
metari/
├── backend/              # API REST (Node.js + Express)
│   ├── config/         # Configuracions
│   ├── prisma/         # Schema de la base de dades
│   ├── routes/         # Rutes de l'API
│   ├── seeders/        # Dades inicials
│   ├── middlewares/    # Validacions i gestió d'errors
│   ├── helpers/        # Utilitats varies
│   ├── .env        # Variables d'entorn (NO inclòs a git)
│   └── .env.example        # Variables d'entorn (A editar)
├── metari-app/         # Frontend (React)
├── docker-compose.yml # Definició dels serveis
├── .env               # Variables d'entorn (NO inclòs a git)
└── .env.example       # Plantilla d'entorn (A editar)
```

---

## 9. Seguretat (per auditors)

**Abans de l'auditoria:**

1. Canvia les contrasenyes per defecte
2. Revisa els fitxers `.env` per credencials per defecte
3. Desactiva el mode `dev` si fes falta: `ENVIRONMENT=production` (Per defecte ha d'estar en production)

**Fitxers sensibles:**
- `.env` - Conté contrasenyes i claus API
- `backend/.env` - Configuració del backend

---

## 10. Més informació

- **Docker:** https://docs.docker.com/
- **Prisma:** https://www.prisma.io/docs
- **React:** https://react.dev/