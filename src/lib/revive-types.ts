export type GardenReward = {
  id: string
  plantKey?: string
  type: 'seed' | 'sprout' | 'flower' | 'bush' | 'tree' | 'special' | 'welcome'
  label: string
  source: string
  date: string
}

export type WeeklyPlan = {
  count: number
  days: string[]
  time: string
  enabled: boolean
}

export type PauseState = {
  active: boolean
  returnDate: string
  project: string
  hobby: string
  reminder: boolean
}

export type ReviveData = {
  name: string
  hobbies: string[]
  previous: string[]
  lastTime: string
  feelings: string[]
  changes: string[]
  barriers: string[]
  availability: string[]
  frequency: string
  companion: string
  companionName: string
  companionColor: string
  companionPattern: string
  hobbyLevels: Record<string, number>
  hobbyProgress: Record<string, number>
  projectCheckpoints: Record<string, number>
  gardenRewards: GardenReward[]
  notes: string
  weeklyPlans: Record<string, WeeklyPlan>
  pauseState: PauseState
  savedInspiration: string[]
  feedFilters: string[]
  notificationSettings: Record<string, boolean>
}

export const defaultReviveData: ReviveData = {
  name: 'Navreet',
  hobbies: [],
  previous: [],
  lastTime: '',
  feelings: [],
  changes: [],
  barriers: [],
  availability: [],
  frequency: '',
  companion: 'cat',
  companionName: 'Milo',
  companionColor: '#F5DD69',
  companionPattern: 'Plain',
  hobbyLevels: {},
  hobbyProgress: {},
  projectCheckpoints: {},
  gardenRewards: [],
  notes: '',
  weeklyPlans: {},
  pauseState: {
    active: false,
    returnDate: '',
    project: '',
    hobby: '',
    reminder: false,
  },
  savedInspiration: [],
  feedFilters: [],
  notificationSettings: {
    'Hobby session reminders': true,
    'Weekly check-ins': true,
    'Companion messages': true,
    'Progress & milestone notes': false,
  },
}

export type CommunityPostView = {
  id: string
  user: string
  initial: string
  hobby: string
  caption: string
  image?: string
  likes: number
  createdAt?: string
}
