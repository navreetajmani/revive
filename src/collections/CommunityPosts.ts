import type { Access, CollectionConfig, FieldHook } from 'payload'

const appUserOnly: Access = ({ req }) => req.user?.collection === 'users'
const ownsPost: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}
const setOwner: FieldHook = ({ req, operation, value }) => {
  if (operation === 'create' && req.user?.collection === 'users') return req.user.id
  return value
}
const setAuthorName: FieldHook = ({ req, operation, value }) => {
  if (operation === 'create' && req.user?.collection === 'users') return req.user.name || 'Revive member'
  return value
}

export const CommunityPosts: CollectionConfig = {
  slug: 'community-posts',
  labels: { singular: 'Community post', plural: 'Community posts' },
  admin: {
    group: 'Revive',
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'hobby', 'owner', 'createdAt'],
  },
  access: {
    create: appUserOnly,
    read: () => true,
    update: ownsPost,
    delete: ownsPost,
    admin: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { create: () => false, update: () => false },
      hooks: { beforeChange: [setOwner] },
    },
    {
      name: 'authorName',
      type: 'text',
      access: { create: () => false, update: () => false },
      hooks: { beforeChange: [setAuthorName] },
    },
    { name: 'caption', type: 'textarea', required: true, maxLength: 1200 },
    { name: 'hobby', type: 'text', required: true, maxLength: 80 },
    {
      name: 'tags',
      type: 'array',
      maxRows: 8,
      fields: [{ name: 'value', type: 'text', required: true, maxLength: 40 }],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'likes', type: 'number', defaultValue: 0, min: 0 },
  ],
  versions: false,
}
