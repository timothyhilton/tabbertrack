'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

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
        let realData = data; // SEE MY COMMENT BELOW IN THE JSX ABOUT THIS! I KNOW ITS BAD, I APOLOGISE IN ADVANCE
        realData.username = realData.usernamee;

        const res = await fetch("/api/friends", {
            method: "POST",
            body: JSON.stringify(realData)
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
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            {error &&
              <Alert className={`bg-red-500 ${errorBoxColour}`}>
                <AlertTitle>Hey!</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            }
            <Label htmlFor="username">
              username of your friend
              <Input placeholder="username" {...register("usernamee")} /> {/*JANKY, I KNOW but the browser will prefill this field with the username of the user as if they're logging in if I don't do this.*/}
            </Label>
            
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
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            {error &&
              <Alert className={`bg-red-500 ${errorBoxColour}`}>
                <AlertTitle>Hey!</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            }
            <Label htmlFor="name">
              name of external friend
              <Input placeholder="name" {...register("name")} />
            </Label>
            
            <Button className="w-full">
                Add unregistered friend
            </Button>
        </form>
    )
}