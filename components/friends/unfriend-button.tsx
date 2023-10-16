'use client'

import { useRouter } from "next/navigation";
import { Button } from "../ui/button"

export default function unFriendButton({ username }: { username: string}){
    const router = useRouter();
    
    async function unFriend(){
        const res = await fetch("/api/friends/unfriend", {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })

        router.refresh()
    }

    return(
        <Button className="ml-4" variant="destructive" onClick={() => unFriend()}>
            Remove
        </Button>
    )
}