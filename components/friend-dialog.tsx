'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";

export function AddFriendDialog(){
    const [friendType, setFriendType] = useState("")

    return(
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add a friend
                </DialogTitle>
                <DialogDescription>
                    Does this person already have an account on TabberTrack?
                </DialogDescription>
                <div className="grid grid-flow-col justify-stretch space-x-6">
                    <Button onClick={() => setFriendType("registered")} className="mt-3">
                        Yes
                    </Button>
                    <Button onClick={() => setFriendType("unregistered")} className="mt-3">
                        No
                    </Button>
                </div>
                <FriendFormWrapper friendType={friendType}/>
            </DialogHeader>
        </DialogContent>
    )
}

function FriendFormWrapper({ friendType }: { friendType: string}){ 
    if (friendType == "registered"){ // todo: maybe make this whole "registered" "unregisterd" thing better? (type safe?)
        return(
            <RegisteredFriendForm />
        )
    } else if (friendType == "unregistered") {
        return(
            <>unregistered</>
        )
    } else {
        return(<></>)
    }
}

function RegisteredFriendForm(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const onSubmit = (data: any) => console.log(data)

    return (
        <form className="pt-5 space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="username" {...register("username")} />
            
            <Button className="w-full">
                Send request
            </Button>
        </form>
    )
}