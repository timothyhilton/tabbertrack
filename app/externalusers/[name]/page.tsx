import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NavBar } from "@/app/navbar"
import UnfriendButton from "@/components/friends/list/unfriend-button"
import ReceivedTransactionsTable from "@/components/transactions/received-transactions-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

interface paramProps{
    params: { name: string }
}

export default async function UserPage({ params }: paramProps){
    const name = params.name
    const session = await getServerSession(authOptions)
    if(!session){
        redirect('/api/auth/signin')
    }
    const userId = parseInt(session.user!.id)

    const externalFriend = await prisma.externalFriend.findFirst({
        where: {
            userId: userId,
            name: name
        }
    })
    if(!externalFriend){
        redirect('/404')
    }

    const transactionsForTable = await Promise.all((await prisma.externalTransaction.findMany({
        where: {
            userId: userId,
            externalFriendId: externalFriend.id
        }
    })).map(async transaction => {
        return {
            name: externalFriend.name,
            amount: transaction.amount,
            status: "accepted", 
            createdAt: transaction.createdAt,
            id: transaction.id,
            description: transaction.description,
            doesSenderOwe: !transaction.doesUserOwe,
        }
    }))

    const transactions = await prisma.externalTransaction.findMany({
        where: {
            userId: userId,
            externalFriendId: externalFriend.id
        }
    })
    
    let amountOwed = 0

    transactions.forEach(transaction => {
        if (!transaction.doesUserOwe) {
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
                                    {name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-2 mr-3">
                                <CardTitle>{name}</CardTitle>
                                <CardDescription>tell {name} to sign up for TabberTrack!</CardDescription>
                            </div>

                            {/*<UnfriendButton username={user.username}/>*/}
                        </CardContent>
                    </Card>
                    <Card className="ml-4 w-fit pt-6">
                        <CardContent className="">
                            <CardTitle className="w-full">
                                { (Math.sign(amountOwed) === 1) ?
                                    <span className="">{`${name} owes you $`}</span> 
                                    : 
                                    <span className="">{`You owe ${name} $`}</span>
                                }
                                {Math.abs(amountOwed)}
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
                <ReceivedTransactionsTable receivedTransactionRequests={transactionsForTable}/>
            </div>
        </>
    )
}