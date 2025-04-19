import { authOptions } from "@/auth_options"
import prisma from "@/db"
import { getServerSession } from "next-auth"

export default async function OverallOwe() {
    const session = await getServerSession(authOptions)
    const userId = parseInt(session!.user!.id)

    const friends = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: userId
                }
            }
        }
    })
    const externalFriends = await prisma.externalFriend.findMany({
        where: {
            userId: userId
        }
    })

    const balances: { [key: string]: number } = {}

    friends.forEach(friend => balances[`user-${friend.id}`] = 0)
    externalFriends.forEach(friend => balances[`ext-${friend.id}`] = 0)
    
    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                {
                    userWhoIsOwedId: userId
                },
                {
                    userWhoOwesId: userId
                }
            ],
            status: "accepted"
        }
    })
    const externalTransactions = await prisma.externalTransaction.findMany({
        where: {
            userId: userId
        }
    })
    
    transactions.forEach(transaction => {
        if (transaction.userWhoIsOwedId == userId) {
            balances[`user-${transaction.userWhoOwesId}`] += transaction.amount
        } else {
            balances[`user-${transaction.userWhoIsOwedId}`] -= transaction.amount
        }
    })

    externalTransactions.forEach(transaction => {
        const externalFriendKey = `ext-${transaction.externalFriendId}`

        if (balances[externalFriendKey] === undefined) {
             console.warn(`External transaction references non-existent/non-fetched external friend ID: ${transaction.externalFriendId}`)
             balances[externalFriendKey] = 0
        }

        if (!transaction.doesUserOwe) {
            balances[externalFriendKey] += transaction.amount
        } else {
            balances[externalFriendKey] -= transaction.amount
        }
    })

    let moneyUserOwes = 0;
    let moneyUserIsOwed = 0;

    Object.values(balances).forEach(balance => {
        if (balance > 0) {
            moneyUserIsOwed += balance;
        } else if (balance < 0) {
            moneyUserOwes -= balance;
        }
    });

    return(
        <div className="lg:text-lg flex justify-center lg:space-x-44">
            <div>
                <h2 className="text-sm md:text-base font-bold md:font-normal flex justify-center text-center px-3">
                    You collectively owe everyone
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-8xl flex justify-center">
                    {`$${moneyUserOwes.toFixed(2)}`}
                </h1>
            </div>
            <div>
                <h2 className="text-sm md:text-base font-bold md:font-normal flex justify-center text-center px-3">
                    Everyone collectively owes you
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-8xl flex justify-center">
                    {`$${moneyUserIsOwed.toFixed(2)}`}
                </h1>
            </div>
        </div>
    )
}