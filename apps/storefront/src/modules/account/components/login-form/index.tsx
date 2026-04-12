"use client"

import { useFormStatus } from "react-dom"
import { login } from "@lib/data/customer"
import { useActionState } from "react"
import { useRouter } from "next/navigation"

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full btn btn-primary"
    >
      {pending ? "Signing in..." : children}
    </button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-custom-sm font-medium text-dark mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-gray-3 rounded px-4 py-3 text-custom-sm focus:outline-none focus:border-blue"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className="block text-custom-sm font-medium text-dark mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full border border-gray-3 rounded px-4 py-3 text-custom-sm focus:outline-none focus:border-blue"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="remember-me" className="w-4 h-4" />
          <span className="text-custom-sm text-body">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-custom-sm text-blue hover:underline">
          Forgot password?
        </a>
      </div>

      {state && typeof state === "string" && (
        <p className="text-red text-custom-sm">{state}</p>
      )}

      <SubmitButton>Sign In</SubmitButton>
    </form>
  )
}