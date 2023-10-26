interface paramProps{
    params: { error: string }
}

export default function ErrorPage({ params }: paramProps){
    return(
        <p className="flex justify-center align-middle">{params.error}</p>
    )
}