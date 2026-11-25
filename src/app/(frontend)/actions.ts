'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

import { appAuth } from '@/lib/app-auth'
import {
  defaultReviveData,
  type CommunityPostView,
  type ReviveData,
} from '@/lib/revive-types'

type ActionResult = {
  ok: boolean
  message?: string
  data?: ReviveData
}

const arrayOfText = (value: unknown, max = 20) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').slice(0, max)
    : []

const text = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const numberMap = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item === 'number' && Number.isFinite(item))
      .slice(0, 50),
  )
}

function sanitizeJourney(input: ReviveData): ReviveData {
  const companionTypes = ['dog', 'cat', 'duck', 'frog']
  const patterns = ['Plain', 'Spots', 'Patch']
  const rewardTypes = ['seed', 'sprout', 'flower', 'bush', 'tree', 'special', 'welcome']

  return {
    ...defaultReviveData,
    name: text(input.name, 80) || 'Friend',
    hobbies: arrayOfText(input.hobbies),
    previous: arrayOfText(input.previous),
    lastTime: text(input.lastTime, 80),
    feelings: arrayOfText(input.feelings),
    changes: arrayOfText(input.changes),
    barriers: arrayOfText(input.barriers),
    availability: arrayOfText(input.availability),
    frequency: text(input.frequency, 80),
    companion: companionTypes.includes(input.companion) ? input.companion : 'cat',
    companionName: text(input.companionName, 50) || 'Milo',
    companionColor: /^#[0-9a-f]{6}$/i.test(input.companionColor) ? input.companionColor : '#F5DD69',
    companionPattern: patterns.includes(input.companionPattern) ? input.companionPattern : 'Plain',
    hobbyLevels: numberMap(input.hobbyLevels),
    hobbyProgress: numberMap(input.hobbyProgress),
    projectCheckpoints: numberMap(input.projectCheckpoints),
    gardenRewards: Array.isArray(input.gardenRewards)
      ? input.gardenRewards.slice(0, 100).flatMap((reward) =>
          reward &&
          rewardTypes.includes(reward.type) &&
          typeof reward.id === 'string'
            ? [{
                id: text(reward.id, 100),
                plantKey: text(reward.plantKey, 100) || undefined,
                type: reward.type,
                label: text(reward.label, 120),
                source: text(reward.source, 160),
                date: text(reward.date, 40),
              }]
            : [],
        )
      : [],
    notes: text(input.notes, 2000),
    weeklyPlans:
      input.weeklyPlans && typeof input.weeklyPlans === 'object' && !Array.isArray(input.weeklyPlans)
        ? input.weeklyPlans
        : {},
    pauseState: {
      active: Boolean(input.pauseState?.active),
      returnDate: text(input.pauseState?.returnDate, 40),
      project: text(input.pauseState?.project, 160),
      hobby: text(input.pauseState?.hobby, 100),
      reminder: Boolean(input.pauseState?.reminder),
    },
    savedInspiration: arrayOfText(input.savedInspiration, 100),
    feedFilters: arrayOfText(input.feedFilters, 20),
    notificationSettings:
      input.notificationSettings &&
      typeof input.notificationSettings === 'object' &&
      !Array.isArray(input.notificationSettings)
        ? Object.fromEntries(
            Object.entries(input.notificationSettings)
              .filter(([, value]) => typeof value === 'boolean')
              .slice(0, 20),
          )
        : defaultReviveData.notificationSettings,
  }
}

const rows = (items: string[]) => items.map((value) => ({ value }))

function toPayloadData(data: ReviveData) {
  return {
    displayName: data.name,
    hobbies: rows(data.hobbies),
    previousHobbies: rows(data.previous),
    lastTime: data.lastTime,
    feelings: rows(data.feelings),
    changes: rows(data.changes),
    barriers: rows(data.barriers),
    availability: rows(data.availability),
    frequency: data.frequency,
    companion: {
      type: data.companion as 'dog' | 'cat' | 'duck' | 'frog',
      name: data.companionName,
      color: data.companionColor,
      pattern: data.companionPattern as 'Plain' | 'Spots' | 'Patch',
    },
    hobbyLevels: data.hobbyLevels,
    hobbyProgress: data.hobbyProgress,
    projectCheckpoints: data.projectCheckpoints,
    gardenRewards: data.gardenRewards.map((reward) => ({
      rewardId: reward.id,
      plantKey: reward.plantKey,
      type: reward.type,
      label: reward.label,
      source: reward.source,
      date: reward.date,
    })),
    notes: data.notes,
    weeklyPlans: data.weeklyPlans,
    pauseState: data.pauseState,
    savedInspiration: rows(data.savedInspiration),
    feedFilters: rows(data.feedFilters),
    notificationSettings: data.notificationSettings,
  }
}

function journeyDocumentToData(doc: Record<string, any> | null, userName?: string): ReviveData {
  if (!doc) return { ...defaultReviveData, name: userName || defaultReviveData.name }
  const values = (items: Array<{ value?: string }> | null | undefined) =>
    (items ?? []).flatMap((item) => (item?.value ? [item.value] : []))

  return {
    ...defaultReviveData,
    name: doc.displayName || userName || defaultReviveData.name,
    hobbies: values(doc.hobbies),
    previous: values(doc.previousHobbies),
    lastTime: doc.lastTime || '',
    feelings: values(doc.feelings),
    changes: values(doc.changes),
    barriers: values(doc.barriers),
    availability: values(doc.availability),
    frequency: doc.frequency || '',
    companion: doc.companion?.type || 'cat',
    companionName: doc.companion?.name || 'Milo',
    companionColor: doc.companion?.color || '#F5DD69',
    companionPattern: doc.companion?.pattern || 'Plain',
    hobbyLevels: doc.hobbyLevels || {},
    hobbyProgress: doc.hobbyProgress || {},
    projectCheckpoints: doc.projectCheckpoints || {},
    gardenRewards: (doc.gardenRewards ?? []).map((reward: Record<string, string>) => ({
      id: reward.rewardId,
      plantKey: reward.plantKey || undefined,
      type: reward.type,
      label: reward.label,
      source: reward.source,
      date: reward.date,
    })),
    notes: doc.notes || '',
    weeklyPlans: doc.weeklyPlans || {},
    pauseState: { ...defaultReviveData.pauseState, ...(doc.pauseState || {}) },
    savedInspiration: values(doc.savedInspiration),
    feedFilters: values(doc.feedFilters),
    notificationSettings: doc.notificationSettings || defaultReviveData.notificationSettings,
  }
}

