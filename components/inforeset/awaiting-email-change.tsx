import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"  
import { Button } from "../ui/button"

export default function AwaitingEmailChange({email}: {email: string}) {
    return(
        <div className="flex h-screen">
            <Card className="m-auto">
                <CardHeader>
                    <CardTitle>Email Change Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You <b>must</b> check <code className="bg-muted rounded">{email}</code> before you can continue.</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full mr-6">Cancel</Button>
                    <Button className="w-full">Resend</Button>
                </CardFooter>
            </Card>
        </div>
    )
}