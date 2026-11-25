import type { Access, CollectionConfig } from 'payload'

const isAppUser: Access = ({ req }) => req.user?.collection === 'users'
const isSelf: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    create: () => true,
    read: isSelf,
    update: isSelf,
    delete: () => false,
    admin: () => false,
  },
  admin: {
    hidden: true,
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 80,
    },
  ],
  hooks: {
    beforeLogin: [async ({ user }) => {
      if (!user) throw new Error('Unable to sign in.')
    }],
  },
  versions: false,
}
