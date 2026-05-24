# Metari - Manual d'Usuari 

## 1. Introducció

### 1.1 Què és Metari

Metari és una plataforma comunitària de gestió de metes (objectius), ja siguin tasques individuals o reptes en grup. Permet crear, assignar i fer seguiment d'objectius dins de grups, competir amb amics mitjançant un sistema de puntuació, i compartir metes amb la comunitat.

### 1.2 Públic objectiu

Metari està dissenyat per a qualsevol persona que vulgui gestionar objectius personals o en grup, ja sigui per motivació pròpia, per competir amb amics, o per organitzar tasques dins d'un equip.


### 2.3 Funcionalitats principals

- Creació de metes (tasques individuals i reptes en grup).
- Gestió de grups (públics i privats).
- Assignació de metes a usuaris amb terminis, prioritat i dificultat.
- Sistema de proves si es vol verificar la compleció de metes (amb text o imatges).
- Afegir metes a la comunitat.
- Validació de proves i metes afegides per part de moderadors de grup.
- Sistema d'amics.
- Rànquings per grup i per usuari.
- Panell d'administració de l'aplicació.

---

## 3. Accés a l'aplicació

### 3.1 URL d'accés

L'aplicació està disponible a l'URL que correspongui segons el desplegament. Per defecte, en entorn local:

```
http://localhost
```

### 3.2 Registre de nou usuari

1. Accedeix a la pàgina de registre des de la barra de navegació (botó "Registra't").
2. Omple els camps del formulari.   
3. Fes clic a "Registra't" per crear el compte.


###  3.3 Inici de sessió

1. Accedeix a la pàgina de login des de la barra de navegació (botó "Login").
2. Introdueix el teu **correu electrònic** o **nom d'usuari**.
3. Introdueix la teva **contrasenya**.
4. Fes clic a "Login".


###  3.4 Recuperació de contrasenya

1. Des de la pàgina de login, fes clic a "Has oblidat la teva contrasenya?".
2. Introdueix el teu correu electrònic o nom d'usuari.
3. Rebràs un correu amb un enllaç per restablir la contrasenya.
4. Fes clic a l'enllaç del correu.
5. Introdueix la nova contrasenya.
6. Fes clic a "Restore Password".

**Nota:** L'enllaç de recuperació té una durada limitada. Si caduca, l'hauràs de sol·licitar de nou.



## 4. Navegació general

### 4.1 Barra de navegació 

La Barra de navegació es mostra fixa a la part superior de totes les pàgines i conté:

- **Sempre**:  
    - Home: anar a la plana principal 
- **sense sessió iniciada:**
  - Registra't: anar al registre d'usuaris
  - Login: iniciar sessió
- **amb sessió iniciada:**
  - My Groups: veure els teus grups
  - Logout: tancar sessió
  - Menú d'usuari desplegable (mès al seguent punt)

#### Imatges de referencia:  
  -   **sense sessió iniciada:**

  ![alt text](img/image.png)

  - **amb sessió iniciada:**

  ![alt text](img/image-1.png)


### 4.2 Menú d'usuari

Quan tens la sessió iniciada, la barra de navegació mostra un menú desplegable amb el teu nom d'usuari. Les opcions disponibles són:

- **Perfil:** veure i editar el teu perfil
- **Logout:** Tancar la sessió
- **Admin Panel:** Accés al panell d'administració (només per a administradors de la app) 

### 4.3 Cercador

A la pagina "home" podem trobar el cercador.

Per utilitzar-lo, escriu el terme de cerca i prem "Enter" o fes clic a la lupa. Els resultats es mostraran a la pàgina de cerca.

### 4.4 Pagina de cerca

En aquesta pagina podem explorar el contingut disponible de l'aplicacio pels termes de cerca entrats.

Hi ha tres botons disponibles per escollir el que es vol trobar:
- **Metes públiques**
   - Per categories de les metes.
   - Per tipus de meta (tasks / challenges)
- **Usuaris registrats**
- **Grups públics**

---

#### Imatges de referencia:

![alt text](img/image-2.png)



## 5. Gestió del perfil d'usuari

Podem anar al nostre perfil d'usuari al menu desplegable amb el nom del nostre usuari de la barra de navegació.

![alt text](img/image-4.png)

### 5.1 Visualització del perfil

El teu perfil mostra:
- Foto de perfil
- Nom visible
- Nom d'usuari
- Estadístiques d'usuari (tasques completades, puntuació)
- Llista de grups als quals pertanyes
- Llista d'amics
- Estat de les metes creades per l'usuari


### 5.2 Edició del perfil

Per editar el teu perfil:

1. Accedeix al menú d'usuari i fes clic a "Perfil".
2. Utilitza el formulari d'edició per canviar:
   - **Nom:** ha de ser únic
   - **Nom d'usuari:** ha de ser únic
   - **Correu electrònic:** ha de ser únic
   - **Contrasenya:** 8 caracters minim   
3. Fes clic a "Desa" per desar els canvis.

