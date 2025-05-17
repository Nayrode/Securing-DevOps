// apps/POC_Keycloak/routes.ts

import router from '@adonisjs/core/services/router'
import OidcController from './oidc_controller.js'

router.get('/auth/keycloak/login', [OidcController, 'redirectToLogin'])
router.get('/auth/keycloak/callback', [OidcController, 'handleCallback'])
