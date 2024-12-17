'use client'

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useEffect, useState } from "react"
import TimeAgoWrapper from "../time-ago"
import UserLink from "../ui/userlink"

interface TransactionsTableProps{
    transactions: {
        otherUser: string,
        otherUsername: string,
        amount: number,
        status: string,
        createdAt: Date,
        id: number,
        description: string,
        doesSenderOwe: boolean,
        direction: "sent" | "received"
    }[]
}

export default function Transactions({ transactions }: TransactionsTableProps){
    const router = useRouter();
    const [hidden, setHidden] = useState({
        declined: true,
        accepted: false
    })

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
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs md:text-sm">Sent</TableHead>
                            <TableHead className="text-xs md:text-sm">From</TableHead>
                            <TableHead className="text-xs md:text-sm">Description</TableHead>
                            <TableHead className="text-xs md:text-sm">Amount</TableHead>
                            <TableHead className="text-right text-xs md:text-sm">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(transaction => {
                            return (
                                <TableRow key={transaction.id}>
                                    
                                    <TableCell className="font-medium text-xs md:text-sm">
                                        <TimeAgoWrapper date={transaction.createdAt} />
                                    </TableCell>

                                    <TableCell className="flex flex-col md:flex-row text-xs md:text-sm">
                                        <UserLink name={transaction.otherUser} username={transaction.otherUsername} link={true} />
                                    </TableCell>

                                    <TableCell className="text-xs md:text-sm">
                                        {transaction.description ? (
                                            <div> {transaction.description} </div>
                                        ) : (
                                            <div className="text-muted-foreground"> none </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-xs md:text-sm">
                                        <div className={
                                            transaction.doesSenderOwe ? (
                                                "text-green-600"
                                            ) : (
                                                "text-red-600"
                                            )
                                        }> 
                                            {transaction.doesSenderOwe ? ("+") : ("-")} 
                                            {"$" + transaction.amount.toFixed(2)} 
                                        </div>
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
                                        {(transaction.status != "pending") &&
                                            <div>{transaction.status}</div>
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