async function upsertJourney(
  data: ReviveData,
  authenticatedUser?: Awaited<ReturnType<typeof appAuth.currentUser>>,
) {
  const user = authenticatedUser ?? await appAuth.currentUser()
  if (!user) throw new Error('Please sign in to save your journey.')
  const payload = await getPayload({ config })
  const clean = sanitizeJourney(data)
  const existing = await payload.find({
    collection: 'journeys',
    where: { owner: { equals: user.id } },
    limit: 1,
    depth: 0,
    user,
    overrideAccess: false,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'journeys',
      id: existing.docs[0].id,
      data: toPayloadData(clean),
      user,
      overrideAccess: false,
    })
  } else {
    await payload.create({
      collection: 'journeys',
      // owner is required by the generated type but is injected by the protected field hook.
      data: toPayloadData(clean) as any,
      user,
      overrideAccess: false,
    })
  }
  return clean
}

export async function signUpAction(
  email: string,
  password: string,
  name: string,
  journey: ReviveData,
): Promise<ActionResult> {
  const cleanEmail = text(email, 160).toLowerCase()
  const cleanName = text(name, 80)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { ok: false, message: 'Enter a valid email address.' }
  if (password.length < 6 || password.length > 72) return { ok: false, message: 'Use a password between 6 and 72 characters.' }
  if (!cleanName) return { ok: false, message: 'Tell us what you would like to be called.' }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'users',
      data: { email: cleanEmail, password, name: cleanName },
      overrideAccess: false,
    })
    const user = await appAuth.login(cleanEmail, password)
    const data = await upsertJourney({ ...journey, name: cleanName }, user)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'That email may already have an account. Try logging in instead.' }
  }
}

export async function loginAction(email: string, password: string): Promise<ActionResult> {
  const cleanEmail = text(email, 160).toLowerCase()
  if (!cleanEmail || !password) return { ok: false, message: 'Enter your email and password.' }

  try {
    const user = await appAuth.login(cleanEmail, password)
    if (!user) throw new Error('Unable to resolve the signed-in account.')
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'journeys',
      where: { owner: { equals: user.id } },
      limit: 1,
      depth: 0,
      user,
      overrideAccess: false,
    })
    if (!result.docs[0]) {
      return {
        ok: true,
        data: await upsertJourney({ ...defaultReviveData, name: user.name }, user),
      }
    }
    return {
      ok: true,
      data: journeyDocumentToData(result.docs[0] as unknown as Record<string, any>, user.name),
    }
  } catch {
    return { ok: false, message: 'Email or password was not recognized.' }
  }
}

export async function saveJourneyAction(input: ReviveData): Promise<ActionResult> {
  try {
    return { ok: true, data: await upsertJourney(input) }
  } catch (error) {
    console.error('[Revive] Journey save failed', error)
    return { ok: false, message: 'Your changes could not be saved right now.' }
  }
}

export async function logoutAction(): Promise<ActionResult> {
  await appAuth.logout()
  return { ok: true }
}

export async function createCommunityPostAction(input: {
  caption: string
  hobby: string
  tags: string[]
}): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, message: 'Please sign in before sharing a post.' }
  const caption = text(input.caption, 1200)
  const hobby = text(input.hobby, 80)
  if (!caption || !hobby) return { ok: false, message: 'Add a caption and hobby before publishing.' }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'community-posts',
      // owner and authorName are injected by protected field hooks.
      data: {
        caption,
        hobby,
        tags: arrayOfText(input.tags, 8).map((value) => ({ value: text(value.replace(/^#/, ''), 40) })),
      } as any,
      user,
      overrideAccess: false,
    })
    return { ok: true }
  } catch {
    return { ok: false, message: 'Your post could not be published right now.' }
  }
}

export async function getInitialReviveState(): Promise<{
  authenticated: boolean
  data: ReviveData
  communityPosts: CommunityPostView[]
}> {
  const user = await appAuth.currentUser()
  const payload = await getPayload({ config })
  const [journeys, posts] = await Promise.all([
    user
      ? payload.find({
          collection: 'journeys',
          where: { owner: { equals: user.id } },
          limit: 1,
          depth: 0,
          user,
          overrideAccess: false,
        })
      : Promise.resolve({ docs: [] }),
    payload.find({
      collection: 'community-posts',
      limit: 20,
      sort: '-createdAt',
      depth: 0,
      user: user ?? undefined,
      overrideAccess: false,
    }),
  ])

  return {
    authenticated: Boolean(user),
    data: journeyDocumentToData(
      journeys.docs[0] as unknown as Record<string, any> | null,
      user?.name,
    ),
    communityPosts: posts.docs.map((post) => ({
      id: String(post.id),
      user: post.authorName || 'Revive member',
      initial: (post.authorName || 'R').slice(0, 1).toUpperCase(),
      hobby: post.hobby,
      caption: post.caption,
      likes: post.likes || 0,
      createdAt: post.createdAt,
    })),
  }
}
