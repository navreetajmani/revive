import { getInitialReviveState } from './actions'
import ReviveApp from '@/components/ReviveApp'

export default async function HomePage() {
  const initialState = await getInitialReviveState()
  return <ReviveApp {...initialState} />
}
