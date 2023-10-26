'use client'

import { useRouter } from "next/navigation";
import { Button } from "../../ui/button"

export default function unFriendButtonExternal({ name }: { name: string}){
    const router = useRouter();
    
    async function unFriend(){
        const res = await fetch("/api/friends/removeexternal", {
            method: "POST",
            body: JSON.stringify({
                name: name
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