import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface SentTransactionsTableProps{
    sentTransactionRequests: {
        name: string,
        username: string,
        amount: number,
        status: string,
        createdAt: Date,
        description: string
    }[]
}

export default function SentTransactionsTable({ sentTransactionRequests }: SentTransactionsTableProps){
    return(
        <div className="border rounded-md w-full h-fit">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="max-w-[150px]">Sent at</TableHead>
                        <TableHead className="max-w-[250px]">To</TableHead>
                        <TableHead className="">Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow> 
                </TableHeader>
                <TableBody>
                    {sentTransactionRequests.map(transaction => {
                        return (
                            <TableRow>
                                <TableCell className="font-medium text-xs md:text-sm">
                                    {transaction.createdAt.toUTCString()}
                                </TableCell>
                                <TableCell className="flex flex-row">
                                    <p>{transaction.name}</p>
                                    <p className="text-muted-foreground">&nbsp;/ {transaction.username}</p>
                                </TableCell>
                                <TableCell>
                                    {transaction.description ? (
                                         <div> {transaction.description} </div>
                                    ) : (
                                        <div className="text-muted-foreground"> none </div>
                                    )}
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