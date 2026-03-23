# Estudi previ

---

## 1. Descripció del sistema

**Nom del projecte:** Metari

**Idea:**

Metari és una plataforma comunitària de reptes i gestió de tasques.

Els usuaris poden crear i unir-se a grups. 

Els usuaris que siguin administradors de grup poden gestionar els membres, crear i validar els reptes i opcionalment compartir el repte amb la comunitat, permitint que altres grups puguin utilitzar aquest repte.

Dins dels grups hi haurà un sistema de puntuació entre els diferents usuaris en funció de quins reptes o tasques validats per l'administador del grup ha completat l'usuari.

També hi haurà un sistema d'amics amb un ranking exclusivament entre tú i els teus amics.

L'administrador pot gestionar usuaris, grups, categòries, reptes, tasques i comentaris.

L'usuari pot crear i unir-se a grups, cercar-los per nom o categòria i afegir amics.

L'usuari administrador de grup té control total sobre el grup, pot publicar i gestionar tasques o reptes, gestionar els usuaris o eliminar el grup.

El convidat pot veure grups públics i el seu contingut però no podrà interactuar amb ell (no pot enviar proves de que ha completat el repte o tasca, no pot unir-se a grups ni afegir comentaris).

L'objectiu de l'aplicació és oferir una plataforma intuitiva i interactiva per gestionar tasques o competir amb els teus amics.

---

## 2. Requisits del sistema

### Requisits funcionals

