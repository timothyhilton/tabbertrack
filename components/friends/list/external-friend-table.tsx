import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserLink from "@/components/ui/userlink"
import UnFriendButton from "./unfriend-button-external"

interface ExternalFriendTableProps{
    friends: {
        name: string
    }[]
}

export default function ExternalFriendTable({ friends }: ExternalFriendTableProps){
    return(
        <div>
            <div className="border rounded-md w-full h-fit">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs md:text-sm">User</TableHead>
                            <TableHead className="text-xs md:text-sm"></TableHead>
                            <TableHead className="text-xs md:text-sm"></TableHead> {/* no idea why, but without this empty one the styling gets all messed up */}
                            <TableHead className="text-right text-xs md:text-sm">Unfriend</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {friends.map(friend => {
                            return (
                                <TableRow key={friend.name}>
                                    <TableCell className="flex flex-col md:flex-row text-xs md:text-sm">
                                        {friend.name}
                                    </TableCell>

                                    <TableCell></TableCell> {/* see comment on line 21 */}

                                    <TableCell></TableCell>

                                    <TableCell className="flex flex-row justify-end space-x-4">
                                        <UnFriendButton name={friend.name} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}