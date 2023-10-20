'use client'

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"

interface SentTransactionsTableProps{
    receivedTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date,
        id: number
    }[]
}

export default function ReceivedTransactionsTable({ receivedTransactionRequests }: SentTransactionsTableProps){
    const router = useRouter();

    async function respondToTransactionRequest(verdict: string, id: number) {
        const res = await fetch("/api/transactions/respond", {
            method: "POST",
            body: JSON.stringify({
                id: id,
                verdict: verdict
            })
        })

        console.log(await res.json())
        router.refresh()
    }

    return(
        <div>
            <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[150px]">Received at</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Respond</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receivedTransactionRequests.map(transaction => {
                            return (
                                <TableRow>
                                    
                                    <TableCell className="font-medium">
                                        {transaction.createdAt.toUTCString()}
                                    </TableCell>

                                    <TableCell className="flex flex-row"> {/* todo: make this styling work when req accepted */}
                                        <p>{transaction.name}</p>
                                        <p className="text-muted-foreground">&nbsp;/ {transaction.username}</p>
                                    </TableCell>

                                    <TableCell className="">
                                        {transaction.status}
                                    </TableCell>

                                    <TableCell className="flex flex-row justify-end space-x-4">
                                        {(transaction.status == "pending") &&
                                            <div className="flex flex-row justify-end space-x-4">
                                                <Button onClick={() => respondToTransactionRequest("accept", transaction.id)} className="bg-green-600 hover:bg-green-700 text-slate-50">
                                                    Accept
                                                </Button>
                                                <Button onClick={() => respondToTransactionRequest("decline", transaction.id)} variant="destructive">
                                                    Decline
                                                </Button>
                                            </div>
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}