// Register form — creates a new account and redirects to login on success
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
import type { RegisterCredentials, User } from "@/types/auth";

const FIELDS: {
  id:           keyof RegisterCredentials;
  label:        string;
  type:         string;
  autoComplete: string;
}[] = [
  { id: "name",            label: "Name",             type: "text",     autoComplete: "name" },
  { id: "email",           label: "Email",            type: "email",    autoComplete: "email" },
  { id: "password",        label: "Password",         type: "password", autoComplete: "new-password" },
  { id: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" },
];

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterCredentials>({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate, isPending } = usePost<User, RegisterCredentials>("/auth/register", {
    onSuccess: () => router.push(ROUTES.LOGIN),
    onError:   (msg) => setApiError(msg),
  });

  function set(field: keyof RegisterCredentials) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (form.password !== form.confirmPassword) {
      setApiError("Passwords do not match");
      return;
    }
    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        {FIELDS.map(({ id, label, type, autoComplete }) => (
          <Field key={id}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
              id={id}
              type={type}
              autoComplete={autoComplete}
              value={form[id]}
              onChange={set(id)}
              required
            />
          </Field>
        ))}
        {apiError ? <FieldError>{apiError}</FieldError> : null}
      </FieldGroup>
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
