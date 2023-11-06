"use client"

import { useEffect, useState } from "react"
import TimeAgoWrapper from "../time-ago"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Switch } from "../ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import ReactTimeAgo from 'react-time-ago'
import UserLink from "../ui/userlink"

interface SentTransactionsTableProps{
    sentTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date,
        description: string,
        doesSenderOwe: boolean
    }[]
}

export default function SentTransactionsTable({ sentTransactionRequests }: SentTransactionsTableProps){
    const [transactions, setTransactions] = useState(sentTransactionRequests)
    const [hidden, setHidden] = useState({
        declined: true,
        accepted: false
    })

    useEffect(() => {
        let tempTransactions = sentTransactionRequests;
        
        if(hidden.declined){
            tempTransactions = tempTransactions.filter(transaction => transaction.status != "declined")
        }

        if(hidden.accepted){
            tempTransactions = tempTransactions.filter(transaction => transaction.status != "accepted")
        }

        setTransactions(tempTransactions)
    }, [hidden, sentTransactionRequests]);

    return(
        <div>
            <div className="border rounded-md w-full h-fit">
                <Table className="">
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
                                <TableRow key={transaction.username}>
                                    <TableCell className="font-medium text-xs md:text-sm">
                                        <TimeAgoWrapper date={transaction.createdAt} />
                                    </TableCell>
                                    <TableCell className="flex flex-col md:flex-row text-xs md:text-sm">
                                        <UserLink name={transaction.name} username={transaction.username} link={true} />
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
                                            !transaction.doesSenderOwe ? (
                                                "text-green-600"
                                            ) : (
                                                "text-red-600"
                                            )
                                        }> 
                                            {!transaction.doesSenderOwe ? ("+") : ("-")} 
                                            {"$" + transaction.amount.toFixed(2)} 
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs md:text-sm">
                                        {transaction.status}
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