| Codi | Descripció               |
| ---- | -------------------------|
| RF1  | Registrar usuaris        |
| RF2  | Iniciar sessió           |
| RF3  | Crear grups              |
| RF4  | Crear reptes/tasques/categories     |
| RF5  | Crear comentaris NOMÉS en la tasca (útil per aclarar dubtes)     |
| RF6  | Administrar reptes/tasques              |
| RF7  | Inscriure's a un grup    |
| RF8  | Cercar grup per nom o categories    |
| RF9  | Administrar un grup (usuari de grup)
| RF10  | Adjunció de proves (per demostrar que el repte s'ha completat)      |
| RF11  | Sistema de puntuació del grup (rànquing)
| RF12 | Sistema d'amics
| RF13 | Sistema de puntuació entre amics
| RF14 | Personalització bàsica del perfil (canvi de nom visible, canvi de username, canvi de correu, canvi de contrasenya, canvi de foto de perfil)
| RF15 | Sistema de notificacions bàsic (correu electrònic Nodemailer)
| RF16 | Administrar usuaris
| RF17  | Administrar grups (tots els grups de l'aplicació)
| RF18  | Administrar/validar reptes (totes les tasques de l'aplicació que es vulguin compartir amb la comunitat)
| RF19  | Administrar categories      |


---

### Requisits no funcionals

| Categoria      | Requisit                                       |
| -------------- | ---------------------------------------------- |
| Seguretat      | Validació de camps, contrasenyes encriptades, ús de la llibreria Helmet per evitar vulnerabilitats comuns dels navegadors.                                               |
| Rendiment      |   Intentar que el temps de resposta de les peticions a l'API es realitzin el més ràpid possible.                                             | 
| Usabilitat     |  Interfície Responsive i intuitiva.                                              | 
| Disponibilitat |  Disponible 24 hores els 7 dies de la setmana excepte  quan estigui en manteniment.                                              | 

---

## 4. Model de negoci

## Actors del sistema

| Actor            | Accions Principals                         |
| ---------------- | ----------------------------------- |
| Guest            |  Pot veure grups públics i el seu contingut però no podrà interactuar amb ell. |
| Usuari                 | Pot unir-se i crear grups, afegir amics, crear tasques, reptes i categòries per a la comunitat i administrar el seu perfil.    |
| Usuari administrador de grup  | Mateixos permisos que l'usuari, però aquest pot administrar els grups dels quals és propietari o administrador (publicar tasques i reptes, crear categòries només per els seus grups, administrar membres i configuracions del grup.) |
|  Admin    | Control total de l'aplicació. Modera grups, tasques, reptes, categòries i usuaris. |

## Diagrama de casos d'ús 

![alt text](diagrames/casos-us.png)

### Lectura ràpida del diagrama

- **Visitant**: pot consultar esdeveniments i crear un compte.
- **Usuari registrat**: pot iniciar sessió, gestionar el seu perfil i inscriure's a esdeveniments.
- **Organitzador**: a més de les funcionalitats bàsiques, pot crear i gestionar esdeveniments i controlar les inscripcions.
- **Administrador**: s'encarrega de moderar contingut i gestionar usuaris.

Aquest diagrama es pot adaptar fàcilment a altres temàtiques canviant actors i casos d'ús principals.
## 3. Model conceptual (simplificat)

### Entitats principals:

Usuari

- _id (MongoID)
- nom
- username
- profile_picture
- email
- password
- rol (User/Admin)
- completed_tasks
- wins (reptes guanyats)
- grups[] (many to many)
- timestamps

Grup

- _id (MongoID)
- nom
- tasques[]
- reptes[]
- categories[] (adicional/extra)
- membres[]
- admins[]
- author
- isPublic (boolean)
- timestamps

Tasca

- _id (MongoID)
- titol
- descripcio
- author
- start_date
- due_date
- proofs[
    {
        userId,
        filename
    }
]
- comments [
    {
        userId,
        body,
        timestamps
    }
]
- groups[]
- categories[]
- assigned_to[]
- completed_by[]
- difficulty
- score
- isPublic (boolean)
- timestamps

Repte

- id
- titol
- descripcio
- author
- start_date
- due_date
- proofs[
    {
        userId,
        filename
    }
]
- categories[]
- completed_by[]
- difficulty
- score
- isPublic (boolean)
- timestamps

Categoria

- id
- nom
- timestamps

Relacions:

Com la base de dades la farem a MongoDB no compta com a tal amb un sistema relacional, però amb arrays i referenciant IDs podem relacionar diversos documents.

Metari comptarà amb les següents relacions:

- **Usuari -> Grup:** Un usuari pot estar en diferents grups (document Usuari, camp groups[]). Un grup pot tenir diversos usuaris (document Grups, camps membres[], admins[] i author, per diferenciar usuaris sense permisos dins del grup, usuaris amb privilegis i el creador del grup, que per defecte també estarà al llistat d'administradors).

- **Usuari -> Tasca:** Un usuari pot ser autor de diferents tasques, però la tasca només pot tenir un autor (document Tasca, camp author). Una tasca pot tenir diferents usuaris assignats (document Tasca, camp assigned_to[]).

- **Usuari -> Repte:** Un usuari pot ser autor de diferents reptes, però el repte només pot tenir un autor (document Repte, camp author).

- **Tasca -> Grup:** Una tasca pot estar en diferents grups (document Tasca, camp groups[]. S'ha fet d'aquesta forma ja que l'autor de la tasca pot decidir compartir aquesta tasca amb la comunitat). Un grup pot tenir diverses tasques (document Grup, camp tasques[]).

**IMPORTANT:** Si una tasca compartida amb la comunitat (`isPublic = true`) s'utilitza en un altre grup podriem tenir problemes d'afegir dades d'altres grups (camp proofs[] amb les proves de que s'ha completat la tasca o repte, comentaris (camp comments[]) i groups[] amb tots els grups on està ubicada la tasca). Per solucionar-ho farem el següent:

- Quan un nou grup vulgui utilitzar una tasca compartida, mitjançant la id de la tasca original recuperem tots els camps amb els valors originals excepte `proofs[]` (el deixarem buit), `assigned_to[]` i `comments[]` (només existeixen a tasques, els deixarem buits), `completed_by[]` (el deixarem buit) `groups[]` (només el grup on es publiqui) i isPublic ho deixarem a `false`.

- Quan es publiqui simplement es crearà una còpia amb les dades ajustades per al grup on s'ha publicat aquesta tasca compartida.

Amb els **reptes** haurem de fer el mateix!!!

**Repte -> Grup:** Un repte pot estar en diferents grups (document Repte, camp groups[]. S'ha fet d'aquesta forma ja que l'autor del repte pot decidir compartir aquest repte amb la comunitat). Un grup pot tenir diverses tasques (document Grup, camp reptes[]).

**Categoria -> Grup:** Un grup pot tenir diverses categories (camp categories[]).

**Categoria -> Tasca:** Una tasca pot tenir diverses categories (document Tasca, camp categories[]).

**Categoria -> Repte:** Un repte pot tenir diverses categories (document Tasca, camp categories[]).

### Model de dades

![alt text](diagrames/model-dades.png)

### Lectura ràpida del model de dades



---

## 5. Disseny inicial de la interfície (bàsic)

Pantalles principals:

- Pàgina d'inici ()
- Detall d'esdeveniment
- Panells d'usuaris
- Formulari de creació
- Formularia de login
  
Exemple: 

![alt text](diagrames/wireframebasic.png)

---

## 6. Tecnologies utilitzades

**MERN Stack**

Frontend

- React (TypeScript)
- CSS
- Bootstrap

Backend

- Express JS
- API RESTful

Base de dades

- MongoDB
- Model de referències (Camp adicional per referenciar el document extern)

Autenticació

- bcrypt -> Hash de contrasenyes
- JWT (JSONWebToken) -> Autenticació

Pujada de fitxers

- Multer

### Diagrama d'arquitectura 



---

## 7. Planificació inicial

| Fase | Descripció   |
| ---- | ------------ |
| 1    | Estudi previ |
| 2    | Backend API  |
| 3    | Frontend     |
| 4    | Integració   |
| 5    | Proves       |
| 6    | Documentació |
| 7    | Desplegament |