import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoginButton, LogoutDropdownMenuItem } from "@/components/auth";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "../ui/button";
import Link from "next/link";
import NotificationBubble from "../notifications/notification-bubble";

export default async function UserIcon(){
    const session = await getServerSession(authOptions)

    const transactionNotifCount = await prisma.transaction.count({
        where: {
          status: 'pending',
          toUserId: parseInt(session!.user!.id)
        },
    });

    const friendNotifCount = await prisma.friendRequest.count({
        where: {
          status: 'pending',
          toUserId: parseInt(session!.user!.id)
        },
    });

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <NotificationBubble num={transactionNotifCount + friendNotifCount}/>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcnjkk.png"/>
                        <AvatarFallback className="dark:bg-slate-800 bg-slate-200">
                            {session!.user!.name!.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium leading-none">
                        {session!.user!.name}
                    </div>
                    <div className="text-xs leading-none text-muted-foreground">
                    {session!.user!.username}
                    </div>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/friends" className="hover:cursor-wait">
                        <DropdownMenuItem>
                            Friends
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/transactions" className="hover:cursor-wait">
                        <DropdownMenuItem>
                            Transactions
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <LogoutDropdownMenuItem />

            </DropdownMenuContent>
        </DropdownMenu>
    )
}