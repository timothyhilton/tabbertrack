'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"  
import { Button } from "../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useState } from "react"

export default function AwaitingEmailChange({email, token}: {email: string, token: string}) {
    const [error, setError] = useState("")
    const [errorBoxColour, setErrorBoxColour] = useState("")

    async function cancelRequest(){
        const res = await fetch("/api/auth/update/email/cancel", {
            method: "PUT",
            body: JSON.stringify(token)
        })

        const resJSON = await res.json()

        if(resJSON.error){
            setError(resJSON.error)
        } else {
            setErrorBoxColour("bg-green-500")
            setError(resJSON.success)
        }
    }

    return(
        <div className="flex h-screen">
            <Card className="m-auto">
                <CardHeader>
                    <CardTitle>Email Change Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p>You <b>must</b> check <code className="bg-muted rounded">{email}</code> before you can continue.</p>
                    {error &&
                        <Alert className={`bg-red-500 ${errorBoxColour}`}>
                            <AlertTitle>Hey!</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    }
                </CardContent>
                <CardFooter>
                    <Button className="w-full mr-6" onClick={cancelRequest}>Cancel</Button>
                    <Button className="w-full">Resend</Button>
                </CardFooter>
            </Card>
        </div>
    )
}