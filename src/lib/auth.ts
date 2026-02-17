import { cookies } from 'next/headers'
import { decrypt } from './auth-core'

export * from './auth-core'

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}
