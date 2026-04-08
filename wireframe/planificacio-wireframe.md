# Wireframe (prototip de l'aplicació)

## Pàgines de l'aplicació, endpoints, redireccions del frontend i components.

- **Home** ( **/** o **/home** )
    - Navbar
        - Left Side:
            - Logo
            - Enllaç a Home  
        - Right Side:
            - Enllaç a My Groups (Redirecciona a Register (/register) si no estàs loguejat)
            - Friends (Redirecciona a Register (/register) si no estàs loguejat)
            - Si estàs loguejat:
                - User Dropdown
                    - Enllaç a Profile
                    - Enllaç per accedir a l'admin panel (si estàs loguejat com l'administrador de l'aplicació)
                    - Log Out
            - Si no estàs loguejat:
                - Enllaç a Register
                - Enllaç a Login
    - Searchbar
    - Discover List
    - My Groups List
    - Friends List + Ranking

- **Register** (/register, si estàs loguejat redirecciona a /home)
    - Formulari de registre per crear compte.
        - Camp nom visible (name) (si es deixa buit agafarà el username).
        - Camp d'usuari (username) (obligatori) (únic i disponible).
        - Camp email (email) (obligatori) (únic i disponible)
        - Password (obligatori i recomanable 12 caràcters de llarg)
        - Checkbox rememeber me
    - Enllaç a Login (Tens un compte? Inicia sessió)

- **Login** (/login, si estàs loguejat redirecciona a /home)
    - Formulari d'inici de sessió
        - Camp email o username
        - Password
        - Checkbox Remember Me
    - Enllaç a Register (No tens compte? Registra't)
    - Enllaç a Forgot Password (Has oblidat la contrasenya?)

- **Forgot Password** (/forgot-password, si estpas loguejat redirecciona a /home)
    - Formulari de restaruar contrasenya
        - Camp email o username

- **Restore Password** (/reset-password?token=${token} (Token generat des del Backend))
    - Formulari de nova contrasenya amb confirmació
    
- **Profile**
    - Visualització del perfil (foto, nom de visualització, username)
    - Formulari per canviar les dades
        - Camp nom visible (name) (si es deixa buit agafarà el username).
        - Camp d'usuari (username) (obligatori) (únic i disponible).
        - Camp email (email) (obligatori) (únic i disponible)
        - Password (obligatori i recomanable 12 caràcters de llarg)
    - Visualitzacio dels grups del usuari
    - Visualitzacio dels amics del usuari
    
- **Group Admin Panel**  
    - Administrar les tasques i les asignacions
    - administrar usuaris del grup
    
- **Admin Panel Users/Groups/Categories/Metes**
    - Visualitzacio, edicio, eliminacio i creacio de Grups, Categories i Metes
    - visualitzacio d'estadistiques de l'aplicacio
    


## Paleta de colors



