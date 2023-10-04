import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from './auth'
import { getServerSession } from 'next-auth'
import { User } from './user'

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
    </div>
  )
}
