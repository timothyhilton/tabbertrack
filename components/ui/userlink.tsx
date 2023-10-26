import Link from "next/link"

interface UserLinkProps {
    name: string,
    username: string,
    className?: string,
    spanClassName?: string,
    link?: boolean
}

export default function UserLink({ name, username, className, spanClassName, link }: UserLinkProps){
    if(link){
        return(
            <Link className={`hover:underline ${className}`} href={`/users/${username}`}>
                {name}
                <span className={`text-muted-foreground ${spanClassName}`}>
                    {` / ${username}`}
                </span>
            </Link>
        )
    } else {
        return(
            <p className={className}>
                {name} 
                <span className={`text-muted-foreground ${spanClassName}`}>
                    {` / ${username}`}
                </span>
            </p>
        )
    }
}