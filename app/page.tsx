import { getServerSession } from 'next-auth'
import { NavBar } from './navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { authOptions } from '@/auth_options'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <NavBar />
      <div className="px-3 lg:px-[15vw] flex flex-col md:flex-row">

        <div>
          <h1 className="text-6xl font-bold mt-4 lg:mt-[5rem]">
            TabberTrack
          </h1>
          <hr className='w-[35.5rem] mt-4'/>
          <h2 className='mt-2 text-xl text-muted-foreground max-w-xl'>
            The all in one solution for managing how much money you and your friends owe eachother.
          </h2>
          <Link href="/register"><Button variant="outline" className="mt-5"><b>Register Now</b></Button></Link>
        </div>
        
        <div className="max-w-[25rem] mx-auto mt-4 lg:mt-[5rem]">
          <img src="/devicemockups.png" />
        </div>
      </div>
    </>
  )
}
