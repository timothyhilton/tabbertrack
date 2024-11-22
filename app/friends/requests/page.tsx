import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivedFriendReqTable from "@/components/friends/requests/received-friendreq-table";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/db";
import UnFriendButton from "@/components/friends/list/unfriend-button";
import SentFriendReqTable from "@/components/friends/requests/sent-friendreq-table";
import { authOptions } from "@/auth_options";
import { NavBar } from "@/app/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FriendsRequests(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }

    // good ol' "await Promise.all()" strikes again! (see 'transactions/page.tsx' for context)
    const receivedFriendRequests = await Promise.all((await prisma.friendRequest.findMany({
        where: {
            toUserId: parseInt(session.user!.id)
        }
    })).map(async friendReq => {
        let fromUser = await prisma.user.findFirst({where:{id:friendReq.fromUserId}})

        return {
            name: fromUser!.name!,
            username: fromUser!.username,
            status: friendReq.status,
            createdAt: friendReq.createdAt
        }
    }))

    const sentFriendRequests = await Promise.all((await prisma.friendRequest.findMany({
        where: {
            fromUserId: parseInt(session.user!.id)
        }
    })).map(async friendReq => {
        let toUser = await prisma.user.findFirst({where:{id:friendReq.toUserId}})

        return {
            name: toUser!.name!,
            username: toUser!.username,
            status: friendReq.status,
            createdAt: friendReq.createdAt
        }
    }))

    return(
        <>
            <NavBar />
            <div className="lg:px-[15vw] mt-[5rem]">
                <h1 className="mb-10 text-3xl flex font-semibold justify-center">
                    Friend Requests
                </h1>
                <div className="flex justify-center">
                    <Tabs defaultValue="received" className="lg:w-[89%]">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="received">Received Friend Requests</TabsTrigger>
                            <TabsTrigger value="sent">Sent Friend Requests</TabsTrigger>
                        </TabsList>
                        <TabsContent value="received">
                            <ReceivedFriendReqTable receivedFriendRequests={receivedFriendRequests} />
                        </TabsContent>
                        <TabsContent value="sent">
                            <SentFriendReqTable sentFriendRequests={sentFriendRequests} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}