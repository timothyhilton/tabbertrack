'use client'
import { Button } from '@/components/ui/button'
import { signIn, signOut } from 'next-auth/react'
import { DropdownMenuItem } from './ui/dropdown-menu'
import { redirect } from 'next/navigation'

export const LoginButton = () => {
    return <Button variant="link" className="" onClick={() => signIn()}>Login</Button>
}

export const LogoutDropdownMenuItem = () => {
    return(
        <DropdownMenuItem onClick={() => signOut()}>
            Log out
        </DropdownMenuItem>
    )
}