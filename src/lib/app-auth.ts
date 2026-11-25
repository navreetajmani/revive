import 'server-only'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'

const SESSION_COOKIE = 'app-session'

export function createAppAuth(collection: 'users') {
  return {
    async currentUser() {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayload({ config })
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })
      if (!user || user.collection !== collection) return null
      return user
    },

    async login(email: string, password: string) {
      const payload = await getPayload({ config })
      const result = await payload.login({
        collection,
        data: { email, password },
      })
      if (!result.token) throw new Error('Unable to start your session.')

      ;(await cookies()).set(SESSION_COOKIE, result.token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        partitioned: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return result.user
    },

    async logout() {
      ;(await cookies()).delete(SESSION_COOKIE)
    },
  }
}

export const appAuth = createAppAuth('users')
