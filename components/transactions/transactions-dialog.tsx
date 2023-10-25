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

function RegisteredFriendTransactionForm( // i am aware this is handled horribly...
    { friendNames }: 
    { friendNames: {
        name: string,
        username: string
    }[] }){

    const router = useRouter()
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")
    const [submitClassName, setSubmitClassName] = useState("hidden")

    const [data, setData] = useState({ 
        username: '', 
        amount: 0.0,
        userWhoOwes: '',
        description: ''
    })

    async function onSubmit(){
        const res = await fetch("/api/transactions", {
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
        setData({...data, amount: parseFloat(x.target.value)})
    }

    function handleOweChange(doesSenderOwe: boolean){
        if(doesSenderOwe){
            setSubmitClassName("visible")
            setData({...data, userWhoOwes: "sender"})
        }
        else {
            setSubmitClassName("visible bg-green-600 hover:bg-green-700 text-slate-50")
            setData({...data, userWhoOwes: "receiver"})
        }
    }

    function handleDescriptionChange(x: any){
        setData({...data, description: x.target.value});
    }

    return (
        <form className="w-full">
            {error &&
                <Alert className={`bg-red-500 ${errorBoxColour}`}>
                    <AlertTitle>Hey!</AlertTitle>
                    <AlertDescription>
                    {error}
                    </AlertDescription>
                </Alert>
            }
                <Input className="mt-5 mb-2" placeholder="amount" type="number" onChange={handleDollarChange} />
                <Input className="mt-2 mb-2" placeholder="description (optional)" maxLength={30} onChange={handleDescriptionChange} />
                <Select onValueChange={handleUserChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a friend" />
                    </SelectTrigger>
                    <SelectContent>
                        {friendNames.map((name) => {
                            return (
                                <SelectItem value={name.username}>
                                    <div className="flex flex-row flex-nowrap">
                                        <div> {name.name} </div> 
                                        <div className="text-muted-foreground">&nbsp;/ {name.username}</div>
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
                {data.username != "" &&
                    <div>
                        <p className="text-muted-foreground text-sm mt-2">Who owes who?</p>
                        <div className="grid grid-flow-col justify-stretch space-x-6">
                            <Button type="button" variant="outline" onClick={() => handleOweChange(true)}>
                                I owe ${data.amount} to {data.username}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => handleOweChange(false)}>
                                {data.username} owes me ${data.amount}
                            </Button>
                        </div>
                    </div>
                }
            
            <Button variant="destructive" type="button" onClick={onSubmit} className={`w-full mt-6 ${submitClassName}`}>Submit</Button>
        </form>
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