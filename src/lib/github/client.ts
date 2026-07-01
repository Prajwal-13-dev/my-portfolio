const GITHUB_API = "https://api.github.com";

export const GITHUB_REVALIDATE_TAG = "github-repos";

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Wraps GitHub REST calls with auth + Next.js data-cache revalidation.
 * Unauthenticated requests are capped at 60/hr per IP; a GITHUB_TOKEN
 * raises that to 5000/hr, which is what makes hourly ISR revalidation
 * of the whole repo list workable.
 */
export async function githubFetch(
  path: string,
  init?: { raw?: boolean },
): Promise<Response> {
  const headers = init?.raw
    ? { ...authHeaders(), Accept: "application/vnd.github.raw" }
    : authHeaders();

  return fetch(`${GITHUB_API}${path}`, {
    headers,
    next: { revalidate: 3600, tags: [GITHUB_REVALIDATE_TAG] },
  });
}
