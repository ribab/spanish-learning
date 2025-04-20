"use client";
import Link from "next/link";
import { SubmitButton } from "./submit-button";
import { signIn, signUp, signInWithGoogleOAuth } from "./actions";
import { createClient } from "../../utils/supabase/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogleOAuth();
    } catch (error) {
      console.error("Fehler beim Anmelden mit Google: ", error);
    }
  };

  const handleResetPassword = async () => {
    const supabase = createClient();
    const email = prompt("Für welche Email");
    if (!email) {
      console.error("No valid Email");
      return;
    }
    email.trim();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });
    if (data) alert("Recovery Link sent to " + email);
    if (error) alert("Error while sending password reset link to " + email);
  };
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>
      <div className="flex flex-col gap-9 ">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          action="/auth/sign-in"
          method="post"
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
            Sign In
          </button>
          <button
            formAction="/auth/sign-up"
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          >
            Sign Up
          </button>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>

        <button
          onClick={handleSignInWithGoogle}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In with Google
        </button>
        <button
          onClick={handleResetPassword}
          className="font-extralight text-left text-blue-400"
        >
          Forgot password
        </button>
      </div>
    </div>
  );
}
