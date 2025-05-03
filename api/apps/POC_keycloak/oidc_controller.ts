import axios from 'axios'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

export default class OidcController {
  /**
   * Gère le callback après redirection de Keycloak
   * Échange le "code" reçu contre un token d'accès.
   */
  static async callback({ request, response }: HttpContext) {
    const code = request.input('code')
    const redirectUri = env.get('KEYCLOAK_REDIRECT_URI')

    if (!code) {
      return response.badRequest({ error: 'Code OIDC manquant' })
    }

    try {
      // Step 1: Exchange code for token
      const tokenResponse = await axios.post(
        `${env.get('KEYCLOAK_BASE_URL')}/realms/${env.get('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: env.get('KEYCLOAK_CLIENT_ID'),
          client_secret: env.get('KEYCLOAK_CLIENT_SECRET'),
          code,
          redirect_uri: redirectUri,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      const tokens = tokenResponse.data

      // Step 2: Fetch user information using the access token
      const userInfoResponse = await axios.get(
        `${env.get('KEYCLOAK_BASE_URL')}/realms/${env.get('KEYCLOAK_REALM')}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      )

      const userInfo = userInfoResponse.data

      return response.ok({
        message: 'Authentification réussie via Keycloak',
        tokens,
        user: userInfo,
      })
    } catch (error) {
      console.error('OIDC callback error:', error.response || error)
      return response.internalServerError({
        error: 'Erreur lors de la récupération du token',
        details: error.response?.data || error.message,
      })
    }
  }
}
