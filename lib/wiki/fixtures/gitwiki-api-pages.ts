// Sample wiki for gitwiki-api, written from the real backend source.
// Fenced code uses ~~~ so the Markdown can live inside template literals.

export interface FixturePage {
  slug:          string;
  title:         string;
  sourcePath:    string;
  updatedAt:     string;
  commitMessage: string;
  content:       string;
}

export interface FixtureSection {
  id:    string;
  title: string;
  pages: FixturePage[];
}

const overview: FixturePage = {
  slug:          "overview",
  title:         "Overview",
  sourcePath:    "README.md",
  updatedAt:     "2026-09-24T09:12:00Z",
  commitMessage: "docs: describe module layout",
  content: `GitWiki API authenticates people and turns a Git repository into a searchable wiki. It fetches a repository's files from GitHub, splits them into chunks, stores their embeddings, and answers questions using only that repository as context.

This wiki is generated from the \`gitwiki-api\` repository itself, so every page links back to the file it came from.

## What the service does

- **Accounts.** Email and password sign-up and sessions through Better Auth.
- **Indexing.** A background job reads up to 200 source files from the default branch and stores them as vector embeddings.
- **Answers.** A question is matched against the five closest chunks, and the model answers from those chunks alone.

## Stack

| Layer | Technology | Why it is here |
| --- | --- | --- |
| HTTP | Express 4 | Routing and middleware |
| Language | TypeScript | Types across modules |
| Database | PostgreSQL + Prisma | Users and sessions |
| Auth | Better Auth | Email/password and sessions |
| Jobs | Inngest | Durable, retryable indexing |
| Cache | ioredis | Hot reads and rate limiting |
| Vectors | Pinecone | Chunk embeddings per repository |

## Where to go next

Start with [Getting started](getting-started) to run the API locally, then read [Indexing pipeline](architecture/indexing-pipeline) to see how a repository becomes a wiki.`,
};

const gettingStarted: FixturePage = {
  slug:          "getting-started",
  title:         "Getting started",
  sourcePath:    "README.md",
  updatedAt:     "2026-09-24T09:12:00Z",
  commitMessage: "docs: describe module layout",
  content: `You need Bun 1.0 or newer, PostgreSQL, and Redis running locally.

## Install

~~~bash
git clone https://github.com/shani068/gitwiki-api
cd gitwiki-api
bun install
cp .env.example .env
~~~

## Configure the environment

Fill in \`.env\` before the first run. The server refuses to start when a required value is missing.

~~~bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/git_wiki
BETTER_AUTH_SECRET=        # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
INNGEST_DEV=1
~~~

> Generate \`BETTER_AUTH_SECRET\` once per environment. Rotating it signs every user out.

## Create the database

~~~bash
bunx prisma generate
bunx prisma migrate dev
~~~

## Run it

~~~bash
bun run dev
~~~

The API listens on port 3000. Interactive API docs are served at \`/docs\`, and the raw OpenAPI spec at \`/openapi.json\`.

### Scripts

| Command | What it does |
| --- | --- |
| \`bun run dev\` | Start with hot reload |
| \`bun run build\` | Compile TypeScript to \`dist/\` |
| \`bun start\` | Serve the compiled build |
| \`bun run lint\` | Check with ESLint |
| \`bun run check\` | Lint and format together |`,
};

const requestLifecycle: FixturePage = {
  slug:          "architecture/request-lifecycle",
  title:         "Request lifecycle",
  sourcePath:    "src/app.ts",
  updatedAt:     "2026-09-21T16:40:00Z",
  commitMessage: "feat: register user routes under /api/v1",
  content: `Every request passes through the same middleware stack before it reaches a module's handler.

## Middleware order

1. **Helmet** sets security headers.
2. **CORS** allows the web app's origin and credentials.
3. **Rate limiter** rejects bursts from a single client.
4. **Auth middleware** resolves the Better Auth session on protected routes.
5. The module **handler** runs, wrapped in \`asyncHandler\`.
6. The global **error middleware** turns thrown errors into JSON.

## Modules

Each feature lives in \`src/modules/<name>/\` with four files:

| File | Responsibility |
| --- | --- |
| \`*.routes.ts\` | Express router and validators |
| \`*.validator.ts\` | Zod schemas for body and params |
| \`*.handler.ts\` | Reads the request, calls the service |
| \`*.service.ts\` | Business logic and Prisma calls |

Routes are registered in one place:

~~~ts
export const registerRoutes = (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
};
~~~

## Errors

Handlers throw \`ApiError\` with a status code. The error middleware maps it, and known Prisma error codes, to a consistent response:

~~~ts
export class ApiResponse<T> {
  public success: boolean;

  constructor(
    public statusCode: number,
    public data: T,
    public message = "Success"
  ) {
    this.success = statusCode < 400;
  }
}
~~~`,
};

