import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    APPWRITE_API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_JIKAN_API_URL: z.string(),
    NEXT_PUBLIC_NEXT_URL: z.string(),
    NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string(),
    NEXT_PUBLIC_APPWRITE_PROJECT: z.string(),
    NEXT_PUBLIC_DATABASE_ID: z.string(),
    NEXT_PUBLIC_ANIMELIST_COLLECTION_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
    NEXT_PUBLIC_JIKAN_API_URL: process.env.NEXT_PUBLIC_JIKAN_API_URL,
    NEXT_PUBLIC_NEXT_URL: process.env.NEXT_PUBLIC_NEXT_URL,
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    NEXT_PUBLIC_DATABASE_ID: process.env.NEXT_PUBLIC_DATABASE_ID,
    NEXT_PUBLIC_ANIMELIST_COLLECTION_ID: process.env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
