import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/modetoggle";
import UserIcon from "@/components/navbar/user-icon";
import { LoginButton } from "@/components/auth";


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
                            <UserIcon />
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