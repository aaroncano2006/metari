# Estudi previ

# 1. Descripció del sistema

**Nom del projecte:** Metari

**Idea:**

Metari és una plataforma comunitària de reptes i gestió de tasques.

L'objectiu de l'aplicació és oferir una plataforma intuitiva i interactiva per gestionar tasques o competir amb els teus amics o altres usuaris dins de l'aplicació mitjançant grups.

**Convidat:**

- El convidat pot veure grups públics i el seu contingut però no podrà interactuar amb ell (no pot enviar proves de que ha completat el repte o tasca, no pot unir-se a grups ni afegir comentaris), també pot cercar-los per nom i categoria.

**Usuari registrat:**

- L'usuari pot crear i unir-se a grups, crear tasques o reptes dins dels grups als que pertany, opcionalmet compartir-los amb la comunitat, cercar grups per nom o categòria, afegir amics i personalitzar el seu perfil.

**Sistema d'amics:**

- El sistema d'amics comptarà amb un sistema de puntuació exclusiu de l'usuari registrat i el seu llistat d'amics.

- El sistema de puntuació de cada perfil d'usuari es basa en quants reptes han guanyat i quantes tasques han completat. En base a aquests paràmetres es monta el sistema de puntuació entre amics.

**Grups:**

- Dins dels grups es publicaran tasques o reptes.

- Dins dels grups hi haurà un sistema de puntuació entre els diferents usuaris en funció de quins reptes o tasques validats pels moderadors del grup ha completat l'usuari.

- Es poden adjuntar proves als reptes i tasques per demostrar que s'han completat. Gràcies a aquestes proves, el creador de la tasca o repte o qualsevol moderador podrà marcar que l'usuari ha completat el repte o tasca.

**Usuari moderador de grup:**

- Els usuaris que siguin moderadors de grup poden gestionar els membres, validar tots els reptes, i canviar el nom del grup i les seves categories.

**Usuari propietari del grup (owner):**

- L'usuari propietari de grup (owner) té control total sobre el grup, mateixos permisos que el moderador del grup però amb la diferència de que pot eliminar el grup.

- Si es vol sortir del grup, pot assignar un nou propietari.

**Admin de l'aplicació:**

- L'administrador de l'aplicació pot gestionar usuaris, grups, categòries, reptes, tasques i comentaris. Té control total de l'aplicació.

---

# 2. Requisits del sistema

### Requisits funcionals

