import { Metadata } from "next"

import LoginForm from "@modules/account/components/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default function Login() {
  return (
    <section className="py-15 xl:py-20">
      <div className="max-w-[500px] mx-auto px-4">
        <div className="bg-white border border-gray-3 rounded-md p-8">
          <h1 className="text-heading-4 font-medium text-dark text-center mb-2">
            Sign In
          </h1>
          <p className="text-body text-custom-sm text-center mb-8">
            Sign in to your account
          </p>

          <LoginForm />

          <p className="text-center text-custom-sm text-body mt-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}