### 5.3 Estadístiques d'usuari

El perfil mostra les següents estadístiques:
- **Puntuació total** — suma de punts obtinguts per completar metes
- **Tasques completades** — nombre total de metes completades

#### Imatge de referencia:

![alt text](img/image-5.png)

---



## 6. Sistema de rols i permisos

Metari utilitza un sistema de control d'accés basat en rols (RBAC). Els permisos són acumulatius: cada rol hereta els permisos del rol anterior.

| Rol | Descripció | Accions principals |
|-----|-----------|-------------------|
| **Convidat (Guest)** | Usuari sense sessió iniciada | Veure grups públics i el seu contingut, cercar grups i usuaris |
| **Usuari registrat** | Usuari amb sessió iniciada | Crear i unir-se a grups, crear metes, afegir amics, enviar proves, comentar, personalitzar el perfil |
| **Moderador de grup** | Usuari amb rol de moderador dins d'un grup | Gestionar membres, validar proves, editar nom i categories del grup i expulsar membres |
| **Administrador (Admin)** | Administrador global de l'aplicació | Accés al panell d'administració, gestió de tots els usuaris, grups, metes, categories i comentaris |


---

## 7. Gestió de grups

### 7.1 Tipus de grups

| Tipus | Visibilitat | Accés |
|-------|-------------|-------|
| **Públic** | Visible per a tothom | Unió directa sense invitació |
| **Privat** | Visible només per als membres | Unió únicament per invitació |

### 7.2 Rols dins del grup

| Rol | Permisos dins del grup |
|-----|----------------------|
| **Membre:** | Participar en metes, enviar proves, comentar |
| **Moderador:** | Gestionar membres, validar proves, editar informació del grup |

**Nota:** Els moderadors tenen les mateixes funcionalitats que els membres.

### 7.3 Crear un grup

1. Accedeix a "Home" des de la barra de navegació.
2. Fes clic a "Create Group".
3. Omple la informació del grup:
   - **Nom del grup:** (obligatori)
   - **Descripció:** (opcional)
   - **Tipus de grup:** públic (visible i accessible per a tothom) o privat (només per invitació)
4. Fes clic a "Create".

![alt text](img/image-6.png)

### 7.4 Unir-se a un grup

- **Grup públic:** Fes una cerca del nom del grup al que vols unir-te, despres clica al botó verd "unir-se"
- **Grup privat:** necessites una invitació d'un membre o moderador del grup.

![alt text](img/image-7.png)


### 7.5 Gestió del grup (Moderadors del grup)

Des de la pàgina de "Els meus grups", si ets moderador del grup clica el botó de configuració/moderació del grup:
- Veure la llista de membres.
- Canviar el rol d'un membre (membre / moderador).
- Expulsar un membre del grup.

![alt text](img/image-9.png)


### 7.5.1 Editar i eliminar grup

Al panell "Configuració de grup" podem:

- **Editar:** el moderador pot canviar el nom, descripció i categories del grup des de la pàgina del grup.
- **Eliminar:** només l'owner pot eliminar el grup. En cas de voler abandonar el grup sent l'owner, cal transferir la propietat a un altre membre abans de sortir.

![alt text](img/image-10.png)

### 7.5.2 Administrar membres del grup

Al panell "Membres del grup" podem:

- **Convidar a un usuari**
- **Expulsar a un usuari**
- **Canviar el rol a un usuari**

![alt text](img/image-11.png)

### 7.5.3 Administrar metas del grup

Al panell "Metas del grup" podem:

- **Veure les tasques del grup amb els usuaris asignats a cada tasca**
- **Veure i acceptar proves adjuntades dels usuaris a les tasques**
- **Veure i crear comentaris de les tasques**
- **Eliminar tasques del grup**

![alt text](img/image-13.png)
corregir!

- **Aprobar o rebutjar tasques indexades al grup**

![alt text](img/image-14.png)

corregir!

---

## 8. Gestió de metes

### 8.1 Tipus de metes

| Tipus | Descripció | Assignació |
|-------|-----------|-----------|
| **Task** (tasca) | Meta individual per a un sol usuari | S'assigna a un usuari específic del grup |
| **Challenge** (repte) | Meta per a tot el grup | Tots els membres del grup poden completar-lo |

### 8.2 Crear una meta

1. Des de la pagina "home", fes clic a "Create Meta".
2. Omple la informació:
   - **Títol** (obligatori)
   - **Descripció** (opcional)
   - **Tipus de meta:** "Task" (tasca individual) o "Challenge" (repte grupal)
   - **Categoria** (selecciona una de les disponibles)
   - **Es publica?** (si es fa pública per la comunitat)
3. Fes clic a "Crea la meta".

![alt text](img/image-15.png)


### 8.2.1 Meta publica

   Cuan es crea una meta pública, tots els usuaris de l'aplicacio podran veure i assignar la meta tant per a us personal com per afegirla a un grup.

