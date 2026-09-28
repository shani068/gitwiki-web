// Profile settings form — lets the user update their name and email
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { usePatch } from "@/hooks/useApi";

interface SettingsPayload {
  name:  string;
  email: string;
}

export function SettingsForm() {
  const [form, setForm] = useState<SettingsPayload>({ name: "Jane Doe", email: "jane@example.com" });
  const [isSaved, setIsSaved] = useState(false);

  const { mutate, isPending } = usePatch<SettingsPayload, SettingsPayload>("/users/me", {
    onSuccess: () => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-lg border bg-card p-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="settings-name">Display name</FieldLabel>
          <Input
            id="settings-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-email">Email address</FieldLabel>
          <Input
            id="settings-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </Field>
      </FieldGroup>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Save changes
        </Button>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {isSaved ? "Changes saved." : ""}
        </p>
      </div>
    </form>
  );
}
