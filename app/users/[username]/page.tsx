import { authOptions } from "@/auth_options"
import { NavBar } from "@/app/navbar"
import UnfriendButton from "@/components/friends/list/unfriend-button"
import ReceivedTransactionsTable from "@/components/transactions/received-transactions-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import TransactionsTable from "@/components/transactions/transactions-table"

interface paramProps{
    params: { username: string }
}

export default async function UserPage({ params }: paramProps){
    const username = params.username
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    const userId = parseInt(session.user!.id)

    const user = await prisma.user.findFirst({
        where: {
            username: username,
            friend: {
                some: {
                    id: userId
                }
            }
        }
    })
    if(!user){
        redirect('/404')
    }

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

    const transactionsForTable = transactions.map(transaction => ({
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
    
    let amountOwed = 0

    transactions.forEach(transaction => {
        if (transaction.userWhoIsOwedId == userId) {
            amountOwed += transaction.amount
        } else {
            amountOwed -= transaction.amount
        }
    })

    return(
        <>
            <NavBar />
            <div className="lg:px-[15vw] flex flex-col mt-[5rem]">
                <div className="flex flex-row">
                    <Card className="w-fit pt-6">
                        <CardContent className="flex flex-row align-middle justify-center">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadsdfdcn.png" />
                                <AvatarFallback>
                                    {username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-2 mr-3">
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.username}</CardDescription>
                            </div>

                            <UnfriendButton username={user.username}/>
                        </CardContent>
                    </Card>
                    <Card className="ml-4 w-fit pt-6">
                        <CardContent className="">
                            <CardTitle className="w-full">
                                { (Math.sign(amountOwed) === 1) ?
                                    <span className="">{`${user.name} owes you $`}</span> 
                                    : 
                                    <span className="">{`You owe ${user.name} $`}</span>
                                }
                                {Math.abs(amountOwed).toFixed(2)}
                            </CardTitle>
                            <CardDescription>
                                { (Math.sign(amountOwed) === 1) ?
                                    "Go nag 'em to pay you!"
                                    : 
                                    "Go pay 'em then send a transaction here to let them know"
                                }
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
                <h1 className="mb-1 mt-8 text-xl flex font-semibold">
                    Transactions
                </h1>
                <TransactionsTable transactions={transactionsForTable}/>
            </div>
        </>
    )
}