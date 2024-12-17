import { getServerSession } from "next-auth";
import { authOptions } from "@/auth_options";
import { NavBar } from "../navbar";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SentTransactionsTable from "@/components/transactions/sent-transactions-table";
import ReceivedTransactionsTable from "@/components/transactions/received-transactions-table";
import TransactionsTable from "@/components/transactions/transactions-table";

export default async function Transactions(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    const userId = parseInt(session.user!.id)
    
    // Fetch transactions for the logged-in user
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
    }));

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
                            {/*<SentTransactionsTable sentTransactionRequests={sentTransactionProps} />*/}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}