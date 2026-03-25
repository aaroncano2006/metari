# Proposta de projecte de final de curs

**Integrants del grup:**

- Aarón Cano
- Adrià Borrás

---

## Idea

**Nom de l'aplicació:** Metari

**Descripció de la idea:**

Metari és una plataforma comunitària de reptes i gestió de tasques.

L'objectiu de l'aplicació és oferir una plataforma intuitiva i interactiva per gestionar tasques o competir amb els teus amics o altres usuaris dins de l'aplicació mitjançant grups.

**Convidat:**

- El convidat pot veure grups públics i el seu contingut però no podrà interactuar amb ell (no pot enviar proves de que ha completat el repte o tasca, no pot unir-se a grups ni afegir comentaris), també pot cercar-los per nom i categoria.

**Usuari registrat:**

- L'usuari pot crear i unir-se a grups, crear tasques o reptes dins del grup, validar només els seus reptes o tasques, opcionalmet compartir-los amb la comunitat, cercar grups per nom o categòria, afegir amics i personalitzar el seu perfil.

**Sistema d'amics:**

- El sistema d'amics comptarà amb un sistema de puntuació exclusiu de l'usuari registrat i el seu llistat d'amics.

- El sistema de puntuació de cada perfil d'usuari es basa en quants reptes han guanyat i quantes tasques han completat. En base a aquests paràmetres es monta el sistema de puntuació entre amics.

**Grups**

- Dins dels grups hi haurà un sistema de puntuació entre els diferents usuaris en funció de quins reptes o tasques validats pels administradors del grup ha completat l'usuari.

- Es poden adjuntar proves als reptes i tasques per demostrar que s'han completat. Gràcies a aquestes proves, el creador de la tasca o repte o qualsevol administrador podrà validar que s'ha completat.

**Usuari administrador de grup:**

- Els usuaris que siguin administradors de grup poden gestionar els membres, crear i validar tots els reptes i opcionalment compartir-los amb la comunitat, permitint que altres grups puguin utilitzar aquest repte.

**Usuari propietari del grup (owner):**

- L'usuari propietari de grup (owner) té control total sobre el grup, pot publicar i gestionar tasques o reptes, gestionar els usuaris o eliminar el grup.

**Admin de l'aplicació:**

- L'administrador pot gestionar usuaris, grups, categòries, reptes, tasques i comentaris. Té control total de l'aplicació.

## Principals funcionalitats:

- Personalitzar el perfil
- Consultar grups
- Cercar grups
- Afegir amics.
- Consultar rankings (amics i grups).
- Crear grups.
- Crear tasques, reptes i categories dins dels grups. 
- Compartir tasques i reptes amb la comunitat.
- Administrar el grup, els reptes, tasques i categories i els usuaris del grup (Administradors de grup i Owner del grup)
- Administrar tots els usuaris, grups, reptes i categories de l'aplicació. Control total (només admin).

## Ús d'API externa:

No tenim pensat l'ús de cap API externa. Desenvoluparem un backend basat en API RESTful i desenvolupat en ExpressJS, es faran les peticions a aquesta API interna i es desarà en la nostra base de dades MongoDB.