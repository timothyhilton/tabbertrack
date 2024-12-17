import { getServerSession } from "next-auth";
import { authOptions } from "@/auth_options";
import { NavBar } from "../navbar";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTable from "@/components/transactions/transactions-table";
import ExternalTransactionTable from "@/components/transactions/external-transactions-table";

export default async function Transactions(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    const userId = parseInt(session.user!.id)
    
    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            from: true,
            to: true
        }
    })

    const externalTransactions = await prisma.externalTransaction.findMany({
        where: {
            userId: userId
        },
        include: {
            externalFriend: true
        }
    })

    const transactionProps = transactions.map(transaction => ({
        otherUser: transaction.fromUserId === userId ? transaction.to.name ?? "Unknown" : transaction.from.name ?? "Unknown",
        otherUsername: transaction.fromUserId === userId ? transaction.to.username : transaction.from.username,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt,
        id: transaction.id,
        description: transaction.description,
        doesSenderOwe: transaction.doesSenderOwe,
        direction: (transaction.fromUserId === userId ? "sent" : "received") as ("sent" | "received")
    }))

    const externalTransactionProps = externalTransactions.map(transaction => ({
        name: transaction.externalFriend.name,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        description: transaction.description,
        doesSenderOwe: transaction.doesUserOwe,
        id: transaction.id
    }))

    return(
        <>
            <NavBar />
            <div className="lg:px-[15vw] mt-[5rem]">
                <h1 className="mb-10 text-3xl flex font-semibold justify-center">
                    Transactions
                </h1>
                <div className="flex justify-center">
                    <Tabs defaultValue="received" className="lg:w-[89%]">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="received">Friends on TabberTrack</TabsTrigger>
                            <TabsTrigger value="sent">Unregistered Friends</TabsTrigger>
                        </TabsList>
                        <TabsContent value="received">
                            <TransactionsTable transactions={transactionProps} />
                        </TabsContent>
                        <TabsContent value="sent">
                            <ExternalTransactionTable transactions={externalTransactionProps} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}