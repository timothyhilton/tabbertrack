import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from '../components/auth'
import { getServerSession } from 'next-auth'
import { User } from './user'
import { ModeToggle } from '@/components/ui/modetoggle'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <h2>Server session</h2>
      <p>{JSON.stringify(session)}</p>
      <h2>Client session</h2>
      <User />
      <ModeToggle />
    </div>
  )
}
