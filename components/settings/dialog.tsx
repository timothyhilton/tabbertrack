'use client'

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import router from "next/router";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface settingsDialogProps {
    name: string,
    username: string,
    email: string
}

export default function SettingsDialog({ name, username, email }: settingsDialogProps){
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
                        username
                        <Input {...register("username")} defaultValue={username} />
                    </Label>
                    <Label>
                        email
                        <Input {...register("email")} defaultValue={email} />
                    </Label>
                    <Label>
                        password <span className="text-muted-foreground text-xs"> - leave this blank to not change your password</span>
                        <Input {...register("password")} />
                    </Label>
                    <Button className="mt-3">Submit changes</Button>
                    <p className="text-muted-foreground text-xs">*note that changing your password and/or email will require an email verification</p>
                </form>

            </DialogContent>
        </Dialog>
    )
}