const indexingPipeline: FixturePage = {
  slug:          "architecture/indexing-pipeline",
  title:         "Indexing pipeline",
  sourcePath:    "src/inngest/functions/indexRepo.ts",
  updatedAt:     "2026-09-27T11:05:00Z",
  commitMessage: "feat: chunk repository files before saving to Pinecone",
  content: `Indexing runs as an Inngest function, so each step is retried on its own and a crash halfway through does not refetch the whole repository.

## Trigger

The function listens for the \`repo/index.requested\` event:

~~~ts
inngest.send({
  name: "repo/index.requested",
  data: { githubToken, owner, repo, repoKey },
});
~~~

## Steps

### 1. Fetch repository files

\`fetchRepo\` reads the default branch's tree recursively and downloads each blob. It skips what would add noise to answers:

- dependency and build folders such as \`node_modules\`, \`dist\`, and \`.next\`
- binary and media files, fonts, archives, and source maps
- lockfiles like \`package-lock.json\` and \`go.sum\`
- files over 2,000 lines

It stops after **200 files**, so very large repositories are indexed partially.

### 2. Chunk files

Each file is split with a recursive character splitter. Every chunk keeps the path it came from, which is how answers cite their sources.

| Setting | Value |
| --- | --- |
| Chunk size | 1,000 characters |
| Overlap | 150 characters |
| Metadata | \`path\`, \`repo\` |

### 3. Save to Pinecone

Chunks are embedded and written under the repository key \`owner/repo\`, so searches never mix repositories.

## Result

The function returns a summary that the job dashboard shows:

~~~json
{
  "repo": "shani068/gitwiki-api",
  "fileCount": 184,
  "chunkCount": 1312,
  "saved": 1312
}
~~~

## Failure modes

If GitHub returns 404 the job fails with \`GitHub could not find owner/repo\`. Private repositories need a token with read access.`,
};

const answeringQuestions: FixturePage = {
  slug:          "architecture/answering-questions",
  title:         "Answering questions",
  sourcePath:    "src/utils/rag.ts",
  updatedAt:     "2026-09-26T14:22:00Z",
  commitMessage: "feat: return deduplicated source paths with answers",
  content: `Questions are answered with retrieval-augmented generation: find the chunks closest to the question, then ask the model to answer from them only.

## Flow

1. Search the repository's vectors for the **top 5** chunks.
2. If nothing matches, return a message asking to index the repository first.
3. Build a context block where each chunk is prefixed with its file path.
4. Ask the model to answer using that context only.
5. Return the answer with the unique file paths that were used.

~~~ts
const context = docs
  .map((doc) => \`File: \${doc.metadata.path}\\n\${doc.pageContent}\`)
  .join("\\n\\n");
~~~

## Response shape

~~~json
{
  "answer": "Indexing skips files over 2,000 lines…",
  "sources": ["src/utils/github.ts", "src/utils/chunk.ts"]
}
~~~

## Limits

- Answers only cover files that were indexed, so the 200-file cap applies here too.
- The model sees five chunks, roughly 5,000 characters. Broad questions get narrow answers.`,
};

const apiEndpoints: FixturePage = {
  slug:          "reference/api-endpoints",
  title:         "API endpoints",
  sourcePath:    "src/routes/index.ts",
  updatedAt:     "2026-09-21T16:40:00Z",
  commitMessage: "feat: register user routes under /api/v1",
  content: `All application routes are versioned under \`/api/v1\`. Authentication routes are served by Better Auth under \`/api/auth\`.

## Public

| Method | Route | Description |
| --- | --- | --- |
| GET | \`/health\` | Health check |
| GET | \`/docs\` | Interactive API reference |
| GET | \`/openapi.json\` | OpenAPI spec |
| POST | \`/api/auth/sign-up/email\` | Create an account |
| POST | \`/api/auth/sign-in/email\` | Sign in |

## Authenticated

These need a valid session cookie.

| Method | Route | Description |
| --- | --- | --- |
| GET | \`/api/v1/users/me\` | Current user's profile |
| PUT | \`/api/v1/users/me\` | Update the profile |

## Update the profile

~~~bash
curl -X PUT http://localhost:3000/api/v1/users/me \\
  -H "Content-Type: application/json" \\
  --cookie "better-auth.session_token=…" \\
  -d '{ "name": "Ada Lovelace" }'
~~~`,
};

const configuration: FixturePage = {
  slug:          "reference/configuration",
  title:         "Configuration",
  sourcePath:    "src/config/env.config.ts",
  updatedAt:     "2026-09-19T08:30:00Z",
  commitMessage: "chore: validate environment with zod at boot",
  content: `Configuration is read from environment variables and validated with Zod when the server boots.

## Variables

| Name | Required | Default | Purpose |
| --- | --- | --- | --- |
| \`NODE_ENV\` | No | \`development\` | Logging and error detail |
| \`PORT\` | No | \`3000\` | HTTP port |
| \`DATABASE_URL\` | Yes | — | PostgreSQL connection string |
| \`BETTER_AUTH_SECRET\` | Yes | — | Signs session tokens |
| \`BETTER_AUTH_URL\` | Yes | — | Public base URL for auth callbacks |
| \`REDIS_URL\` | Yes | — | Cache and rate-limit store |
| \`INNGEST_DEV\` | No | — | Use the local Inngest dev server |
| \`GITHUB_TOKEN\` | No | — | Fallback token for indexing |

## Logging

Winston writes structured JSON. In production, logs rotate daily; in development they print in colour to the console.`,
};

export const GITWIKI_API_SECTIONS: FixtureSection[] = [
  { id: "introduction", title: "Introduction", pages: [overview, gettingStarted] },
  { id: "architecture", title: "Architecture", pages: [requestLifecycle, indexingPipeline, answeringQuestions] },
  { id: "reference",    title: "Reference",    pages: [apiEndpoints, configuration] },
];
