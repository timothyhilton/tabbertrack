interface UserLinkProps {
    name: string,
    username: string,
    className?: string,
    spanClassName?: string
}

export default function UserLink({ name, username, className, spanClassName }: UserLinkProps){
    return(
        <p className={className}> 
            {name} 
            <span className={`text-muted-foreground ${spanClassName}`}>
                {` / ${username}`}
            </span>
        </p>
    )
}