'use client'

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useEffect, useState } from "react"
import TimeAgoWrapper from "../time-ago"

interface SentTransactionsTableProps{
    receivedTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date,
        id: number,
        description: string
    }[]
}

export default function ReceivedTransactionsTable({ receivedTransactionRequests }: SentTransactionsTableProps){
    const router = useRouter();
    const [transactions, setTransactions] = useState(receivedTransactionRequests)
    const [hidden, setHidden] = useState({
        declined: true,
        accepted: false
    })

    useEffect(() => {
        let tempTransactions = receivedTransactionRequests;
        
        if(hidden.declined){
            tempTransactions = tempTransactions.filter(transaction => transaction.status != "declined")
        }

        if(hidden.accepted){
            tempTransactions = tempTransactions.filter(transaction => transaction.status != "accepted")
        }

        setTransactions(tempTransactions)
    }, [hidden]);

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
                            <TableHead className="text-xs md:text-sm">To</TableHead>
                            <TableHead className="text-xs md:text-sm">Description</TableHead>
                            <TableHead className="text-xs md:text-sm">Amount</TableHead>
                            <TableHead className="text-right text-xs md:text-sm">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(transaction => {
                            return (
                                <TableRow>
                                    
                                    <TableCell className="font-medium text-xs md:text-sm">
                                        <TimeAgoWrapper date={transaction.createdAt} /> ago
                                    </TableCell>

                                    <TableCell className="flex flex-col md:flex-row text-xs md:text-sm"> {/* todo: make this styling work when req accepted */}
                                        <p>{transaction.name}</p>
                                        <p className="text-muted-foreground whitespace-nowrap">&nbsp;/ {transaction.username}</p>
                                    </TableCell>

                                    <TableCell className="text-xs md:text-sm">
                                        {transaction.description ? (
                                            <div> {transaction.description} </div>
                                        ) : (
                                            <div className="text-muted-foreground"> none </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-xs md:text-sm">
                                        {"$" + transaction.amount.toFixed(2)}
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
                            <Label htmlFor="declined">Hide declined transactions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="accepted" checked={hidden.accepted} onCheckedChange={() => setHidden({...hidden, accepted: !hidden.accepted})} />
                            <Label htmlFor="accepted">Hide accepted transactions</Label>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}