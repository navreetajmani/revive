import type { Access, ArrayField, CollectionConfig, FieldHook } from 'payload'

const ownsJourney: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}

const appUserOnly: Access = ({ req }) => req.user?.collection === 'users'

const setOwner: FieldHook = ({ req, operation, value }) => {
  if (operation === 'create' && req.user?.collection === 'users') return req.user.id
  return value
}

const labelArray = (name: string, label: string): ArrayField => ({
    name,
    label,
    type: 'array',
    fields: [{ name: 'value', type: 'text', required: true }],
  })

export const Journeys: CollectionConfig = {
  slug: 'journeys',
  labels: { singular: 'Journey', plural: 'Journeys' },
  admin: {
    group: 'Revive',
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'owner', 'updatedAt'],
  },
  access: {
    create: appUserOnly,
    read: ownsJourney,
    update: ownsJourney,
    delete: ownsJourney,
    admin: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      index: true,
      access: { create: () => false, update: () => false },
      hooks: { beforeChange: [setOwner] },
      admin: { position: 'sidebar' },
    },
    { name: 'displayName', type: 'text', required: true, maxLength: 80 },
    labelArray('hobbies', 'Current hobbies'),
    labelArray('previousHobbies', 'Previous hobbies'),
    { name: 'lastTime', type: 'text' },
    labelArray('feelings', 'Restart feelings'),
    labelArray('changes', 'Reasons life changed'),
    labelArray('barriers', 'Restart barriers'),
    labelArray('availability', 'Availability'),
    { name: 'frequency', type: 'text' },
    {
      name: 'companion',
      type: 'group',
      fields: [
        { name: 'type', type: 'select', options: ['dog', 'cat', 'duck', 'frog'], defaultValue: 'cat' },
        { name: 'name', type: 'text', defaultValue: 'Milo', maxLength: 50 },
        { name: 'color', type: 'text', defaultValue: '#F5DD69' },
        { name: 'pattern', type: 'select', options: ['Plain', 'Spots', 'Patch'], defaultValue: 'Plain' },
      ],
    },
    { name: 'hobbyLevels', type: 'json' },
    { name: 'hobbyProgress', type: 'json' },
    { name: 'projectCheckpoints', type: 'json' },
    {
      name: 'gardenRewards',
      type: 'array',
      fields: [
        { name: 'rewardId', type: 'text', required: true },
        { name: 'plantKey', type: 'text' },
        { name: 'type', type: 'select', required: true, options: ['seed', 'sprout', 'flower', 'bush', 'tree', 'special', 'welcome'] },
        { name: 'label', type: 'text', required: true },
        { name: 'source', type: 'text', required: true },
        { name: 'date', type: 'text', required: true },
      ],
    },
    { name: 'notes', type: 'textarea', maxLength: 2000 },
    { name: 'weeklyPlans', type: 'json' },
    {
      name: 'pauseState',
      type: 'group',
      fields: [
        { name: 'active', type: 'checkbox', defaultValue: false },
        { name: 'returnDate', type: 'text' },
        { name: 'project', type: 'text' },
        { name: 'hobby', type: 'text' },
        { name: 'reminder', type: 'checkbox', defaultValue: false },
      ],
    },
    labelArray('savedInspiration', 'Saved inspiration'),
    labelArray('feedFilters', 'Feed filters'),
    { name: 'notificationSettings', type: 'json' },
  ],
  versions: false,
}
