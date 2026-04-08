# Proposta de projecte de final de curs

**Integrants del grup:**

- Aarón Cano
- Adrià Borrás

---

## Idea

**Nom de l'aplicació:** Metari

**Descripció de la idea:**

Metari és una plataforma comunitària de reptes i gestió de tasques.

L'objectiu de l'aplicació és oferir una plataforma intuitiva i interactiva per gestionar "metes" ja siguin tasques o reptes, competir amb els teus amics o altres usuaris dins de l'aplicació mitjançant grups.

**Convidat:**

- El convidat pot veure grups públics i el seu contingut però no podrà interactuar amb ell (no pot enviar proves de que ha completat el repte o tasca, no pot unir-se a grups ni afegir comentaris), també pot cercar-los per nom i categoria.

**Usuari registrat:**

- L'usuari pot crear i unir-se a grups, crear metes dins dels grups als que pertany, opcionalmet compartir-los amb la comunitat, cercar grups per nom o categòria, afegir amics i personalitzar el seu perfil.

**Sistema d'amics:**

- El sistema d'amics comptarà amb un sistema de puntuació exclusiu de l'usuari registrat i el seu llistat d'amics.

- El sistema de puntuació de cada perfil d'usuari es basa en quants reptes han guanyat i quantes tasques han completat. En base a aquests paràmetres es monta el sistema de puntuació entre amics.

**Grups:**

- Dins dels grups es publicaran metes.

- Dins dels grups hi haurà un sistema de puntuació entre els diferents usuaris en funció de quines metes validats pels moderadors del grup ha completat l'usuari.

- Es poden adjuntar proves als reptes i tasques per demostrar que s'han completat. Gràcies a aquestes proves, el creador de la tasca o repte o qualsevol moderador podrà marcar que l'usuari ha completat el repte o tasca.

**Usuari moderador de grup:**

- Els usuaris que siguin moderadors de grup poden gestionar els membres, validar les metes, canviar el nom del grup i les seves categories.

**Usuari propietari del grup (owner):**

- L'usuari propietari de grup (owner) té control total sobre el grup, mateixos permisos que el moderador del grup però amb la diferència de que pot eliminar el grup.

- Si es vol sortir del grup, pot assignar un nou propietari.

**Admin de l'aplicació:**

- L'administrador de l'aplicació pot gestionar usuaris, grups, categòries, metes i comentaris. Té control total de l'aplicació.

## Principals funcionalitats:

- Personalitzar el perfil
- Consultar grups
- Cercar grups
- Afegir amics.
- Consultar rankings (amics i grups).
- Crear grups.
- Crear metes i categories dins dels grups. 
- Afegir proves de complecio de les metes.
- Compartir metes amb la comunitat.
- Administrar el grup, metes i categories i els usuaris del grup (Administradors de grup i Owner del grup)
- Administrar tots els usuaris, grups, metes i categories de l'aplicació. Control total (només admin).

## Ús d'API externa:

No tenim pensat l'ús de cap API externa. Desenvoluparem un backend basat en API RESTful i desenvolupat en ExpressJS, es faran les peticions a aquesta API interna i es desarà en la nostra base de dades MongoDB.