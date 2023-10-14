import { redirect } from "next/navigation";
import { NavBar } from "../navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const prisma = new PrismaClient()

export default async function Friends(){
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
        <>
            <NavBar />
            <div className="lg:px-[15vw] flex flex-row justify-center space-x-10 mt-[5rem]">
                <div className="border rounded-md w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[300px]">Received at</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receivedFriendRequests.map((friendReq) => {
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            {friendReq.createdAt.toUTCString()}
                                        </TableCell>
                                        <TableCell className="flex flex-row">
                                            <p>{getNameFromReq(friendReq.fromUserId, "name")}</p>
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
                <div className="border rounded-md w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[300px]">Sent at</TableHead>
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
        </>
    )
}