'use client'
import { Button } from '@/components/ui/button'
import { signIn, signOut } from 'next-auth/react'
import { DropdownMenuItem } from './ui/dropdown-menu'

export const LoginButton = () => {
    return <Button onClick={() => signIn()}>Sign in</Button>
}

export const LogoutDropdownMenuItem = () => {
    return(
        <DropdownMenuItem onClick={() => signOut()}>
            Log out
        </DropdownMenuItem>
    )
}