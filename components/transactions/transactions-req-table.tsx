'use client'

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import prisma from '@/db'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface TransactionsReqTableProps{
    sentTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date
    }[],
    receivedTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date
    }[]
}

export default async function TransactionsReqTable({ sentTransactionRequests, receivedTransactionRequests }: TransactionsReqTableProps){
    

    return(
        <div className="flex flex-col lg:flex-row justify-center space-y-10 lg:space-y-0 lg:space-x-10 mt-10">
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
                        {receivedTransactionRequests.map(async (transaction) => {
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
                                        {/*(transaction.status == "pending") &&
                                            //<FriendReqResponseButtons fromUsername={await getNameFromReq(friendReq.fromUserId, "username")}/>
                                        */}                                            
                                    </TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[150px]">Sent at</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        </TableRow> 
                    </TableHeader>
                    <TableBody>
                        {sentTransactionRequests.map((transaction) => {
                            return (
                                <TableRow>
                                    <TableCell className="font-medium">
                                        {transaction.createdAt.toUTCString()}
                                    </TableCell>
                                    <TableCell className="flex flex-row">
                                        <p>{transaction.name}</p>
                                        <p className="text-muted-foreground">&nbsp;/ {transaction.username}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {transaction.status}
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