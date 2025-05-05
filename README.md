# POC-tad-keycloak
## Instruction de déployment

### 1. Lancement de Keycloak en local 
```bash
docker-compose up -d
```

### 2. Configuration de Keycloak
Accède à http://localhost:8080/admin
Connecte-toi avec admin / admin
Étapes rapides :
* Créer un Realm : beep-realm
* Créer un Client : beep-client
    * Client Type : OpenID Connect
    * Client authentication : ON
    * Root URL : http://localhost:3333
    * Valid redirect URIs : http://localhost:3333/auth/keycloak/callback
    * Enregistre, récupère ton client_secret
* Créer un Utilisateur de test dans Users avec mot de passe défini

### 3. Modification du .env
changer la valeur de la variable ```KEYCLOAK_CLIENT_SECRET``` avec la valuer du client crée.

### 4. Lancement du projet
```bash
./api_start.sh
```
Ouvrir un autre terminal 
```bash
./front_start.sh
```

### 5. Accès à l'autentification via Keycloak
```bash
http://localhost:8080/realms/beep-realm/protocol/openid-connect/auth?client_id=beep-client&response_type=code&scope=openid&redirect_uri=http://localhost:3333/auth/keycloak/callback
```