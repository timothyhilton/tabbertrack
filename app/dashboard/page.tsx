import { authOptions } from "@/auth_options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { NavBar } from "../navbar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddTransactionDialog } from "@/components/transactions/transactions-dialog"
import prisma from "@/db"
import OverallOwe from "@/components/dashboard/overall-owe"
import { AddFriendDialog } from "@/components/friends/friend-dialog"

export default async function Dashboard(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }

    // begin finding stuff for "add a new transaction" and "add a new friend" buttons

    const externalFriends = await prisma.externalFriend.findMany({
        where: {
            userId: parseInt(session.user!.id)
        }
    })

    const friends = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: parseInt(session.user!.id)
                }
            }
        }
    })

    const friendNames = friends.map(friend => { return {username: friend.username, name: friend.name!} })
    const externalFriendNames = externalFriends.map(friend => friend.name)

    // end

    return (
        <>
            <NavBar />
            <div className="lg:px-[15vw] flex flex-col space-y-20 mt-[5rem]">
                <OverallOwe />
                <div className="flex justify-center space-x-10">
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                Add a new transaction
                            </Button>
                        </DialogTrigger>

                        <AddTransactionDialog friendNames={friendNames} externalFriendNames={externalFriendNames} />

                    </Dialog>
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                Add a new friend
                            </Button>
                        </DialogTrigger>

                        <AddFriendDialog />

                    </Dialog>
                </div>
            </div>
        </>
    )
}