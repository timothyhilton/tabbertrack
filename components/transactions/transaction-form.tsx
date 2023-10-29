import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import UserLink from "../ui/userlink"

interface TransactionFormProps {
    friendNames?: {
        name: string
        username: string
    }[],
    externalFriendNames?: string[],
    type: string // 'normal' || 'external'
}

export default function TransactionForm({ friendNames, externalFriendNames, type }: TransactionFormProps){
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
        const res = await fetch(((type == "normal") ? "/api/transactions" : "/api/transactions/external"), {
            method: "POST",
            body: JSON.stringify({name: data.username, ...data})
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
                        <SelectValue placeholder={(type == "normal") ? "Select a friend" : "Select an external friend"} />
                    </SelectTrigger>
                    <SelectContent>
                        {type == "normal" && friendNames && friendNames.map((name) => {
                            return (
                                <SelectItem value={name.username} key={name.username}>
                                    <div className="flex flex-row flex-nowrap">
                                        <UserLink username={name.username} name={name.name} link={false} />
                                    </div>
                                </SelectItem>
                            )
                        })}
                        {type == "external" && externalFriendNames && externalFriendNames.map((name) => {
                            return (
                                <SelectItem value={name} key={name}>
                                    <div className="flex flex-row flex-nowrap">
                                        {name}
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
                                I owe ${data.amount.toFixed(2)} to {data.username}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => handleOweChange(false)}>
                                {data.username} owes me ${data.amount.toFixed(2)}
                            </Button>
                        </div>
                    </div>
                }
            
            <Button variant="destructive" type="button" onClick={onSubmit} className={`w-full mt-6 ${submitClassName}`}>Submit</Button>
        </form>
    )
}