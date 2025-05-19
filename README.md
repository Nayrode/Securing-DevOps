# POC-tad-keycloak
## Instruction de déployment

### 1. Lancement de Keycloak en local 
```bash
docker-compose up -d
```

### 2. Configuration de Keycloak
Accède à http://localhost:8080/admin
Connecte-toi avec admin / admin
On y retrouve :
* Un Realm : beep-realm
* Un Client : beep-client
* Un Utilisateur de test : vanilla / vanilla123

### 4. Lancement du POC
Dans un premier terminal lancer le back : 
```bash
./api_start.sh
```
Ouvrir un autre terminal et lancer le front :
```bash
./front_start.sh
```
Dans un troisième terminnal lancer Keycloak :
```bash
docker compose up --build
```

### 5. Accès à l'autentification via Keycloak
Vous pouvez accéder à la page d'authentification de Keycloak via le liens :
```bash
http://localhost:3333/auth/keycloak/login
```