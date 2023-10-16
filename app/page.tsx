import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton } from '../components/auth'
import { getServerSession } from 'next-auth'
import { User } from './user'
import { ModeToggle } from '@/components/ui/modetoggle'
import { NavBar } from './navbar'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <NavBar />
      <div className="px-3 lg:px-[15vw]">
        <h1 className="text-6xl font-bold mt-4 lg:mt-[5rem]">
          TabberTrack
        </h1>
        <hr className='w-[35.5rem] mt-4'/>
        <h2 className='mt-2 text-xl text-muted-foreground max-w-xl'>
          The All In One solution for managing how much money you and your friends owe eachother.
        </h2>
      </div>
    </>
  )
}
