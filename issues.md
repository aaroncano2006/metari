# Issues trobats - Metari Deploy

## Issue #1: BASE_URL no definida (Crític)

**Fitxer afectat:** `backend/index.js`

**Problema:** La variable `BASE_URL` s'utilitza a les línies 33, 42, 51, 60, 69, 78, 87, 96, 105 i 114 per generar la documentació de l'API, però mai es defineix. Això causa l'error:1
```
{"ok":false,"error":"BASE_URL is not defined"}
```

**Solució aplicada:** Afegir la definició de `BASE_URL` a `backend/index.js` (després de la línia 21):
```javascript
const BASE_URL = environment === "dev" 
  ? `${process.env.LOCALHOST}:${process.env.LOCAL_PORT}`
  : `${process.env.DOCKER_HOST}:${process.env.DOCKER_PORT}`;
```

---

## Issue #2: Errors a SETUP.md (Documentació)

### 2.1. Instrucció de còpia de fitxers incompleta

**Secció afectada:** 1.1. Crear el fitxer `.env`

**Problema:** La instrucció només copia el fitxer `.env` de l'arrel, però no esmenta el fitxer `.env` del backend.

**Correcció:**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 2.2. Taula de variables del backend amb errors

**Secció afectada:** 1.2. Configurar les variables d'entorn del backend

| Variable | Error | Correcció |
|----------|-------|-----------|
| `DOCKER_DATABASE_URL` | Exemple té un `"` extra al final | `"mysql://root:root_password@db:3306/metari_db"` (sense el `"` final) |
| `DOCKER_ADAPTER_HOST` | Exemple diu `bd` | Canviar a `db` (nom del servei a docker-compose.yml) |
| `DOCKER_ADAPTER_PORT` | Descripció diu "Port per phpMyAdmin" i exemple `8089` | Descripció: "Port de MariaDB (no cal canviar)". Exemple: `3306` |
| `DOCKER_ADAPTER_DATABASE` | Exemple usa `nom_de_la_teva_database` | Canviar a `metari_db` |

### 2.3. Falta nota de consistència entre fitxers .env

**Problema:** No s'explica que certes variables han de coincidir entre l'arrel `.env` i `backend/.env`:

- `MYSQL_DATABASE` (arrel) = `DOCKER_ADAPTER_DATABASE` (backend)
- `MYSQL_ROOT_PASSWORD` (arrel) = `DOCKER_ADAPTER_PASSWORD` (backend)

---

## Issue #3: Comentaris inline al .env arrel (Warning)

**Fitxer afectat:** `.env` (arrel)

**Problema:** Docker `env_file` no processa comentaris a la mateixa línia correctament. Si el fitxer té:
```env
MYSQL_DATABASE=metari_db # (ha de coincidir...)
```

El valor podria incloure el text del comentari.

**Consell:** Eliminar comentaris de la mateixa línia:
```env
MYSQL_DATABASE=metari_db
```

---

## Resum

| Issue | Gravetat | Estat |
|-------|----------|-------|
| BASE_URL no definida | Crític | ✅ Solucionat |
| Errors a SETUP.md | Mitjà | ⏳ Pendents d'actualitzar |
| Comentaris inline .env | Baix | ⚠️ Recomanació |

**Nota:** Els fitxers `.env` i `backend/.env` estaven correctament configurats. El problema principal era a `backend/index.js`.
