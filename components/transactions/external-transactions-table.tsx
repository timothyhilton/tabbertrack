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

interface ExternalTransactionsTableProps{
    transactions: {
        name: string
        amount: number,
        createdAt: Date,
        description: string,
        doesSenderOwe: boolean,
        id: number
    }[]
}

export default function ExternalTransactionTable({ transactions }: ExternalTransactionsTableProps){
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
                            <TableHead className="text-xs md:text-sm">Created</TableHead>
                            <TableHead className="text-xs md:text-sm">Friend</TableHead>
                            <TableHead className="text-xs md:text-sm">Description</TableHead>
                            <TableHead className="text-xs md:text-sm">Amount</TableHead>
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
                                        <UserLink name={transaction.name} external={true} link={true} />
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
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}