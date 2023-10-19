import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface SentTransactionsTableProps{
    receivedTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date
    }[]
}

export default function ReceivedTransactionsTable({ receivedTransactionRequests }: SentTransactionsTableProps){
    return(
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
    )
}