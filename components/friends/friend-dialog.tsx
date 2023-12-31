'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";

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
            <UnRegisteredFriendForm />
        )
    } else {
        return(<></>)
    }
}

function RegisteredFriendForm(){
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")

    async function onSubmit(data: any){
        const res = await fetch("/api/friends", {
            method: "POST",
            body: JSON.stringify(data)
        })

        const resJSON = await res.json()

        if(resJSON.error){
            setError(resJSON.error)
        } else {
            setErrorBoxColour("bg-green-500")
            setError(resJSON.success)
            router.refresh()
        }
    }

    return (
        <form className="pt-5 space-y-2" onSubmit={handleSubmit(onSubmit)}>
            {error &&
              <Alert className={`bg-red-500 ${errorBoxColour}`}>
                <AlertTitle>Hey!</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            }
            <Input placeholder="username" {...register("username")} />
            
            <Button className="w-full">
                Send request
            </Button>
        </form>
    )
}

function UnRegisteredFriendForm(){
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")

    async function onSubmit(data: any){
        const res = await fetch("/api/friends/addexternal", {
            method: "POST",
            body: JSON.stringify(data)
        })

        const resJSON = await res.json()

        if(resJSON.error){
            setError(resJSON.error)
        } else {
            setErrorBoxColour("bg-green-500")
            setError(resJSON.success)
            router.refresh()
        }
    }

    return (
        <form className="pt-5 space-y-2" onSubmit={handleSubmit(onSubmit)}>
            {error &&
              <Alert className={`bg-red-500 ${errorBoxColour}`}>
                <AlertTitle>Hey!</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            }
            <Input placeholder="name" {...register("name")} />
            
            <Button className="w-full">
                Add unregistered friend
            </Button>
        </form>
    )
}