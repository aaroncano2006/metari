# Wireframe (prototip de l'aplicació)

## Pàgines de l'aplicació, endpoints, redireccions del frontend i components.

- Home ( **/** o **/home** )
    - Navbar
        - Left Side:
            - Logo
            - Enllaç a Home
            - Enllaç a My Groups (Redirecciona a Register (/register) si no estàs loguejat)
            - Friends (Redirecciona a Register (/register) si no estàs loguejat)
        - Right Side:
            - Si estàs loguejat:
                - User Dropdown
                    - Enllaç a Profile
                    - Log Out
            - Si no estàs loguejat:
                - Enllaç a Register
                - Enllaç a Login
    - Searchbar
    - Discover List
    - My Groups List
    - Friends List + Ranking
- Register (/register, si estàs loguejat redirecciona a /home)
    - Formulari de registre per crear compte.
        - Camp nom visible (name) (si es deixa buit agafarà el username).
        - Camp d'usuari (username) (obligatori) (únic i disponible).
        - Camp email (email) (obligatori) (únic i disponible)
        - Password (obligatori i recomanable 12 caràcters de llarg)
        - Checkbox rememeber me
    - Enllaç a Login (Tens un compte? Inicia sessió)
- Login (/login, si estàs loguejat redirecciona a /home)
    - Formulari d'inici de sessió
        - Camp email o username
        - Password
        - Checkbox Remember Me
- Forgot Password
- Restore Password
- Profile
- My Groups
- Friends
- Group
- Admin Panel Home
- Admin Panel Users
- Admin Panel Groups
- Admin Panel Tasks
- Admin Panel Challenges
- Admin Panel Categories

## Paleta de colors

