# POC-tad-keycloak
## Instruction de déployment

### 1. Lancement de Keycloack en local 
```bash
docker-compose up -d
```

### 2. Accès à l'autentification via Keycloak
```bash
http://localhost:8080/realms/beep-realm/protocol/openid-connect/auth?client_id=beep-client&response_type=code&scope=openid&redirect_uri=http://localhost:3333/auth/keycloak/callback
```