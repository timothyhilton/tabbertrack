'use client'

import { redirect } from "next/navigation"
import { Icons } from "../ui/icons"

export default function Logo(){
    return(
        <div className="pl-3 flex flex-row">
            <button onClick={() => redirect("/dashboard")} className="flex flex-row">
                <Icons.tabbertrack className="w-[2.5rem] h-[2.5rem] my-[-0.4rem]" />
                <p className="mt-[0.2rem] ml-1 font-semibold">
                    TabberTrack
                </p>
            </button>
        </div>
    )
}