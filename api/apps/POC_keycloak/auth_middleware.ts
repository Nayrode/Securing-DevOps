// apps/POC_Keycloak/auth_middleware.ts

import type { HttpContext } from '@adonisjs/core/http'

export default class OidcAuthMiddleware {
  async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    if (!session.get('user')) {
      return response.unauthorized({ error: 'Not authenticated' })
    }

    await next()
  }
}
