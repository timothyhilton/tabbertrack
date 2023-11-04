export default function NotificationBubble({ num, className }: { num: number, className?: string }) {
    if(num == 0) return (<></>)

    return(
        <div className={`absolute z-10 rounded-full bg-red-400 w-4 h-4 text-white ${className}`}>
            {(num <= 9) ? 
                <div className="absolute top-[-4px] right-[4px]">
                    {num}
                </div> 
                : 
                <div className="absolute top-[-4px] right-[-2px]">
                    9+
                </div>
            }
        </div>
    )
}