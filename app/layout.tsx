import '../styles/globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { NavBar } from './navbar'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'TabberTrack',
  description: 'The all in one solution for managing how much money you and your friends owe eachother.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
