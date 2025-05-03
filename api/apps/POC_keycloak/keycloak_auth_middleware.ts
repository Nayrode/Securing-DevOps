// app/Middleware/KeycloakAuthMiddleware.ts
import { HttpContextContract } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const client = jwksClient({
  jwksUri: 'http://localhost:8080/realms/beep-realm/protocol/openid-connect/certs',
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}

export default class KeycloakAuthMiddleware {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const authHeader = request.header('Authorization')
    if (!authHeader) {
      return response.unauthorized({ error: 'Token manquant' })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          getKey,
          {
            algorithms: ['RS256'],
            issuer: 'http://localhost:8080/realms/beep-realm',
          },
          (err, decoded) => {
            if (err) return reject(err)
            resolve(decoded)
          }
        )
      })

      request['oidcUser'] = payload // Ajoute l'utilisateur Keycloak dans la requête
      await next()
    } catch (err) {
      return response.unauthorized({ error: 'Token invalide' })
    }
  }
}
