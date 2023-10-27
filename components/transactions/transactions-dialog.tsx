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
import TransactionForm from "./transaction-form";

interface AddTransactionDialogProps{
    friendNames: {
        name: string,
        username: string
    }[],
    externalFriendNames: string[]
}

export function AddTransactionDialog({ friendNames, externalFriendNames }: AddTransactionDialogProps){
    const [friendType, setFriendType] = useState("")

    console.log(externalFriendNames)

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
            <TransactionForm friendNames={friendNames} type="normal" />
        )
    } else if (friendType == "unregistered") {
        return(
            <TransactionForm externalFriendNames={externalFriendNames} type="external" />
        )
    } else {
        return(<></>)
    }
}