'use client'

import { useRouter } from 'next/navigation';
import { Button } from "../../ui/button";

export default function FriendReqResponseButtons({ fromUsername }: { fromUsername: string | null }){
    const router = useRouter();

    async function respondToFriendReq(verdict: string) {

        console.log(fromUsername)

        const res = await fetch("/api/friends/respond", {
            method: "POST",
            body: JSON.stringify({
                username: fromUsername,
                verdict: verdict
            })
        })

        console.log(await res.json())

        router.refresh()

    }

    return(
        <div className="flex flex-row justify-end space-x-4">
            <Button onClick={() => respondToFriendReq("accept")} className="bg-green-600 hover:bg-green-700 text-slate-50">
                Accept
            </Button>
            <Button onClick={() => respondToFriendReq("decline")} variant="destructive">
                Decline
            </Button>
        </div>
    )
}