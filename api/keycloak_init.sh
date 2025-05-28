#!/bin/bash

# Verifier si keycloak est lancé
/opt/keycloak/bin/kc.sh start-dev > /tmp/keycloak.log 2>&1 &
KEYCLOAK_PID=$!

echo "Attente du démarrage de Keycloak (via log)..."
until grep -q "Listening on: http://0.0.0.0:8080" /tmp/keycloak.log 2>/dev/null; do
  sleep 2
done

echo "Keycloak est prêt, configuration..."

# Auth admin
/opt/keycloak/bin/kcadm.sh config credentials \
  --server "$KEYCLOAK_BASE_URL" \
  --realm master \
  --user admin \
  --password admin

# Créer le realm
/opt/keycloak/bin/kcadm.sh create realms -s realm=beep-realm -s enabled=true

# Enable user registration (sign-up)
/opt/keycloak/bin/kcadm.sh update realms/beep-realm -s "registrationAllowed=true"

# Créer client frontend Angular
/opt/keycloak/bin/kcadm.sh create clients -r beep-realm \
  -s clientId=beep-client \
  -s enabled=true \
  -s publicClient=false \
  -s serviceAccountsEnabled=true \
  -s protocol=openid-connect \
  -s "redirectUris=[\"${KEYCLOAK_REDIRECT_URIS}\"]" \
  -s "webOrigins=[\"${FRONTEND_URL}\"]" \
  -s standardFlowEnabled=true \
  -s secret=beep-client-secret

# Ajouter un utilisateur de test
/opt/keycloak/bin/kcadm.sh create users -r beep-realm -s username=vanilla -s enabled=true

# Ajouter un mot de passe au user
/opt/keycloak/bin/kcadm.sh set-password -r beep-realm --username vanilla --new-password vanilla123

# Préparation du provider Google (remplis les ID à la main ou avec des vars d’env)
/opt/keycloak/bin/kcadm.sh create identity-provider/instances -r beep-realm \
  -s alias=google \
  -s providerId=google \
  -s enabled=true \
  -s 'config.clientId='"$GOOGLE_CLIENT_ID" \
  -s 'config.clientSecret='"$GOOGLE_CLIENT_SECRET" \
  -s 'config.defaultScope=openid email profile' \
  -s 'config.useJwksUrl=true' \
  -s 'config.syncMode=IMPORT'

echo "Configuration terminée"

wait $KEYCLOAK_PID