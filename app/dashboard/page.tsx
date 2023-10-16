import { authOptions } from "../api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { NavBar } from "../navbar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddFriendDialog } from "@/components/friend-dialog"

export default async function Dashboard(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }

    return (
        <>
            <NavBar />
            <div className="lg:px-[15vw] flex flex-col space-y-20 mt-[5rem]">
                <div className="text-lg flex justify-center space-x-44">
                    <div>
                        <h2 className="flex justify-center">
                            You collectively owe everyone
                        </h2>
                        <h1 className="text-8xl flex justify-center">
                            $15.30 {/*placeholder*/}
                        </h1>
                    </div>
                    <div>
                        <h2 className="flex justify-center">
                            Everyone collectively owes you
                        </h2>
                        <h1 className="text-8xl flex justify-center">
                            $13.10 {/*placeholder*/}
                        </h1>
                    </div>
                </div>
                <div className="flex justify-center space-x-10">
                    <Button>
                        Add a new transaction
                    </Button>
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