import { Button } from "@/components/ui/button";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoginButton, LogoutDropdownMenuItem } from "@/components/auth";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/modetoggle";

function UserIcon({ session }: { session: (Session | null)}){
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
                <DropdownMenuItem>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem>New Team</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <LogoutDropdownMenuItem />

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export async function NavBar(){
    const session = await getServerSession(authOptions)

    return(
        <div>
            <div className="lg:px-[15vw] flex-no-wrap relative flex w-full items-center justify-between py-2 border-b-[1px]">
                <div className="pl-3 flex flex-row">
                    <Link href="/" className="flex flex-row mt-[0.3rem]">
                        <Icons.tabbertrack className="w-[1.5rem] h-[1.5rem] my-[0.2rem]" />
                        <div className="mt-[0.2rem] ml-2 font-semibold">
                            TabberTrack
                        </div>
                    </Link>
                    <div className="ml-5 mr-1 w-[1px] border-l-[1px]"></div>
                    <Link href="/dashboard" passHref>
                        <Button variant="link">
                            Home
                        </Button>
                    </Link>
                </div>
                <div className="pr-2 flex flex-row">
                    <ModeToggle className="mr-3 scale-90"/>
                    {session &&
                        <div className="mt-[0.1rem] scale-90">
                            <UserIcon session={session} />
                        </div>
                    }
                    {!session &&
                        <div className="">
                            <LoginButton />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}