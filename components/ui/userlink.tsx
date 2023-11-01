import Link from "next/link"

interface UserLinkProps {
    name: string,
    username?: string,
    className?: string,
    spanClassName?: string,
    link?: boolean,
    external?: boolean
}

export default function UserLink({ name, username, className, spanClassName, link, external }: UserLinkProps){
    if(link){
        return(
            <Link className={`hover:underline ${className}`} href={(external == true || !username) ? `/externalusers/${name}` : `/users/${username}`}>
                {name}
                {(!external && username) &&
                    <span className={`text-muted-foreground ${spanClassName}`}>
                        {` / ${username}`}
                    </span>
                }
            </Link>
        )
    } else {
        return(
            <p className={className}>
                {name} 
                {!external &&
                    <span className={`text-muted-foreground ${spanClassName}`}>
                        {` / ${username}`}
                    </span>
                }
            </p>
        )
    }
}