| Codi | Descripció                                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| RF1  | Registrar usuaris                                                                                                                           |
| RF2  | Iniciar sessió                                                                                                                              |
| RF3  | Crear grups                                                                                                                                 |
| RF4  | Crear metes i categories                                                                                                                    |
| RF5  | Crear comentaris (útil per aclarar dubtes)                                                                                                  |
| RF6  | Administrar reptes/tasques                                                                                                                  |
| RF7  | Inscriure's a un grup                                                                                                                       |
| RF8  | Sortir d'un grup                                                                                                                            |
| RF9  | Cercar grup per nom o categories                                                                                                            |
| RF10 | Administrar un grup (usuari moderador de grup)                                                                                              |
| RF11 | Adjunció de proves (per demostrar que el repte s'ha completat)                                                                              |
| RF12 | Sistema de puntuació del grup (rànquing)                                                                                                    |
| RF13 | Sistema d'amics                                                                                                                             |
| RF14 | Sistema de puntuació entre amics                                                                                                            |
| RF15 | Personalització bàsica del perfil (canvi de nom visible, canvi de username, canvi de correu, canvi de contrasenya, canvi de foto de perfil) |
| RF16 | Administrar usuaris                                                                                                                         |
| RF17 | Administrar grups (tots els grups de l'aplicació)                                                                                           |
| RF18 | Administrar/validar reptes (totes les tasques de l'aplicació que es vulguin compartir amb la comunitat)                                     |
| RF19 | Administrar categories                                                                                                                      |

---

### Requisits no funcionals

| Categoria      | Requisit                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Seguretat      | Validació de camps, contrasenyes encriptades, ús de la llibreria Helmet per evitar vulnerabilitats comuns dels navegadors. |
| Rendiment      | Intentar que el temps de resposta de les peticions a l'API es realitzin el més ràpid possible.                             |
| Usabilitat     | Interfície Responsive i intuitiva.                                                                                         |
| Disponibilitat | Disponible 24 hores els 7 dies de la setmana excepte quan estigui en manteniment.                                          |
| Notificacions  | Sistema de notificacions bàsic (correu electrònic Nodemailer).                                                             |

---

# 3. Model de negoci

## Actors del sistema

| Actor                             | Accions Principals                                                                                                                                                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Guest                             | Pot veure grups públics i el seu contingut però no podrà interactuar amb ell. També pot cercar-los, però conservant la restricció d'interacció.                                                                                                                         |
| Usuari                            | Pot unir-se i crear grups, afegir amics, crear tasques, reptes i categòries dins del grup i opcionalment compartir-los amb la comunitat i administrar el seu perfil.                                                                                                    |
| Usuari moderador de grup          | Mateixos permisos que l'usuari, però aquest pot administrar els grups dels quals és moderador, valida el contingut del grup (tasques i reptes que publiquen els usuaris), afegir i eliminar usuaris (excepte el propietari/creador del grup) i canviar el nom del grup. |
| Usuari propietari de grup (owner) | Mateixos permisos que l'usuari moderador de grup, però aquest té control total de tots els grups on és propietari i pot eliminar el grup i canviar el propietari en cas d'abandonar un grup.                                                                            |
| Admin                             | Control total de l'aplicació. Modera grups, tasques, reptes, categòries i usuaris.                                                                                                                                                                                      |

## Diagrama de casos d'ús

![alt text](img/Casos-Us.png)

### Lectura ràpida del diagrama

- **Visitant**: Pot consultar grups i rankings, cercar-los i crear un compte.

- **Usuari registrat**: Pot iniciar sessió, gestionar el seu perfil, unir-se a grups, crear grups, crear reptes/tasques/categories dins dels grups als que pertany, afegir comentaris i afegir proves.

- **Usuari Moderador/Owner**: Mateixos permisos que l'usuari registrat, però dins del grup poden admnistrar totes les tasques i reptes que es publiquen (editar-les i eliminar-les) i administrar el grup (canviar el nom, canviar categories, administrar els membres (canviar el seu rol o expulsar-los, excepte l'owner), L'owner té control total del grup (incloent eliminació).)

- **Administrador**: Control total de l'aplicació. Pot administrar usuaris, tots els grups i administrar tasques, reptes i categories públiques.

Els permisos són acumulatius (Role Based Access Control (RBAC)), els rols superiors hereden les funcions dels inferiors.

# 4. Model conceptual (simplificat)

## Entitats principals:

**User**

- id
- nom
- username
- email
- password
- role (enum("User", "Admin")) (default: "User") (Distingueix entre usuari registrat i administrador de l'aplicació)
- completed_tasks (Comptador de tasques completades)
- score (Puntuació que es suma dels reptes que ha completat)
- restore_token (Token temporal per restaurar la contrasenya).
- created_at
- updated_at

**Group**

- id
- name
- description
- owner_id (FK → users.id) (Propietari del grup)
- is_public (Indica si el grup és públic o privat)
- created_at
- updated_at

**Meta** (objectiu) (entitat general per a reptes i tasques)

- id
- title
- description
- author_id (FK → users.id) (autor de la tasca o repte)
- group_id (FK → users.id) (autor de la tasca o repte)
- type (enum("challenge", "task")) (Indica si el tipus de meta és un repte o una tasca)
- created_at
- updated_at

**Category**

- id
- name
- description
- created_at
- updated_at

## Relacions Many to Many

**category_meta** (Permet assignar varies categories a varies meta)

- category_id (PK),
- meta_id (PK),
- created_at
- updated_at

**group_user** (Membres de cada grup i els seus rols dins d'aquests)

- group_id (PK, FK → groups.id)
- user_id (PK, FK → users.id)
- role (enum("member", "moderator")) (Rol de l’usuari dins del grup)

**Assignations** (Assignacions de metes a usuaris i grups)

- id
- group_id (A quin grup pertany aquesta assignació)
- meta_id (Quina meta està involucrada en aquesta assignació)
- user_id (A quin usuari s'ha assignat la meta, només si és de tipus tasca, ja que els reptes són de tot el grup).
- start_date (Data d'inici de l'assginació, és interessant que sigui una propietat de l'assignació ja que en cas de tornar la meta pública no quadraria que tingués la mateixa data en cas de per exemple publicar-la una setmana després en un altre grup, el mateix passa amb due_date).
- due_date (Data de venciment de la meta).
- priority (enum("high", "low"))
  difficulty (enum("easy", "normal", "hard", "extreme"))
  score
  completed (Indica si la tasca ha estat completada)
  created_at
  updated_at

Comportament:

- Si meta.type = "task" → assignació individual (user_id obligatori)
- Si meta.type = "challenge" → assignació grupal (user_id pot ser NULL)

**Comments** (Comentaris sobre assignacions)

- id
- assignation_id (FK → assignations.id)
- user_id (FK → users.id)
- body (Text del comentari)
- created_at
- updated_at

**Proofs** (Evidència de que la meta ha estat completada)

- id
- assignation_id (FK → assignations.id)
- user_id (FK → users.id)
- proof (URL o ruta de l’arxiu)
- is_valid (Indica si la prova ha estat validada)
- created_at
- updated_at

Comportament:

- Per tasques:
  - Quan is_valid = true → es marca assignations.completed = true
- Per reptes:
  - Permet saber quins usuaris han completat el repte dins del grup

**Invitations** (Invitacions d'amistat o d'unió a un grup)

- id
- sender_id (FK → users.id)
- receiver_id (FK → users.id)
- group_id (FK → groups.id)
- status (enum("pending", "accepted", "rejected"))
- created_at
- updated_at

**Index** (Ternaria entre usuaris, metes i grups)

- id
- user_id (FK → users.id)
- meta_id (FK → metas.id)
- group_id (FK → groups.id)
- is_public
- is_approved
- is_community_approved

Serveix com a sistema de:

- moderació
- visibilitat
- validació comunitària

![alt text](img/Metari_db_reverse-engineer.png)

## Model de dades

![alt text](img/diagrama-classes-3.png)

## Lectura ràpida del model de dades

Un usuari pot crear cap o molts grups.

Un usuari pot pertànyer a cap o a molts grups.

Cap o molts usuaris poden administrar cap o molts grups.

Un usuari pot enviar i rebre cap o moltes invitacions per a un grup (relació ternària central).

Un usuari pot ser l'autor de cap o moltes metes.

Un grup o molts grups poden contenir cap o moltes metes.

Una meta pot estar indexada en un grup sota la verificació d'un usuari (relació ternària inferior).

Una meta ha de tenir, com a mínim, una o més categories.

Una categoria pot estar assignada a cap o a moltes metes.

Un usuari pot tenir assignades cap o moltes metes (relació ternària superior).

Una assignació (vinclada a una meta i un usuari) pot rebre cap o molts comentaris.

Un usuari pot escriure cap o molts comentaris en una assignació.

Una assignació pot tenir vinculades cap o moltes proves (proofs).

Un usuari pot realitzar cap o moltes proves per a una assignació concreta.

---

# 5. Disseny inicial de la interfície (bàsic)

Per visualitzar millor com volem que sigui el frontend de Metari, hem especificat les principals pàgines i components en el [següent document](wireframe/planificacio-wireframe.md).

També hem realitzat un wireframe amb **Figma** per poder exemplificar millor com volem que es vegi el nostre frontend.

**Home**:

![alt text](wireframe/imgs/Home.png)

**Profile**:

![alt text](wireframe/imgs/Profile.png)

**Register, Login, Forgot Password i Restore Password forms**:

![alt text](wireframe/imgs/RegisterForm.png)

![alt text](wireframe/imgs/LoginForm.png)

![alt text](wireframe/imgs/ForgotPasswordForm.png)

![alt text](wireframe/imgs/RestorePasswordForm.png)

**Pàgina de grup (+ panell admin grup)**:

![alt text](wireframe/imgs/GroupPage.png)

**Panell d'administrador**:

![alt text](wireframe/imgs/AdminPanel.png)

---

# 6. Tecnologies utilitzades

**MERN Stack** (utilitzant MariaDB)

Frontend

- React (TypeScript)
- CSS
- Bootstrap

Backend

- Express JS
- API RESTful

ORM

- [Prisma](https://www.prisma.io/orm)

Base de dades

- MariaDB

Autenticació

- bcrypt -> Hash de contrasenyes
- JWT (JSONWebToken) -> Autenticació

Pujada de fitxers

- Multer

## Diagrama d'arquitectura

![alt text](img/diagrama-arquitectura.png)

---

# 7. Planificació inicial

| Fase | Descripció   |
| ---- | ------------ |
| 1    | Estudi previ |
| 2    | Backend API  |
| 3    | Frontend     |
| 4    | Integració   |
| 5    | Proves       |
| 6    | Documentació |
| 7    | Desplegament |


**Nota**: És possible que algunes fases del projecte s'hagin de realitzar a l'hora, per exemple, desenvolupar el backend i provar-ho o documentar mentre es desplega per tenir documentat com s'executa en local i com es posa en producció.