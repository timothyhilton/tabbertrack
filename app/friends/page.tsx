import Link from "next/link";
import { NavBar } from "../navbar";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/db";
import FriendTable from "@/components/friends/list/friend-table";
import ExternalFriendTable from "@/components/friends/list/external-friend-table";

export default async function Friends(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }

    const friends = (await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: parseInt(session.user!.id)
                }
            }
        }
    })).map(friend => { 
        return({
            name: friend.name!, 
            username: friend.username
        })
    })

    const externalFriends = (await prisma.externalFriend.findMany({
        where: {
            userId: parseInt(session.user!.id)
        }
    })).map(friend => { 
        return({
            name: friend.name
        })
    })

    return(
        <>
            <NavBar />
            
            <div className="lg:px-[15vw] md:px-[5vw] mt-[5rem]">
                <div className="absolute">
                    <Link href="/friends/requests">
                        <Button>
                            See requests
                        </Button>
                    </Link>
                </div>
                <h1 className="mb-10 text-3xl flex font-semibold justify-center">
                    Friends
                </h1>
                <div className="flex justify-center">
                    <Tabs defaultValue="internal" className="lg:w-[60%] md:w-[70%] w-full">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="internal">Friends on TabberTrack</TabsTrigger>
                            <TabsTrigger value="external">External Friends</TabsTrigger>
                        </TabsList>
                        <TabsContent value="internal">
                            <FriendTable friends={friends}/>
                        </TabsContent>
                        <TabsContent value="external">
                            <ExternalFriendTable friends={externalFriends} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}