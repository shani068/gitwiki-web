// Login form — calls the login endpoint and redirects to dashboard on success
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { usePost } from "@/hooks/useApi";
import { setSession } from "@/lib/auth";
import type { AuthSession, LoginCredentials } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginCredentials>({ email: "", password: "" });
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate, isPending } = usePost<AuthSession, LoginCredentials>("/auth/login", {
    onSuccess: (session) => {
      setSession(session);
      router.push(ROUTES.DASHBOARD);
    },
    onError: (msg) => setApiError(msg),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </Field>
        <Field data-invalid={apiError ? true : undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            aria-invalid={apiError ? true : undefined}
            required
          />
          {apiError ? <FieldError>{apiError}</FieldError> : null}
        </Field>
      </FieldGroup>
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Sign in
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href={ROUTES.REGISTER} className="font-medium text-foreground underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
