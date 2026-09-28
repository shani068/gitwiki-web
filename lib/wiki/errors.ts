// Distinguishes "this page/repo doesn't exist" from failures worth retrying
import axios from "axios";

export class WikiNotFoundError extends Error {
  constructor(what: string) {
    super(`${what} was not found`);
    this.name = "WikiNotFoundError";
  }
}

export function isNotFoundError(error: unknown): boolean {
  if (error instanceof WikiNotFoundError) return true;
  return axios.isAxiosError(error) && error.response?.status === 404;
}
