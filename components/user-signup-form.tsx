"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
 
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isCredentialLoading, setIsCredentialLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const { register, handleSubmit } = useForm()
  const [error, setError] = React.useState("")
  const [errorColour, setErrorColour] = React.useState("")
 
  const { data: session } = useSession()
  React.useEffect(() => { // todo: make this not just check constantly
    if(session){
      redirect("/")
    }
  })

  async function onSubmit(formData: FormData) { //todo: fix this "any"
    setIsCredentialLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData)
    })

    try{
      setError((await res.json()).error)
    } catch {
      setErrorColour("bg-green-500")
      setError("Please check your email to verify your account")
    }
    
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
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <div className="grid gap-2">
          {error &&
            <Alert className={`bg-red-500 ${errorColour}`}>
              <AlertTitle>Hey!</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          }
          <div className="grid gap-1">
            <Label htmlFor="email">
              name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              type="name"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isCredentialLoading || isGoogleLoading}
              {...register('name')}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">
              username
            </Label>
            <Input
              id="username"
              placeholder="Username"
              type="username"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              maxLength={20}
              disabled={isCredentialLoading || isGoogleLoading}
              {...register('username')}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">
              email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isCredentialLoading || isGoogleLoading}
              {...register('email')}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">
              password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              disabled={isCredentialLoading || isGoogleLoading}
              {...register('password')}
            />
          </div>
          <Button disabled={isCredentialLoading || isGoogleLoading}>
            {isCredentialLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register with email
          </Button>
          <div className="flex flex-row mt-[-0.3rem] mb-[-10rem] text-sm text-muted-foreground"><a href="/login" className="underline">login here</a></div>
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