### 8.2.2 Meta privada

   Cuan no volem que la meta sigui publica, s'auran d'especificar camps adicionals:

   - **Data d'inici** (Per defecte avui)
   - **Data de venciment** (opcional)
   - **Prioritat:** alta / baixa / sense prioritat
   - **Dificultat:** fàcil / normal / difícil / extrema
   - **Puntuació al completar:** (Nomes si es un Challenge)
   - **Grup a assignar:**
   - **Usuari del grup a assignar:** (Només si es una "task")


![alt text](img/image-16.png)

---


## 9. Assignacions de metas de la comunitat

### 9.1 Afegir metes personals a la teva llista

1. Des de la pàgina "home" o des dels resultats del cercador, selecciona la meta que vols assignar.
2. Fes clic a "Afegir a la meva llista".
3. A la barra de navegació al apartat "Les meves metas" pots veure la llista de les teves metas.

![alt text](img/image-17.png)

### 9.2 Assignar metes a usuaris del grup

1. Des de la pàgina "home", selecciona la meta que vols assignar.
2. Fes clic a "Assigna a un grup".
3. Omple el formulari:
   - **Grup al que es vol assignar**
   - **usuari del grup al que es vol assignar** (només si es "task")
   - **Data d'inici**
   - **Data de venciment** (opcional)
   - **Prioritat** alta / baixa
   - **Dificultat** fàcil / normal / difícil / extrema
   - **Puntuació** (Només si es "challenge")
4. Fes clic a "Afegeix la meta".

![alt text](img/image-18.png)




### 9.3 Completar una assignació personal

1. Anar a la pagina "Les meves metes", selecciona la meta que has completat.
2. Fes clic a "Marcar completada".


### 9.4 Afegir comentaris a les assignacions de grup

1. Anar a la pàgina "Els meus grups"
2. Busca el grup i la meta corresponent.
3. Prem el botó "Afegeix un comentari".
4. Escriu el comentari a afegir.
4. Fes clic a "Crea el comentari".

Els comentaris són útils per aclarir dubtes sobre la meta o l'assignació.

---

## 10. Proves

### 10.1 Pujar proves

Quan completes una assignació, pots adjuntar una prova:

- **Text:** descripció de com s'ha completat la meta.
- **Imatge:** captura de pantalla, foto o qualsevol evidència visual.

Per pujar una prova:

1. Anar a la pàgina "Els meus grups"
2. Busca el grup i la meta corresponent.
3. Fes clic a "Enviar prova".
4. Selecciona el tipus de prova (text o imatge).
5. Introdueix el text o selecciona el fitxer d'imatge.
6. Fes clic a "Submit".

![alt text](img/image-19.png)


---

## 11. Sistema d'amics

### 11.1 Enviar invitació d'amistat

1. Cerca l'usuari que vols afegir com a amic mitjançant el cercador.
2. Accedeix al seu perfil.
3. Fes clic a "Afegir amic".
4. L'usuari rebrà una invitació d'amistat.

![alt text](img/image-20.png)

### 11.2 Acceptar / rebutjar invitacions

1. Des del teu perfil o des de la llista d'invitacions, veuràs les invitacions d'amistat pendents.
2. Per a cada invitació, pots:
   - **Acceptar:** passarà a formar part de la teva llista d'amics.
   - **Rebutjar:** la invitació es descarta.

### 11.3 Llista d'amics

Al teu perfil es mostra la llista d'amics acceptats. Des d'aquí pots veure el perfil i la puntuació de cada amic.

[imatge]

---

## 12. Rànquings i leaderboards

### 12.1 Rànquing per grups

Per cada grup públic, es mostra un rànquing basat en la suma total de punts dels integrants del grup.

![alt text](img/image-21.png)


### 12.2 Puntuacions d'usuari

Cada usuari té una puntuació global que es mostra al seu perfil:
- Nombre de metes completades.
- La suma de punts de challenges completats en tots els grups

![alt text](img/image-22.png)

---

## 14. Panell d'administració

### 14.1 Accés al panell

Només els usuaris amb rol d'administrador poden accedir al panell d'administració per realitzar totes les operacions CRUD, disponible des del menú d'usuari de la barra de navegació.

### Gestió de metes

- Visualitzar totes les metes de l'aplicació
- Crear noves metes
- Editar metes
- Eliminar metes

### Gestió de categories

- Visualitzar categories disponibles
- Crear noves categories
- Editar categories
- Eliminar categories

### Gestió d'usuaris

- Visualitzar llista d'usuaris
- Editar dades d'usuaris
- Eliminar usuaris

### Gestió de grups

- Visualitzar tots els grups (públics i privats)
- Editar informació dels grups
- Eliminar grups

### Gestió de categories

- Visualitzar categories disponibles
- Crear noves categories
- Editar categories existents
- Eliminar categories

![alt text](img/image-23.png)


### 14.2 Metes pendents d'indexar

Des del "panell admin", l'administrador pot revisar les metes pendents d'aprovació a la comunitat:
- **Aprovar** la meta per a la comunitat
- **Rebutjar** la proposta

![alt text](img/image-24.png)


