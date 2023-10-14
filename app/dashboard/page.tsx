import { authOptions } from "../api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { NavBar } from "../navbar"

export default async function Dashboard(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }

    return (
        <>
            <NavBar />
            <div>
                protected page
            </div>
        </>
    )
}