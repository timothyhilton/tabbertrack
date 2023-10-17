import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import UnfriendButton from "./unfriend-button"
import prisma from '@/db'
import UnfriendButtonExternal from "./unfriend-button-external"

export default async function FriendsList(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    
    const friends = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    username: session.user!.username
                }
            }
        }
    })

    const unRegisteredFriends = await prisma.externalFriend.findMany({
        where: {
            userId: parseInt(session.user!.id)
        }
    })

    console.log(friends)

    return(
        <div className="flex flex-row space-x-4 justify-center">
            <div className="">
                <h1 className="text-xl font-semibold flex justify-center mb-3">On TabberTrack:</h1>
                <div className="flex flex-row space-x-4 justify-center flex-wrap space-y-4">
                    {friends.map(async (friend) => {
                        return(
                            <Card className="w-fit pt-6">
                                <CardContent className="flex flex-row align-middle justify-center">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadsdfdcn.png" />
                                        <AvatarFallback>
                                            {friend.name!.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2">
                                        <CardTitle>{friend.name}</CardTitle>
                                        <CardDescription>{friend.username}</CardDescription>
                                    </div>

                                    <UnfriendButton username={friend.username}/>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <div className="h-[10rem] border-l-[1px] w-1 ml-10 mr-9"></div>
            <div className="">
                <div className="text-xl font-semibold flex justify-center mb-3">Not on TabberTrack:</div>
                <div className="flex flex-row space-x-4 justify-center flex-wrap">
                    {unRegisteredFriends.map(async (friend) => {
                        return(
                            <Card className="w-fit pt-6">
                                <CardContent className="flex flex-row align-middle justify-center">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadsdfdcn.png" />
                                        <AvatarFallback>
                                            {friend.name!.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="mt-2 ml-2">
                                        <CardTitle>{friend.name}</CardTitle>
                                    </div>
                                    <UnfriendButtonExternal name={friend.name}/>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}