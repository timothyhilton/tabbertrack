import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function NavBar(){
    const session = await getServerSession(authOptions)

    return(
        <div>
            {session &&
                <div className="pt-2 pb-2 border-b-[1px]">
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="ghost" className="rounded-full w-[2.8rem] h-[2.8rem]">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcnjkj.png" />
                                    <AvatarFallback className="bg-slate-800">
                                        {session!.user!.name!.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>Place content for the popover here.</PopoverContent>
                    </Popover>
                </div>
            }
        </div>
    );
}