import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export async function NavBar(){
    const session = await getServerSession(authOptions)

    return(
        <div>
            {session &&
                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline">{session!.user!.name}</Button>
                    </PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                </Popover>
            }
        </div>
    );
}