// Zod schema for the "Add repository" form — accepts owner/repo or a GitHub URL
import { z } from "zod";

const REPOSITORY = /^(?:https?:\/\/github\.com\/)?[\w.-]+\/[\w.-]+?(?:\.git)?\/?$/;

export const indexRepositorySchema = z.object({
  repo: z
    .string()
    .trim()
    .min(1, "Enter a repository")
    .regex(REPOSITORY, "Use owner/repo or a github.com URL"),
});

export type IndexRepositoryInput = z.infer<typeof indexRepositorySchema>;
