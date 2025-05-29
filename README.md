# POC-tad-keycloak
## Instruction de déployment

### 1. Lancement du POC
Dans un premier terminal lancer le back (qui lancera aussi keycloak) : 
```bash
./api_start.sh
```
Ouvrir un autre terminal et lancer le front :
```bash
./front_start.sh
```

### 2. Accès à l'autentification via Keycloak
Une fois que tout est lancé, vous pouvez accéder à la page d'authentification de Keycloak via le liens :
```bash
http://localhost:3333/auth/keycloak/login
```

### 3. Connection 
Vous povez vous connecter de trois manière différentes :
1. Avec un compte vanilla dejà crée vanilla / vanilla123
2. En créant un compte avec vos propres identifiants
3. Avec un compte google


### A noter :
Accès à keycloak au : http://localhost:8080/admin
Connection avec admin / admin
On y retrouve :
* Un Realm : beep-realm
* Un Client : beep-client
* Un utilisateur de test : vanilla / vanilla123