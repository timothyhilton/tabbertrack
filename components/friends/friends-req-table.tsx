import { redirect } from "next/navigation";
import { NavBar } from "../../app/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import { FriendRequest, PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import FriendReqResponseButtons from "@/components/friends/friend-req-response";
import prisma from '@/db';

export default async function FriendsReqTable(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }

    const sentFriendRequests = await prisma.friendRequest.findMany({
        where: {
            fromUserId: parseInt(session.user!.id)
        }
    })
    const receivedFriendRequests = await prisma.friendRequest.findMany({
        where: {
            toUserId: parseInt(session.user!.id)
        }
    })

    console.log(sentFriendRequests, receivedFriendRequests)

    async function getNameFromReq(userId: number, nameOrUsername: string){
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if(!user){ return "error" }

        if(nameOrUsername == "username"){ return(user.username) }
        else if(nameOrUsername == "name"){ return(user.name) }
        else return "error"
    }

    return(
        <div className="flex flex-col lg:flex-row justify-center space-y-10 lg:space-y-0 lg:space-x-10 mt-10">
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[150px]">Received at</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Respond</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receivedFriendRequests.map(async (friendReq) => {
                            return (
                                <TableRow>
                                    
                                    <TableCell className="font-medium">
                                        {friendReq.createdAt.toUTCString()}
                                    </TableCell>

                                    <TableCell className="flex flex-row"> {/* todo: make this styling work when req accepted */}
                                        <p>{getNameFromReq(friendReq.fromUserId, "name")}</p>
                                        <p className="text-muted-foreground">&nbsp;/ {getNameFromReq(friendReq.fromUserId, "username")}</p>
                                    </TableCell>

                                    <TableCell className="">
                                        {friendReq.status}
                                    </TableCell>

                                    <TableCell className="flex flex-row justify-end space-x-4">
                                        {(friendReq.status == "pending") &&
                                            <FriendReqResponseButtons fromUsername={await getNameFromReq(friendReq.fromUserId, "username")}/>}                                            
                                    </TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[150px]">Sent at</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        </TableRow> 
                    </TableHeader>
                    <TableBody>
                        {sentFriendRequests.map((friendReq) => {
                            return (
                                <TableRow>
                                    <TableCell className="font-medium">
                                        {friendReq.createdAt.toUTCString()}
                                    </TableCell>
                                    <TableCell className="flex flex-row">
                                        <p>{getNameFromReq(friendReq.toUserId, "name")}</p>
                                        <p className="text-muted-foreground">&nbsp;/ {getNameFromReq(friendReq.toUserId, "username")}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {friendReq.status}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}