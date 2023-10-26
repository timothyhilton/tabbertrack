'use client'

import { useRouter } from "next/navigation"
import { Button } from "../../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Switch } from "../../ui/switch"
import { Label } from "../../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { useEffect, useState } from "react"
import TimeAgoWrapper from "../../time-ago"
import FriendReqResponseButtons from "./friend-req-response-buttons"

interface ReceivedFriendReqTableProps{
    receivedFriendRequests: {
        name: string,
        username: string,
        status: string,
        createdAt: Date,
    }[]
}

export default function ReceivedFriendReqTable({ receivedFriendRequests }: ReceivedFriendReqTableProps){
    const router = useRouter();
    const [requests, setRequests] = useState(receivedFriendRequests)
    const [hidden, setHidden] = useState({
        declined: true,
        accepted: false
    })

    useEffect(() => { // filter out declined/accepted transactions to match the 'configure' menu
        let tempRequests = receivedFriendRequests;
        
        if(hidden.declined){
            tempRequests = tempRequests.filter(request => request.status != "declined")
        }

        if(hidden.accepted){
            tempRequests = tempRequests.filter(request => request.status != "accepted")
        }

        setRequests(tempRequests)
    }, [hidden, receivedFriendRequests]);

    return(
        <div>
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs md:text-sm">Sent</TableHead>
                            <TableHead className="text-xs md:text-sm">From</TableHead>
                            <TableHead className="text-xs md:text-sm"></TableHead> {/* no idea why, but without this empty one the styling gets all messed up */}
                            <TableHead className="text-right text-xs md:text-sm">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map(friend => {
                            return (
                                <TableRow key={friend.username}>
                                    <TableCell className="font-medium text-xs md:text-sm">
                                        <TimeAgoWrapper date={friend.createdAt} /> ago
                                    </TableCell>

                                    <TableCell className="flex flex-col md:flex-row text-xs md:text-sm">
                                        <p>{friend.name}</p>
                                        <p className="text-muted-foreground whitespace-nowrap">&nbsp;/ {friend.username}</p>
                                    </TableCell>

                                    <TableCell></TableCell> {/* see comment on line 52 */}

                                    <TableCell className="flex flex-row justify-end space-x-4">
                                        {(friend.status == "pending") &&
                                            <FriendReqResponseButtons fromUsername={friend.username}/>
                                        }
                                        {(friend.status != "pending") &&
                                            <div>{friend.status}</div>
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-2">
                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline">
                            Configure
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="declined" checked={hidden.declined} onCheckedChange={() => setHidden({...hidden, declined: !hidden.declined})} />
                            <Label htmlFor="declined">Hide declined requests</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="accepted" checked={hidden.accepted} onCheckedChange={() => setHidden({...hidden, accepted: !hidden.accepted})} />
                            <Label htmlFor="accepted">Hide accepted requests</Label>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}