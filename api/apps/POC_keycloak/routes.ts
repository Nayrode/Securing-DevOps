import OidcController from '#apps/POC_keycloak/oidc_controller'
import router from '@adonisjs/core/services/router'

router.get('/auth/keycloak/callback', async (ctx) => {
  return OidcController.callback(ctx)
})
