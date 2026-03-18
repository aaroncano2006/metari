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
| Seguretat      |                                                |
| Rendiment      |                                                |
| Usabilitat     |                                                |
| Disponibilitat |                                                |

---

## 4. Model de negoci

## Actors del sistema

| Actor            | Accions Principals                         |
| ---------------- | ----------------------------------- |
|                  | Pot consultar esdeveniments públics i registrar-se   |
|                  | Pot inscriure's a esdeveniments     |
|                  | Pot crear i gestionar esdeveniments |
|                  | Modera contingut i gestiona usuaris |

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

- id
- nom
- email
- rol

Esdeveniment

- id
- titol
- data
- ubicacio

Inscripcio

- id
- usuari\_id
- esdeveniment\_id

Relacions:

Usuari (1) —— (N) Inscripcio (N) —— (1) Esdeveniment
### Model de dades

![alt text](diagrames/model-dades.png)

### Lectura ràpida del model de dades

- Usuari representa qualsevol persona registrada al sistema.
- Un usuari organitzador pot crear diversos esdeveniments.
- Un usuari registrat es pot inscriure a diversos esdeveniments.
- La taula Inscripcio resol la relació entre usuaris i esdeveniments i permet guardar informació pròpia de la inscripció.

---

## 5. Disseny inicial de la interfície (bàsic)

Pantalles principals:

- Pàgina d'inici (llista d'esdeveniments)
- Detall d'esdeveniment
- Panells d'usuaris
- Formulari de creació
- Formularia de login
  
Exemple: 

![alt text](diagrames/wireframebasic.png)

---

## 6. Tecnologies utilitzades

Frontend

- React
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