// "Add repository" dialog — validates owner/repo or a GitHub URL, then requests an index
"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useIndexRepository } from "@/hooks/useWiki";
import { indexRepositorySchema } from "@/lib/validations/wiki.schema";

export function AddRepositoryDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useIndexRepository({
    onSuccess: () => {
      setIsOpen(false);
      setValue("");
    },
    onError: setError,
  });

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) setError(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = indexRepositorySchema.safeParse({ repo: value });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check the repository name");
      return;
    }
    setError(null);
    mutate(result.data.repo);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Add repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Add a repository</DialogTitle>
            <DialogDescription>
              GitWiki reads the default branch and writes a wiki from its files. You can keep
              reading while it works.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="repository">Repository</FieldLabel>
              <Input
                id="repository"
                name="repository"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="owner/repo"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                className="font-mono"
                autoFocus
              />
              {error ? (
                <FieldError>{error}</FieldError>
              ) : (
                <FieldDescription>For example shani068/gitwiki-api or its GitHub URL.</FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              {isPending ? "Adding…" : "Add and index"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
