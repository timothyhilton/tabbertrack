'use client'

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import router from "next/router";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { signOut, useSession } from 'next-auth/react'


interface settingsDialogProps {
    name: string,
    username: string
}

export default function SettingsDialog({ name, username }: settingsDialogProps){
    const { data: session, status } = useSession()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")

    async function onSubmit(data: any){
        const res = await fetch("/api/auth/update", {
            method: "PUT",
            body: JSON.stringify(data)
        })

        const resJSON = await res.json()

        if(resJSON.error){
            setError(resJSON.error)
        } else {
            setErrorBoxColour("bg-green-500")
            setError(resJSON.success)

            // if their changes don't require an email verification, log them out immediately
            if(data.password == ""){signOut()}
        }
    }

    return (
        <Dialog>
            <DialogTrigger><Button>Change info</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Change account info</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {error &&
                        <Alert className={`bg-red-500 ${errorBoxColour}`}>
                            <AlertTitle>Hey!</AlertTitle>
                            <AlertDescription>
                            {error}
                            </AlertDescription>
                        </Alert>
                    }
                    <Label>
                        name
                        <Input {...register("name")} defaultValue={name} />
                    </Label>
                    <Label>
                        username <span className="text-muted-foreground text-xs"> - username changes have a 7 day cooldown</span>
                        <Input {...register("username")} defaultValue={username} maxLength={20}/>
                    </Label>
                    <Label>
                        password <span className="text-muted-foreground text-xs"> - leave this blank to not change your password</span>
                        <Input {...register("password")} />
                    </Label>
                    <Button className="mt-3">Submit changes</Button>
                    <p className="text-muted-foreground text-xs">*note that changing your password will require an email verification</p>
                </form>

            </DialogContent>
        </Dialog>
    )
}