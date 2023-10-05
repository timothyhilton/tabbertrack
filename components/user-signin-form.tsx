"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Link } from "lucide-react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isCredentialLoading, setIsCredentialLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { data: session } = useSession()
  React.useEffect(() => { // todo: make this not just check constantly
    if(session){
      redirect("/")
    }
  })

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsCredentialLoading(true)

    signIn("credentials", {
      email: email,
      password: password
    })

    setTimeout(() => {
      setIsCredentialLoading(false)
    }, 3000)
  }

  async function onGoogleSubmit(event: React.SyntheticEvent){
    event.preventDefault()
    setIsGoogleLoading(true)

    signIn("google")

    setTimeout(() => {
      setIsGoogleLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isCredentialLoading || isGoogleLoading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              disabled={isCredentialLoading || isGoogleLoading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isCredentialLoading || isGoogleLoading}>
            {isCredentialLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in with email
          </Button>
          <div className="flex flex-row mt-[-0.3rem] mb-[-10rem] text-sm text-muted-foreground"><a href="/register" className="underline">register here</a></div>
        </div>
      </form>
      <div className="relative mt-[-0.38rem]">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button onClick={onGoogleSubmit} variant="outline" type="button" disabled={isCredentialLoading || isGoogleLoading}>
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}