# Resum de Protecció de Rutes

> **Nota:** Aquest document descriu la **protecció objectiu** (com hauria d'estar protegida cada ruta segons els casos d'ús de l'aplicació). Les seccions **"Accions al codi"** indiquen què falta implementar respecte a l'estat actual.

## Llegenda

| Color | Significat |
|-------|------------|
| **Pública** | No requereix autenticació |
| **`isAuthenticated`** | Requereix token JWT vàlid (`req.user` existeix) |
| **`isAdmin`** | Requereix que `req.user.role === "admin"` |
| **Auth → ownership** | Requereix autenticació + el controller verifica que `req.user.id` coincideix amb el recurs |
| **Auth → mod/owner** | Requereix autenticació + el controller verifica que l'usuari és moderador/owner del grup o admin |
| **Auth → pertany** | Requereix autenticació + el controller verifica que l'usuari té relació amb l'assignació (assignat, autor, membre del grup, moderador, owner, admin) |

---

## Categories (`/api/categories`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |
| GET | `/:id` | Pública |
| POST | `/` | `isAuthenticated` + `isAdmin` |
| PUT | `/:id` | `isAuthenticated` + `isAdmin` |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` |

Les categories ja venen definides en l'aplicació. Els usuaris poden consultar-les i filtrar metes públiques per aquestes categories, però només els administradors de l'aplicació poden crear-les, editar-les i eliminar-les.

### Casos d'ús a protegir
- **Consultar categories**: Tothom (públic)
- **Crear/editar/eliminar categories**: Només administradors

### Riscos de no protegir-ho
- Usuaris maliciosos podrien crear categories ofensives o desorganitzar la taxonomia de l'aplicació

### Accions al codi
- **Estat actual**: ✅ Correcte. El codi ja aplica `isAuthenticated` + `isAdmin` a POST/PUT/DELETE.

---

## Usuaris (`/api/usuaris`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | **`isAuthenticated`** | Excloure `password` i `restore_token` del resultat |
| GET | `/:id` | **`isAuthenticated`** | Excloure `password` i `restore_token` del resultat |
| POST | `/` | Pública | Registre. El rol sempre es `"user"` (no es pot auto-asignar admin) |
| PUT | `/:id` | `isAuthenticated` | Ownership check: `req.user.id === id` → perfil propi; `req.user.role === "admin"` → edició completa. Requerir contrasenya actual per canviar-la. |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` | Només admin (un usuari normal no pot eliminar el seu propi compte) |

Els convidats no poden veure els usuaris registrats en l'aplicació; han de fer login o registrar-se per poder tenir aquesta interacció. Veuran el següent missatge si no estan autenticats:

```
Fes Login o Registra't per participar amb la comunitat
```

### Casos d'ús a protegir
- **Llistar usuaris / veure perfil aliè**: Usuaris autenticats (per evitar enumeració)
- **Registrar-se**: Públic
- **Editar perfil**: El propi usuari (ownership) o admin
- **Canviar contrasenya**: Requerir contrasenya actual per evitar segrest de compte si el token JWT es filtra
- **Eliminar compte**: Només admin (decisions de disseny)

### Riscos de no protegir-ho
- **Enumeració d'usuaris**: GET públic permet a qualsevol llistar tots els usuaris (nom, email, username). Això facilita atacs de força bruta i phishing.
- **Canvi de contrasenya sense password actual**: Si un atacant obté un JWT (per XSS, token robat), pot canviar la contrasenya sense saber l'actual.
- **Mass assignment de `role`**: Un usuari maliciós podria intentar enviar `role: "admin"` al PUT. El controller ho ha de rebutjar explícitament.

### Accions al codi
- **⚠️ Afegir `isAuthenticated` a GET `/` i GET `/:id`** — Actualment són públiques
- **⚠️ Requerir contrasenya actual al PUT** per permetre canvi de password (no només comparar amb l'antiga)
- **✅ `password` i `restore_token` s'exclouen** correctament als controllers actius
- **⚠️ El controller refactoritzat (`controllers/refactors/UserController.js`) NO exclou `password` i NO té ownership check** — No s'ha d'importar fins que es corregeixi

---

## Metes (`/api/metas`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | **Pública*** | *Filtrar només metes públiques (`is_public: true`) per usuaris no autenticats |
| GET | `/user/:userId` | **Pública*** | *Filtrar només metes públiques per usuaris no autenticats |
| GET | `/:id` | **Pública*** | *Filtrar només metes públiques per usuaris no autenticats |
| POST | `/` | `isAuthenticated` | `author_id` s'obté de `req.user.id` (NO del body) |
| PUT | `/:id` | `isAuthenticated` en propietat o `isAdmin` | L'autor de la meta o un admin la pot editar |
| DELETE | `/:id` | `isAuthenticated` en propietat o `isAdmin` | L'autor de la meta o un admin la pot eliminar |

### Casos d'ús a protegir
- **Veure metes**: Tothom pot veure metes públiques. Usuaris autenticats poden veure també metes de grup de les quals en són membres.
- **Crear meta**: Qualsevol usuari autenticat, assignant-se com a autor automàticament
- **Editar/eliminar meta pròpia**: L'autor de la meta
- **Editar/eliminar qualsevol meta**: Admin (per moderació)
- **Veure metes per usuari**: Públic (sols públiques)

### Riscos de no protegir-ho
- **Mass assignment d'`author_id`**: Si `author_id` ve del body, un usuari pot crear metes fent-se passar per un altre usuari
- **Fuga de metes privades**: Si GET no filtra per `is_public`, metes de grup internes es mostren a tothom
- **Falta d'ownership check**: Si PUT/DELETE requereix `isAdmin` però l'autor no pot editar, es perd la funcionalitat de l'autor

### Accions al codi
- **⚠️ POST: Usar `req.user.id` per `author_id`** — Actualment es llegeix de `req.body.author_id`
- **⚠️ GET: Afegir filtre `is_public`** per usuaris no autenticats
- **⚠️ PUT/DELETE: Afegir ownership check** — L'autor ha de poder editar/eliminar. Mantenir `isAdmin` per admins.
- **✅ `isAdmin` no està a POST** (correcte, no calia)

---

## Grups (`/api/grups`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | **Pública*** | *Filtrar només grups públics (`is_public: true`) per usuaris no autenticats |
| GET | `/user/:userId` | `isAuthenticated` | Grups d'un usuari (membre o owner). Usa `req.user.id` per evitar enumeració. |
| GET | `/:id` | **Pública*** | *Filtrar només grups públics per usuaris no autenticats |
| POST | `/` | `isAuthenticated` | `owner_id` s'obté de `req.user.id` (NO del body) |
| PUT | `/:id` | `isAuthenticated` + **moderador check** | El controller verifica que l'usuari que edita el grup és moderador/owner d'aquest grup |
| DELETE | `/:id` | `isAuthenticated` + **owner check** | El controller verifica que l'usuari que vol eliminar el grup és l'owner (o admin) |

### Casos d'ús a protegir
- **Veure grups**: Tothom pot veure grups públics. Usuaris autenticats poden veure grups dels quals en són membres.
- **Crear grup**: Qualsevol usuari autenticat, assignant-se com a owner automàticament
- **Editar grup**: Moderadors/owner del grup (nom, descripció, visibilitat)
- **Transferir propietat**: Només l'owner actual
- **Eliminar grup**: Owner del grup o admin

### Riscos de no protegir-ho
- **Mass assignment d'`owner_id`**: Un atacant pot crear grups on l'owner és un altre usuari (suplantació)
- **Falta d'auth al POST**: Un bot pot crear grups massivament (spam)
- **Falta d'ownership check al PUT**: Qualsevol usuari autenticat pot editar qualsevol grup (canviar nom, descripció, robar la propietat canviant `owner_id`)
- **Falta d'ownership check al DELETE**: Qualsevol usuari autenticat pot eliminar qualsevol grup
- **Fuga de grups privats**: Si GET no filtra per `is_public`, grups interns es mostren a tothom

### Accions al codi
- **⚠️ POST: Requerir `isAuthenticated` i usar `req.user.id`** per `owner_id` — Actualment POST és públic i accepta `owner_id` del body
- **⚠️ GET: Afegir filtre `is_public`** per usuaris no autenticats
- **⚠️ PUT: Afegir moderador/owner check** al controller — Actualment només té `isAuthenticated` sense verificació
- **⚠️ DELETE: Afegir owner check** al controller — Actualment només té `isAuthenticated` sense verificació

---

## Assignacions (`/api/assignacions`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | **Pública*** | *Filtrar per visibilitat: només assignacions de grups públics o del propi usuari |
| GET | `/:id` | **Pública*** | *Mateix filtre de visibilitat |
| POST | `/` | `isAuthenticated` + **mod/owner check** | L'usuari ha de ser moderador/owner del grup o admin per assignar metes |
| PUT | `/:id` | `isAuthenticated` + **mod/owner check** | L'usuari ha de ser moderador/owner del grup o admin per modificar assignacions |
| DELETE | `/:id` | `isAuthenticated` + **mod/owner check** | L'usuari ha de ser moderador/owner del grup o admin per eliminar assignacions |

### Casos d'ús a protegir
- **Veure assignacions**: Tothom pot veure assignacions de grups públics. Usuaris autenticats veuen les seves i les del seu grup.
- **Crear assignació**: Moderador/owner del grup asigna una meta a un usuari del mateix grup
- **Editar assignació**: Moderador/owner del grup (canviar dates, prioritat, dificultat)
- **Eliminar assignació**: Moderador/owner del grup o admin

### Riscos de no protegir-ho
- **Qualsevol usuari autenticat** pot crear/modificar/eliminar assignacions de qualsevol grup, incloent-hi grups dels quals no és membre
- **Mass assignment de `assigner_id`**: Un usuari pot fer assignacions en nom d'un altre
- **Score arbitrari**: Un usuari pot assignar-se puntuacions al crear o editar assignacions
- **Fuga d'informació**: Assignacions de grups privats visibles públicament

### Accions al codi
- **⚠️ Afegir mod/owner check a POST/PUT/DELETE** — Actualment només tenen `isAuthenticated` sense verificació de pertinença al grup
- **⚠️ GET: Afegir filtre de visibilitat** — Mostrar només assignacions rellevants per a l'usuari
- **⚠️ POST: Usar `req.user.id` per `assigner_id`** — No confiar en el body

---

## Comentaris (`/api/comentaris`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | Pública | |
| GET | `/:id` | Pública | |
| POST | `/` | `isAuthenticated` + **pertany** | El validator verifica que l'usuari té relació amb l'assignació (assignat, autor, membre del grup, moderador, owner, admin) |
| PUT | `/:id` | `isAuthenticated` + **ownership check** | Només l'autor del comentari pot editar-lo |
| DELETE | `/:id` | `isAuthenticated` + **ownership + mod check** | L'autor pot eliminar el seu comentari. Moderador/owner del grup o admin poden eliminar qualsevol comentari del seu grup. |

### Casos d'ús a protegir
- **Llegir comentaris**: Tothom (públic, formen part de l'assignació)
- **Crear comentari**: Usuari relacionat amb l'assignació (l'assignat, l'assignador, membres del grup, moderadors, admins)
- **Editar comentari**: Només l'autor del comentari
- **Eliminar comentari**: L'autor, o moderador/owner del grup, o admin (per moderació)

### Riscos de no protegir-ho
- **Falta d'ownership check a PUT**: Qualsevol autenticat pot editar comentaris aliens (canviar el text, suplantar)
- **Falta d'ownership check a DELETE**: Qualsevol autenticat pot eliminar comentaris aliens (censura, vandalisme)

### Accions al codi
- **✅ POST: El validator ja comprova la relació** amb l'assignació (és el millor validat de tot el codi)
- **⚠️ PUT: Afegir ownership check** — Comparar `req.user.id` amb `comment.user_id`
- **⚠️ DELETE: Afegir ownership + mod check** — Permetre a l'autor, moderador/owner del grup, o admin

---

## Proves (`/api/proves`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | `isAuthenticated` | Només proves relacionades amb l'usuari o del seu grup |
| GET | `/:id` | `isAuthenticated` | Mateix filtre |
| POST | `/` | `isAuthenticated` + **pertany** | L'usuari ha de ser l'assignat de l'assignació o moderador/owner/admin |
| PUT | `/:id` | `isAuthenticated` + **mod/owner check** | Moderador/owner del grup pot validar (`is_valid`). L'autor de la prova pot editar el contingut. |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` | Només admin pot eliminar proves |

### Casos d'ús a protegir
- **Enviar prova**: Usuari assignat a una assignació envia una prova (text o imatge) per demostrar que l'ha completada
- **Validar prova**: Moderador/owner del grup accepta (`is_valid = true`) la prova, la qual cosa atorga la puntuació a l'usuari
- **Editar prova pròpia**: L'usuari que ha enviat la prova pot editar-la (mentre no estigui validada)
- **Eliminar prova**: Només admin (per moderació)

### Riscos de no protegir-ho (⚠️ **crític: auth comentada al codi**)
- **CRUD anònim total**: Qualsevol persona (sense autenticar) pot crear, veure, editar i eliminar proves
- **Auto-validació**: Un atacant pot marcar `is_valid = true` a qualsevol prova, obtenint puntuació indegudament
- **Fuga de proves d'usuari**: Les proves (text o imatges) són visibles per a qualsevol
- **Eliminació massiva**: Un atacant pot eliminar totes les proves del sistema

### Accions al codi
- **⚠️ CRÍTIC: Reactivar `isAuthenticated`** a POST, PUT, GET (descomentar línies 28-34 de `ProofRoutes.js`)
- **⚠️ CRÍTIC: Reactivar `isAdmin`** a DELETE
- **⚠️ Afegir ownership check a POST** — L'usuari ha de ser l'assignat de l'assignació
- **⚠️ Afegir mod/owner check a PUT** per `is_valid` — Només moderadors/owner/admin poden validar
- **⚠️ Multer: Validar tipus MIME real (magic bytes)** — No només extensió

---

## Invitacions (`/api/invitacions`)

Totes requereixen `isAuthenticated`. El controller verifica ownership internament amb `req.user.id` enlloc dels paràmetres de la ruta.

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/:userid/:sentorreceived/:status` | `isAuthenticated` | Usa `req.user.id` com a userId (ignora `:userid`) |
| POST | `/:senderid/:receiverid` | `isAuthenticated` | Usa `req.user.id` com a senderId (ignora `:senderid`). Envia invitació d'amistat. |
| POST | `/:senderid/:receiverid/:groupid` | `isAuthenticated` | Usa `req.user.id` com a senderId. Envia invitació de grup. |
| PUT | `/:receiverid/:id` | `isAuthenticated` | Accepta invitació: verifica `req.user.id === invitation.receiver.id` |
| DELETE | `/:id` | `isAuthenticated` | Rebutja/elimina invitació: verifica que l'usuari és sender o receiver |
| GET | `/friends/:userid` | `isAuthenticated` | Usa `req.user.id` com a userId (ignora `:userid`) |

> **Nota:** La ruta DELETE canvia de `/:userid/:id` a `/:id` perquè l'userId es treu del token.

### Casos d'ús a protegir
- **Veure invitacions**: L'usuari autenticat veu les seves pròpies invitacions (enviades o rebudes)
- **Enviar invitació**: L'usuari autenticat envia invitació en nom seu (no pot suplantar)
- **Acceptar invitació**: L'usuari destinatari de la invitació
- **Rebutjar/Eliminar invitació**: L'usuari que la va enviar o el destinatari
- **Veure amics**: L'usuari autenticat veu la seva pròpia llista d'amics

### Riscos de no protegir-ho
- Suplantació: un atacant podria enviar invitacions en nom d'un altre usuari
- Enumeració: veure invitacions d'altres usuaris
- Acceptar invitacions alienes

### Accions al codi
- **✅ Implementació correcta**: Totes les rutes usen `req.user.id` i ignoren els params de la ruta. És el recurs millor protegit.
- **⚠️ Opcional: Rate limiting** per evitar spam d'invitacions
- **⚠️ Opcional: URL de frontend configurable** — Actualment `http://localhost:5173` està hardcoded als emails

---

## Grups-Usuaris (`/api/grups-usuaris`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | Pública | Llistat de relacions (sense dades sensibles) |
| GET | `/:group_id/:user_id` | Pública | Consulta individual |
| POST | `/` | `isAuthenticated` | **Unir-se a grup:** Usa `req.user.id` com a `user_id`. Si el grup és públic, s'hi pot unir qualsevol. Si és privat, cal invitació. Moderador/owner/admin pot afegir altres usuaris. |
| PUT | `/:group_id/:user_id` | `isAuthenticated` + **mod/owner check** | Canvi de rol (member ↔ moderator): Només owner del grup o admin |
| DELETE | `/:group_id/:user_id` | `isAuthenticated` + **mod/owner check** | Expulsar/sortir: L'usuari es pot donar de baixa. Moderador/owner pot expulsar membres. Admin pot expulsar qualsevol. |

### Casos d'ús a protegir
- **Unir-se a grup**: Usuari autenticat (públic: automàtic; privat: via invitació). Moderador/owner/admin pot afegir membres.
- **Canviar rol**: Només l'owner del grup o admin pot promoure/destituir moderadors
- **Expulsar membre**: Moderador/owner pot expulsar membres (no moderadors). Owner pot expulsar moderadors. Admin pot expulsar qualsevol.
- **Sortir del grup**: L'usuari es pot donar de baixa voluntàriament

### Riscos de no protegir-ho (⚠️ **crític: cap auth al codi**)
- **CRUD anònim total**: Qualsevol persona pot afegir-se a qualsevol grup, escalar a moderador, o expulsar usuaris
- **Escalada de privilegis**: Un atacant es pot fer moderador de qualsevol grup via PUT
- **Segrest de grups**: Un atacant pot expulsar l'owner d'un grup i prendre'n el control
- **Fuga de dades**: Enumeració de tots els membres de tots els grups

### Accions al codi
- **⚠️ CRÍTIC: Afegir `isAuthenticated`** a POST, PUT, DELETE
- **⚠️ POST: Usar `req.user.id`** com a `user_id` si l'usuari s'uneix sol. Verificar rol si és moderador/owner/admin afegint algú altre.
- **⚠️ PUT: Verificar que l'usuari és owner del grup o admin** per canviar rols
- **⚠️ DELETE: Verificar que l'usuari és moderador/owner per expulsar, o és el propi usuari que surt**

---

## Indexa-Metas (`/api/indexa-metas`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| GET | `/` | Pública | Llistat d'indexacions (només aprovades per defecte) |
| GET | `/:id` | Pública | Consulta individual |
| POST | `/` | `isAuthenticated` | Usa `req.user.id` com a `user_id`. Un usuari pot proposar indexar una meta seva o del seu grup. |
| PUT | `/:id` | `isAuthenticated` + **rol check** | **Moderador/owner del grup** pot canviar `is_approved`. **Admin** pot canviar `is_community_approved`. |
| DELETE | `/:id` | `isAuthenticated` + `isAdmin` | Només admin pot eliminar indexacions |

### Casos d'ús a protegir
- **Veure indexacions**: Tothom pot veure quines metes estan indexades (públic)
- **Proposar indexació**: Usuari autenticat proposa una meta seva o del seu grup per ser indexada
- **Aprovar/rebutjar indexació de grup**: Moderador/owner del grup estableix `is_approved`
- **Aprovar/rebutjar indexació comunitària**: Admin estableix `is_community_approved`
- **Eliminar indexació**: Admin

### Riscos de no protegir-ho (⚠️ **crític: cap auth al codi**)
- **CRUD anònim total**: Qualsevol pot crear, editar i eliminar indexacions sense autenticació
- **Bypass del sistema d'aprovació**: Un atacant pot auto-aprovar-se indexacions (`is_approved`, `is_community_approved`)
- **Manipulació de quines metes apareixen com a públiques** a la plataforma

### Accions al codi
- **⚠️ CRÍTIC: Afegir `isAuthenticated`** a POST, PUT, DELETE
- **⚠️ CRÍTIC: Afegir `isAdmin`** a DELETE
- **⚠️ POST: Usar `req.user.id`** com a `user_id` (no del body)
- **⚠️ POST: No permetre establir `is_approved` ni `is_community_approved`** — Han de ser `null` per defecte
- **⚠️ PUT: Verificar rols** — Moderador/owner del grup per `is_approved`, admin per `is_community_approved`

---

## Assignació-Completions (`/api/assignacio-completions`)

| Mètode | Ruta | Protecció | Notes |
|--------|------|-----------|-------|
| POST | `/` | `isAuthenticated` + **ownership check** | Usa `req.user.id` com a `user_id`. Es crea automàticament quan un moderador valida una prova o manualment. |

### Casos d'ús a protegir
- **Completar assignació**: Només l'usuari assignat, un moderador/owner del grup, o un admin pot marcar una assignació com a completada

### Riscos de no protegir-ho (⚠️ **crític: cap auth al codi**)
- **Qualsevol persona** pot marcar qualsevol assignació com a completada, obtenint puntuació indegudament
- **No hi ha GET/DELETE** — Un cop creada, no es pot desfer via API

### Accions al codi
- **⚠️ CRÍTIC: Afegir `isAuthenticated`** a POST
- **⚠️ POST: Usar `req.user.id`** com a `user_id` (no del body)
- **⚠️ POST: Verificar que l'usuari és l'assignat, o moderador/owner del grup, o admin**
- ⚠️ **Considerar afegir** `DELETE /:id` per admins (per desfer completacions errònies)

---

## Cerca (`/api/search`)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| GET | `/` | Pública |

### Casos d'ús a protegir
- **Cercar**: Tothom pot cercar metes públiques, grups públics i usuaris
- **Protecció de dades sensibles**: Els resultats d'usuari NO han d'incloure `password` ni `restore_token`

### Riscos de no protegir-ho
- **⚠️ Fuga de contrasenyes**: El controller actual NO exclou `password` ni `restore_token` dels usuaris retornats. Les contrasenyes (hashejades) i tokens de restauració són visibles a qualsevol.
- **Enumeració**: La cerca permet trobar usuaris per nom parcial

### Accions al codi
- **⚠️ Afegir `omit: { password: true, restore_token: true }`** a la consulta d'usuaris al controller de cerca
- ✅ Les metes ja filtren per `is_public: true`
- ✅ Els grups ja filtren per `is_public: true`

---

## Auth (sense protecció)

| Mètode | Ruta | Protecció |
|--------|------|-----------|
| POST | `/api/login` | Pública |
| POST | `/api/restore-password/forgot` | Pública |
| POST | `/api/restore-password/restore` | Pública |

### Casos d'ús a protegir
- **Login**: Públic (cal poder autenticar-se)
- **Restaurar contrasenya**: Públic (cal poder recuperar l'accés sense estar autenticat)

### Riscos de no protegir-ho
- **El token de restauració es retorna al body** de la resposta de `/forgot` — Si un atacant intercepta la resposta (xarxa, XSS, etc.), pot canviar la contrasenya de l'usuari
- **No hi ha rate limiting**: Un atacant pot inundar el correu d'un usuari amb peticions de reset
- **La URL del frontend està hardcoded** (`http://localhost:5173`) als emails

### Accions al codi
- **⚠️ No retornar el token de restauració al body** — Enviar-lo només per email
- **⚠️ Afegir rate limiting** al login i al forgot-password (prevenir brute force i spam)
- **⚠️ Fer configurable la URL del frontend** via variable d'entorn

---

## Resum per Ruta

| # | Ruta | GET `/` | GET `/:id` | POST | PUT | DELETE |
|---|------|---------|------------|------|-----|--------|
| 1 | categories | pública | pública | **admin** | **admin** | **admin** |
| 2 | usuaris | **authed** (⚠️ codi) | **authed** (⚠️ codi) | pública | **auth+ownership** (⚠️ codi) | **admin** |
| 3 | metas | pública* | pública* | **auth** (⚠️ codi) | **auth+admin** (⚠️ codi) | **auth+admin** (⚠️ codi) |
| 4 | grups | pública* | pública* | **auth** (⚠️ codi) | **auth+mod** (⚠️ codi) | **auth+owner** (⚠️ codi) |
| 5 | assignacions | pública* | pública* | **auth+mod** (⚠️ codi) | **auth+mod** (⚠️ codi) | **auth+mod** (⚠️ codi) |
| 6 | comentaris | pública | pública | **auth+pertany** | **auth+owner** (⚠️ codi) | **auth+owner/mod** (⚠️ codi) |
| 7 | proves | **authed** (⚠️ codi) | **authed** (⚠️ codi) | **auth+pertany** (⚠️ codi) | **auth+mod** (⚠️ codi) | **admin** (⚠️ codi) |
| 8 | invitacions | — | — | **auth** | **auth** | **auth** |
| 9 | grups-usuaris | pública | pública | **auth** (⚠️ codi) | **auth+owner** (⚠️ codi) | **auth+mod/owner** (⚠️ codi) |
| 10 | indexa-metas | pública | pública | **auth** (⚠️ codi) | **auth+mod/admin** (⚠️ codi) | **admin** (⚠️ codi) |
| 11 | assignacio-completions | — | — | **auth+owner** (⚠️ codi) | — | — |
| 12 | search | pública (⚠️ codi) | — | — | — | — |
| 13 | login | — | — | pública | — | — |
| 14 | restore-password | — | — | pública (⚠️ codi) | — | — |

**Llegenda:**
- `pública*` = pública amb filtre `is_public: true` per usuaris no autenticats
- `(⚠️ codi)` = la protecció indicada és l'objectiu, però al codi actual falta implementar-la total o parcialment
- `mod` = moderador/owner del grup
- `owner` = propietari del recurs (ownership check amb `req.user.id`)
- `pertany` = verificació que l'usuari té relació amb l'assignació (assignat, autor, membre del grup, moderador, owner, admin)

---

## Resum d'Accions al Codi per Prioritat

### 🔴 Crítiques (risc immediat)
1. **Proves (`ProofRoutes.js`)**: Reactivar `isAuthenticated` i `isAdmin` (descomentar línies 28-34)
2. **Grups-Usuaris (`GroupUserRoutes.js`)**: Afegir `isAuthenticated` a POST, PUT, DELETE
3. **Indexa-Metas (`IndexedMetaRoutes.js`)**: Afegir `isAuthenticated` a POST, PUT, DELETE + `isAdmin` a DELETE
4. **Assignació-Completions (`AssignationCompletionsRoutes.js`)**: Afegir `isAuthenticated` + ownership check
5. **Cerca (`SearchController.js`)**: Afegir `omit: { password: true, restore_token: true }` a la query d'usuaris

### 🟡 Altues
6. **Grups (`GroupController.js`)**: Requerir auth al POST, owner/mod check a PUT/DELETE
7. **Metes (`MetaController.js`)**: Usar `req.user.id` per `author_id`, afegir ownership check a PUT/DELETE
8. **Assignacions (`AssignationController.js`)**: Afegir mod/owner check a POST/PUT/DELETE
9. **Comentaris (`CommentController.js`)**: Afegir ownership check a PUT/DELETE
10. **Usuaris (`UserController.js`)**: Afegir `isAuthenticated` a GET, requerir password actual al PUT
11. **Auth (`RestorePasswordController.js`)**: No retornar token al body, rate limiting, URL configurable

### 🟢 Millores
12. **Filtres `is_public`**: Afegir filtrat per visibilitat a GET de metas, grups, assignacions
13. **Rate limiting**: Login, forgot-password, invitacions
14. **Refactored controllers**: No usar `controllers/refactors/UserController.js` (fuga de passwords)
