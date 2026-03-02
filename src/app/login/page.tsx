"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-glass rounded-2xl border border-border p-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-foreground text-center">
        Go-To Recipes
      </h1>
      <p className="mt-2 text-sm text-foreground-muted text-center">
        Enter the password to make changes
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-foreground-muted/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />

        {error && (
          <p className="text-sm text-accent-wine-light">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-lg bg-accent-amber px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-amber-light disabled:opacity-50"
        >
          {loading ? "..." : "Enter Kitchen"}
        </button>
      </form>

      <a
        href="/"
        className="mt-4 block text-center text-sm text-foreground-muted hover:text-accent-amber"
      >
        &larr; Back to browsing
      </a>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
