import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton } from '../components/auth'
import { getServerSession } from 'next-auth'
import { User } from './user'
import { ModeToggle } from '@/components/ui/modetoggle'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1 className="text-8xl font-bold text-center">
        TabberTrack
      </h1>
      <h2 className='pl-10'>
        The All In One solution for managing how much money you and your friends owe eachother.
      </h2>
      <ModeToggle />
      <LoginButton />
    </div>
  )
}
