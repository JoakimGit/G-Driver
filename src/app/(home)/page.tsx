import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
        GDriver
      </h1>
      <p className="mx-auto mb-8 max-w-md text-xl text-neutral-400 md:text-2xl">
        Secure, fast, and easy file storage for the modern web
      </p>
      <SignedOut>
        <SignInButton forceRedirectUrl={"/drive"}>
          <Button
            size="lg"
            className="border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
          >
            Sign Up
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <Button
          size="lg"
          asChild
          className="border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
        >
          <Link href="/drive">Go To Dashboard</Link>
        </Button>
      </SignedIn>
    </>
  );
}
