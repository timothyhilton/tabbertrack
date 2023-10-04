'use client'

import { SessionProvider } from 'next-auth/react'
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const Providers = ({ children }: { children?: React.ReactNode }) => {
    return <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SessionProvider>{children}</SessionProvider>
            </ThemeProvider>
}