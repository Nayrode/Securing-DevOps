// apps/POC_Keycloak/oidc_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import axios from 'axios'
import User from '#apps/users/models/user'
import { DateTime } from 'luxon'

export default class OidcController {
  /**
   * Start login by redirecting to Keycloak login URL
   */
  async redirectToLogin({ response }: HttpContext) {
    const redirectUri = `${env.get('KEYCLOAK_BASE_URL')}/realms/${env.get('KEYCLOAK_REALM')}/protocol/openid-connect/auth` +
      `?client_id=${env.get('KEYCLOAK_CLIENT_ID')}` +
      `&redirect_uri=${encodeURIComponent(env.get('KEYCLOAK_REDIRECT_URI'))}` +
      `&response_type=code` +
      `&scope=openid email profile`

    return response.redirect(redirectUri)
  }

  async handleCallback({ request, response, auth }: HttpContext) {
    const code = request.input('code')
  
    if (!code) {
      return response.badRequest('Missing code')
    }
  
    try {
      // 1. Get tokens from Keycloak
      const tokenRes = await axios.post(
        `${env.get('KEYCLOAK_BASE_URL')}/realms/${env.get('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: env.get('KEYCLOAK_REDIRECT_URI'),
          client_id: env.get('KEYCLOAK_CLIENT_ID'),
          client_secret: env.get('KEYCLOAK_CLIENT_SECRET'),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
  
      const accessToken = tokenRes.data.access_token
  
      // 2. Get user info from Keycloak
      const userInfoRes = await axios.get(
        `${env.get('KEYCLOAK_BASE_URL')}/realms/${env.get('KEYCLOAK_REALM')}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
  
      const info = userInfoRes.data
      const email = info.email?.toLowerCase()
      const username = info.preferred_username || email?.split('@')[0]
      const firstName = info.given_name
      const lastName = info.family_name
  
      if (!email || !username || !firstName || !lastName) {
        return response.badRequest('Missing required fields from Keycloak')
      }
  
      // 3. Find or create user
      let user = await User.findBy('email', email)
      if (!user) {
        user = new User()
        user.email = email
        user.username = username
        user.firstName = firstName
        user.lastName = lastName
        user.verifiedAt = DateTime.now()  // Mark email as verified
        user.status = 'Online'
        user.description = 'New Keycloak user'
        await user.save()
      }
  
      // 4. Generate and set JWT tokens
      const tokens = await auth.use('jwt').generate(user)
      response.cookie('beep.access_token', tokens.accessToken)
      response.cookie('beep.refresh_token', tokens.refreshToken)
  
      // 5. Redirect to frontend
      return response.redirect('http://localhost:4200/servers/discover')
    } catch (err) {
      console.error('Keycloak login failed:', err)
      return response.internalServerError({ error: 'Keycloak login failed' })
    }
  }  
}