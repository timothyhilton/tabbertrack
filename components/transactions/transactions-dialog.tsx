'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

interface AddTransactionDialogProps{
    friendNames: {
        name: string,
        username: string
    }[],
    externalFriendNames: string[]
}

export function AddTransactionDialog({ friendNames, externalFriendNames }: AddTransactionDialogProps){
    const [friendType, setFriendType] = useState("")

    return(
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add a transaction
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
                <FriendTypeFormWrapper friendType={friendType} friendNames={friendNames} externalFriendNames={externalFriendNames}/>
            </DialogHeader>
        </DialogContent>
    )
}

interface FriendTypeFormWrapperProps extends AddTransactionDialogProps{
    friendType: string
}

function FriendTypeFormWrapper({ friendType, friendNames, externalFriendNames }: FriendTypeFormWrapperProps){ 
    if (friendType == "registered"){ // todo: maybe make this whole "registered" "unregisterd" thing better? (type safe?)
        return(
            <RegisteredFriendTransactionForm friendNames={friendNames} />
        )
    } else if (friendType == "unregistered") {
        return(
            <UnRegisteredFriendTransactionForm />
        )
    } else {
        return(<></>)
    }
}

function RegisteredFriendTransactionForm(
    { friendNames }: 
    { friendNames: {
        name: string,
        username: string
    }[] }){

    const router = useRouter()
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")

    const [data, setData] = useState({ username: '', amount: 0 })

    async function onSubmit(){
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

    function handleUserChange(x: any){
        setData({...data, username: x})
    }

    function handleDollarChange(x: any){
        setData({...data, amount: parseFloat(x)})
    }

    return (
        <div className="w-full space-y-2">
            {error &&
                <Alert className={`bg-red-500 ${errorBoxColour}`}>
                    <AlertTitle>Hey!</AlertTitle>
                    <AlertDescription>
                    {error}
                    </AlertDescription>
                </Alert>
            }
                <Input className="mt-5" placeholder="$---" type="number" />
                <Select onValueChange={handleUserChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a friend" />
                    </SelectTrigger>
                    <SelectContent>
                        {friendNames.map((name) => {
                            return (
                                <SelectItem className="flex flex-row flex-nowrap" value={name.username}>
                                    <div> {name.name} </div> 
                                    <div className="text-muted-foreground">{name.username}</div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            <Button type="submit" className="w-full" onClick={onSubmit}>Submit</Button>
        </div>
    )
}

function UnRegisteredFriendTransactionForm(){
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