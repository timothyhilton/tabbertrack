import FriendsReqTable from "@/components/friends/friends-req-table";
import { NavBar } from "../navbar";
import FriendsList from "@/components/friends/friends-list";

export default function Friends(){
    return(
        <>
            <NavBar />
            <div className="lg:px-[15vw] mt-[5rem]">
                <h1 className="mb-10 text-3xl flex font-semibold justify-center">
                    Friends
                </h1>
                <FriendsList />
                <h1 className="mb-4 mt-10 text-3xl flex font-semibold justify-center">
                    Friend requests
                </h1>
                <FriendsReqTable />
            </div>
        </>
    )
}