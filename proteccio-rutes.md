# Resum de Protecció de Rutes

## Llegenda

| Color | Significat |
|-------|------------|
| **Pública** | No requereix autenticació |
| **`isAuthenticated`** | Requereix token JWT vàlid (`req.user` existeix) |
| **`isAdmin`** | Requereix que `req.user.role === "admin"` |
| **Auth → ownership** | Requereix autenticació + el controller verifica que `req.user.id` coincideix amb el recurs |

---

## Categories (`/api/categories`) (fet)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` + `isAdmin` |
| PUT | `/:id` | `isAuthenticated` + `isAdmin` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

Les categòries ja venen definides en l'aplicació, els usuaris poden consultar-les i filtrar metes públiques per aquestes castegòries, però només els administradors de l'aplicació poden crear-les,
editar-les i eliminar-les.

---

## Usuaris (`/api/usuaris`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | `isAuthenticated` | Excloure `password` i `restore_token` del resultat |
| GET | `/:id` | `isAuthenticated` | Excloure `password` i `restore_token` del resultat |
| POST | `/` | Pública | Registre |
| PUT | `/:id` | `isAuthenticated` | Ownership check: `req.user.id === id` → perfil propi; `req.user.role === "admin"` → edició completa |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` | Només admin |

Els convidats no poden veure els usuaris registrats en l'aplicació, han de fer login o registar-se per poder tenir aquesta interacció,
veuran el següent missatge si no estàn autenticats:

```
Fes LogIno Registra'tper participar amb la comunitat
```

---

## Metas (`/api/metas`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` + `isAdmin` |
| PUT | `/:id` | `isAuthenticated` + `isAdmin` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

---

## Grups (`/api/grups`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/user/:userId` | `isAuthenticated` |
| GET | `/:id` | Pública |
| POST | `/` | Pública |
| PUT | `/:id` | `isAuthenticated` + `isAdmin` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

---

## Assignacions (`/api/assignacions`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` |
| PUT | `/:id` | `isAuthenticated` + `isAdmin` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

---

## Comentaris (`/api/comentaris`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` |
| PUT | `/:id` | `isAuthenticated` |
| DELETE | `/:id` | `isAuthenticated` |

---

## Proves (`/api/proves`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` |
| PUT | `/:id` | `isAuthenticated` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

---

## Invitacions (`/api/invitacions`)

Totes requereixen `isAuthenticated`. El controller verifica ownership internament amb `req.user.id` enlloc dels paràmetres de la ruta.

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/:userid/:sentorreceived/:status` | `isAuthenticated` | Usar `req.user.id` com a userId |
| POST | `/:senderid/:receiverid` | `isAuthenticated` | Usar `req.user.id` com a senderId |
| POST | `/:senderid/:receiverid/:groupid` | `isAuthenticated` | Usar `req.user.id` com a senderId |
| PUT | `/:receiverid/:id` | `isAuthenticated` | Usar `req.user.id` com a receiverId |
| DELETE | `/:id` | `isAuthenticated` | Usar `req.user.id` com a userId |
| GET | `/friends/:userid` | `isAuthenticated` | Usar `req.user.id` com a userId |

> **Nota:** La ruta DELETE canvia de `/:userid/:id` a `/:id` perquè l'userId es treu del token.

---

## Grups-Usuaris (`/api/grups-usuaris`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | Pública | |
| GET | `/:group_id/:user_id` | Pública | |
| POST | `/` | `isAuthenticated` | Controller: owner del grup, moderador, o admin |
| PUT | `/:group_id/:user_id` | `isAuthenticated` | Controller: owner del grup o admin (canvi de rol sensible) |
| DELETE | `/:group_id/:user_id` | `isAuthenticated` | Controller: owner del grup, moderador, o admin |

---

## Indexa-Metas (`/api/indexa-metas`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` |
| PUT | `/:id` | `isAuthenticated` + `isAdmin` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

---

## Cerca (`/api/search`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |

---

## Auth (sense protecció)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| POST | `/api/login` | Pública |
| POST | `/api/restore-password/forgot` | Pública |
| POST | `/api/restore-password/restore` | Pública |

---

## Resum per Ruta

| # | Ruta | GET `/` | GET `/:id` | POST | PUT | DELETE |
|---|------|---------|------------|------|-----|--------|
| 1 | categories | pública | pública | **admin** | **admin** | **admin** |
| 2 | usuaris | pública | pública | pública | **auth+ownership** | **admin** |
| 3 | metas | pública | pública | **admin** | **admin** | **admin** |
| 4 | grups | pública | pública | pública | **admin** | **admin** |
| 5 | assignacions | pública | pública | **auth** | **admin** | **admin** |
| 6 | comentaris | pública | pública | **auth** | **auth** | **auth** |
| 7 | proves | pública | pública | **auth** | **auth** | **admin** |
| 8 | invitacions | — | — | **auth** | **auth** | **auth** |
| 9 | grups-usuaris | pública | pública | **auth+owner/mod/admin*** | **auth+owner/admin*** | **auth+owner/mod/admin*** |
| 10 | indexa-metas | pública | pública | **auth** | **admin** | **admin** |
| 11 | search | pública | — | — | — | — |
| 12 | login | — | — | pública | — | — |
| 13 | restore-password | — | — | pública | — | — |
