import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LoginButton, LogoutDropdownMenuItem, RegisterButton } from "@/components/auth";
import { Icons } from "@/components/ui/icons";
import Logo from "@/components/navbar/logo";
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
                    <p className="text-sm font-medium leading-none">
                        {session!.user!.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {session!.user!.email}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Billing
                </DropdownMenuItem>
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
                        <Link href="/dashboard" className="flex flex-row">
                            <Icons.tabbertrack className="w-[1.5rem] h-[1.5rem] my-[0.2rem]" />
                            <p className="mt-[0.2rem] ml-2 font-semibold">
                                TabberTrack
                            </p>
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