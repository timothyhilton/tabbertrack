export default function NotificationBubble({ num }: { num: number }) {
    if(num == 0) return (<></>)

    return(
        <div className="absolute right-0 top-0 z-10 rounded-full bg-red-400 w-4 h-4">
            <div className="absolute top-[-4px] right-[4px]">
                {num}
            </div>
        </div>
    )
}