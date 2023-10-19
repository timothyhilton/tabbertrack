import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { NavBar } from "../navbar";
import TransactionsReqTable from "@/components/transactions/transactions-req-table";
import prisma from "@/db";
import { redirect } from "next/navigation";

export default async function Transactions(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    
    const sentPendingFriendRequests = await prisma.transaction.findMany({
        where: {
            fromUserId: parseInt(session.user!.id),
            status: "pending"
        }
    })

    const receivedFriendRequests = await prisma.transaction.findMany({
        where: {
            toUserId: parseInt(session.user!.id),
            status: "pending"
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

    const sentPendingFriendRequestsProps = await Promise.all(sentPendingFriendRequests
        .map(async request => {
            return {
                ...(await getNamesFromId(request.toUserId)),
                amount: request.amount,
                status: request.status,
                createdAt: request.createdAt
            }
        }))

        // oh. my. goodness. 'await Promise.all()' is the silliest thing ive seen in my life but for some reason I can't just await it directly. WHY???

    const receivedFriendRequestsProps = await Promise.all(receivedFriendRequests
        .map(async request => {
            return {
                ...(await getNamesFromId(request.fromUserId)),
                amount: request.amount,
                status: request.status,
                createdAt: request.createdAt
            }
        }))

    return(
        <>
            <NavBar />
            <div className="lg:px-[15vw] mt-[5rem]">
                <h1 className="mb-10 text-3xl flex font-semibold justify-center">
                    Transactions
                </h1>
                <TransactionsReqTable sentTransactionRequests={sentPendingFriendRequestsProps} receivedTransactionRequests={receivedFriendRequestsProps} />
                <h1 className="mb-4 mt-10 text-3xl flex font-semibold justify-center">
                    Friend requests
                </h1>
            </div>
        </>
    )
}