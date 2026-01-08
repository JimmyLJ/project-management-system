import { betterAuth } from 'better-auth/minimal'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import { authAccounts, authSessions, authUsers, authVerifications } from './db/schema/auth'

const authSchema = {
  user: authUsers,
  session: authSessions,
  account: authAccounts,
  verification: authVerifications,
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    fields: {
      emailVerified: 'emailVerified',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
  session: {
    fields: {
      userId: 'userId',
      expiresAt: 'expiresAt',
      ipAddress: 'ipAddress',
      userAgent: 'userAgent',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
  account: {
    fields: {
      accountId: 'accountId',
      providerId: 'providerId',
      userId: 'userId',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      accessTokenExpiresAt: 'accessTokenExpiresAt',
      refreshTokenExpiresAt: 'refreshTokenExpiresAt',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
  verification: {
    fields: {
      expiresAt: 'expiresAt',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
})
