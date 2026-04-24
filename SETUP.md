# Metari - Guia de desplegament

## Requisits previs

- **Docker** (versió 20.10 o superior)
- **Docker Compose** (versió 2.0 o superior)

Per verificar que tens Docker instal·lat:
```bash
docker --version
docker-compose --version
```

---

## 1. Configuració inicial

### 1.1. Crear el fitxer `.env`

El projecte necessita un fitxer `.env` amb les variables d'entorn. Copia l'arxiu d'exemple:

```bash
cp .env.example .env
```

### 1.2. Configurar les variables d'entorn

Edita el fitxer `.env` i assigna_valors a les contrasenyes i ports:

```bash
nano .env
```

**Variables mínimes necessàries:**

| Variable | Descripció | Exemple |
|----------|------------|---------|
| `MYSQL_ROOT_PASSWORD` | Contrasenya de root per MariaDB | `Canvi@2024` |
| `MYSQL_DATABASE` | Nom de la base de dades | `metari_db` |
| `PHPMYADMIN_PORT` | Port per phpMyAdmin (opcional) | `8089` |

**Ports per defecte (no cal canviar si no vols):**
- Backend: `3001`
- Frontend: `8087`
- phpMyAdmin: `8089`

---

## 2. Desplegament

### 2.1. Construir i iniciar els contenidors

```bash
docker-compose up --build -d
```

Aquest comando:
- Construeix les imatges del backend i frontend
- Crea els contenidors de MariaDB, Backend, Frontend i phpMyAdmin
- Inicia la base de dades i executa les migracions automàticament

### 2.2. Verificar que tot funciona

```bash
docker-compose ps
```

Tots els serveis haurien d'estar en estat **Up**:

```
Name                 Command                  State    Ports
-------------------------------------------------------------------------
metari-mariadb       docker-entrypoint.sh ...  Up       3306/tcp
metari-backend       sh -c "..."              Up       0.0.0.0:3001->3001/tcp
metari-frontend      /docker-entrypoint.sh ... Up       0.0.0.0:8087->80/tcp
metari-phpmyadmin    /docker-entrypoint.sh ...  Up       0.0.0.0:8089->80/tcp
```

---

## 3. Accés als serveis

Un cop desplegat, pots accedir a:

| Servei | URL | Descripció |
|--------|-----|------------|
| **Frontend** | `http://localhost:8087` | Aplicació web |
| **Backend API** | `http://localhost:3001` | API REST |
| **phpMyAdmin** | `http://localhost:8089` | Administració de la base de dades |

### 3.1. Credencials per defecte (phpMyAdmin)

| Camp | Valor |
|------|-------|
| Servidor | `db` |
| Usuari | `root` |
| Contrasenya | (la que has posat a `MYSQL_ROOT_PASSWORD`) |

---

## 4. Usuaris per defecte

Després del primer desplegament, el seeder crea usuaris de prova:

| Usuari | Contrasenya | Rol |
|-------|-----------|-----|
| `Naimus` | `123456` | Admin |
| `Yesi` | `123456` | User |
| `aaron` | `123456` | Admin |

**Recomanació:** Canvia les contrasenyes abans de fer servir l'aplicació en producció.

---

## 5. Aturada i neteja

### 5.1. Aturar els contenidors

```bash
docker-compose down
```

### 5.2. Aturar i eliminar les dades

Si vols eliminar inclòs la base de dades:

```bash
docker-compose down -v
```

### 5.3. Reconstruir des de zero

```bash
docker-compose down -v
docker-compose up --build -d
```

---

## 6. Comandaments útils

### Veure logs
```bash
# Tots els serveis
docker-compose logs -f

# Només un servei
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Reiniciar un servei
```bash
docker-compose restart backend
```

### Accedir al contenidor del backend
```bash
docker-compose exec backend sh
```

### Accedir a la base de dades des de la línia de comandes
```bash
docker-compose exec db mariadb -u root -p
```

---

## 7. Resolució de problemes

### Error: "Cannot connect to database"

Esperar uns segons més i provar:
```bash
docker-compose logs db
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
│   └── seeders/        # Dades inicials
├── metari-app/         # Frontend (React)
├── docker-compose.yml # Definició dels serveis
├── .env               # Variables d'entorn (NO inclòs a git)
└── .env.example       # Plantilla d'entorn
```

---

## 9. Seguretat (per auditors)

**Abans de l'auditoria:**

1. Canvia les contrasenyes per defecte
2. Revisa els fitxers `.env` per credencials hardcoded
3. Desactiva el mode `dev` si cal: `ENVIRONMENT=production`

**Fitxers sensibles:**
- `.env` - Conté contrasenyes i claus API
- `backend/.env` - Configuració del backend

---

## 10. Més informació

- **Documentació completa:** [README.md](./README.md)
- **Docker:** https://docs.docker.com/
- **Prisma:** https://www.prisma.io/docs
- **React:** https://react.dev/