import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { NavBar } from "../navbar";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SentTransactionsTable from "@/components/transactions/sent-transactions-table";
import ReceivedTransactionsTable from "@/components/transactions/received-transactions-table";

export default async function Transactions(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    
    const sentFriendRequests = await prisma.transaction.findMany({
        where: {
            fromUserId: parseInt(session.user!.id)
        }
    })

    const receivedFriendRequests = await prisma.transaction.findMany({
        where: {
            toUserId: parseInt(session.user!.id)
        }
    })

    async function getNamesFromId(id: number){
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        })
        return { name: user!.name! , username: user!.username }
    }

    const sentTransactionProps = await Promise.all(sentFriendRequests
        .map(async request => {
            return {
                ...(await getNamesFromId(request.toUserId)),
                amount: request.amount,
                status: request.status,
                createdAt: request.createdAt,
                description: request.description,
                doesSenderOwe: request.doesSenderOwe
            }
        }))

        // oh. my. goodness. 'await Promise.all()' is the silliest thing ive seen in my life but for some reason I can't just await it directly. WHY???

    const receivedTransactionProps = await Promise.all(receivedFriendRequests
        .map(async request => {
            return {
                ...(await getNamesFromId(request.fromUserId)),
                amount: request.amount,
                status: request.status,
                createdAt: request.createdAt,
                id: request.id,
                description: request.description,
                doesSenderOwe: request.doesSenderOwe
            }
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
                            <TabsTrigger value="received">Received Transaction Requests</TabsTrigger>
                            <TabsTrigger value="sent">Sent Transaction Requests</TabsTrigger>
                        </TabsList>
                        <TabsContent value="received">
                            <ReceivedTransactionsTable receivedTransactionRequests={receivedTransactionProps} />
                        </TabsContent>
                        <TabsContent value="sent">
                            <SentTransactionsTable sentTransactionRequests={sentTransactionProps} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}