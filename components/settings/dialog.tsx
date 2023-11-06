'use client'

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface settingsDialogProps {
    name: string,
    username: string,
    email: string
}

export default function SettingsDialog({ name, username, email }: settingsDialogProps){
    const { register, handleSubmit } = useForm()
    function onSubmit(e: any){console.log(e)}

    return (
        <Dialog>
            <DialogTrigger><Button>Change info</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Change account info</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
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