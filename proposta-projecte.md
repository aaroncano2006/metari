# Proposta de projecte de final de curs

**Integrants del grup:**

- Aarón Cano
- Adrià Borrás

---

## Idea

**Nom de l'aplicació:** Metari

**Descripció de la idea:**

Metari és una plataforma comunitària de reptes i gestió de tasques.

Els usuaris poden crear i unir-se a grups. 

Els usuaris que siguin administradors de grup poden gestionar els membres, crear i validar els reptes i opcionalment compartir el repte amb la comunitat, permitint que altres grups puguin utilitzar aquest repte.

Dins dels grups hi haurà un sistema de puntuació entre els diferents usuaris en funció de quins reptes o tasques validats pels administradors del grup ha completat l'usuari.

També hi haurà un sistema d'amics amb un ranking exclusivament entre tú i els teus amics.

L'administrador pot gestionar usuaris, grups, categòries, reptes, tasques i comentaris. Té control total de l'aplicació.

L'usuari pot crear i unir-se a grups, crear tasques o reptes dins del grup, cercar grups per nom o categòria i afegir amics.

L'usuari propietari de grup (owner) té control total sobre el grup, pot publicar i gestionar tasques o reptes, gestionar els usuaris o eliminar el grup.

L'usuari administrador de grup pot publicar i gestionar tasques o reptes i gestionar els usuaris excepte l'owner.

El convidat pot veure grups públics i el seu contingut però no podrà interactuar amb ell (no pot enviar proves de que ha completat el repte o tasca, no pot unir-se a grups ni afegir comentaris).

L'objectiu de l'aplicació és oferir una plataforma intuitiva i interactiva per gestionar tasques o competir amb els teus amics o altres usuaris dins de l'aplicació mitjançant grups.

**Principals funcionalitats:**

- Personalitzar el perfil
- Consultar grups
- Cercar grups
- Crear grups
- Crear tasques, reptes i categories dins dels grups. 
- Compartir tasques i reptes amb la comunitat.
- Administrar el grup, els reptes, tasques i categories i els usuaris del grup (Administradors de grup i Owner del grup)
- Administrar tots els usuaris, grups, reptes i categories de l'aplicació. Control total (només admin).

**Ús d'API externa:**

No tenim pensat l'ús de cap API externa. Desenvoluparem un backend basat en API RESTful i desenvolupat en ExpressJS, es faran les peticions a aquesta API interna i es desarà en la nostra base de dades MongoDB