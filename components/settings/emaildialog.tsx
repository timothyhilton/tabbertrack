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

export default function EmailDialog(){
    const { data: session, status } = useSession()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")

    async function onSubmit(data: any){
        const res = await fetch("/api/auth/update/email", {
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
            <DialogTrigger><Button>Change email</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Change email address</DialogTitle>
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
                        new email
                        <Input {...register("email")} />
                    </Label>
                    <Button className="mt-3">Submit changes</Button>
                    <p className="text-muted-foreground text-xs">*note that this will require an email verification on both ends</p>
                </form>

            </DialogContent>
        </Dialog>
    )
}