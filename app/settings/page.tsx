import { Card } from "@/components/ui/card";
import { NavBar } from "../navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth_options";
import { redirect } from "next/navigation";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import SettingsDialog from "@/components/settings/dialog";
import EmailDialog from "@/components/settings/emaildialog";

export default async function SettingsPage(){
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        redirect('/api/auth/signin')
    }

    return(
        <>
            <NavBar />
            
            <div className="lg:px-[15vw] md:px-[5vw] mt-[5rem]">
                <h1 className="mb-10 text-3xl flex font-semibold justify-center">
                    Settings
                </h1>
                <Card className="max-w-xl justify-center mx-auto">
                    <CardHeader>
                        <CardTitle>Account Info</CardTitle>
                        <CardDescription>See your account info and make changes as necessary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm">Name</p>
                            <p className="text-lg">{session.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm">Username</p>
                            <p className="text-lg">{session.user.username}</p>
                        </div>
                        <div>
                            <p className="text-sm">Email</p>
                            <p className="text-lg">{session.user.email}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="space-x-6">
                        <SettingsDialog name={session.user.name!} username={session.user.username} />
                        <EmailDialog />
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}