import { createAuthClient } from "better-auth/react"

// Build a robust base URL for the Better Auth client.
// - In the browser, use an absolute same-origin URL to avoid extension/proxy fetch issues.
// - On the server (SSR), use NEXT_PUBLIC_BASE_URL if provided; otherwise fallback to relative path.
const apiPath = "/api/auth";

function withApiPath(base?: string) {
  if (!base) return apiPath;
  // Normalize: remove trailing slash to prevent double slashes
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalized}${apiPath}`;
}

const resolvedBaseURL = typeof window !== "undefined"
  ? `${window.location.origin}${apiPath}`
  : (process.env.NEXT_PUBLIC_BASE_URL ? withApiPath(process.env.NEXT_PUBLIC_BASE_URL) : apiPath);

export const authClient = createAuthClient({
  baseURL: resolvedBaseURL,
})