import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface SentTransactionsTableProps{
    sentTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date
    }[]
}

export default function SentTransactionsTable({ sentTransactionRequests }: SentTransactionsTableProps){
    return(
        <div className="border rounded-md w-full h-fit">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Sent at</TableHead>
                        <TableHead className="max-w-[250px]">To</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow> 
                </TableHeader>
                <TableBody>
                    {sentTransactionRequests.map(transaction => {
                        return (
                            <TableRow>
                                <TableCell className="font-medium">
                                    {transaction.createdAt.toUTCString()}
                                </TableCell>
                                <TableCell className="flex flex-row">
                                    <p>{transaction.name}</p>
                                    <p className="text-muted-foreground">&nbsp;/ {transaction.username}</p>
                                </TableCell>
                                <TableCell>
                                    {"$" + transaction.amount.toFixed(2)}
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
    )
}