import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { User } from './user'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h2>Server session</h2>
      <p>{JSON.stringify(session)}</p>
      <h2>Client session</h2>
      <User />
    </div>
  )
}
