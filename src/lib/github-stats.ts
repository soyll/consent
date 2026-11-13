export type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type RepoStat = {
  name: string;
  count: number;
  href: string;
  avatarUrl?: string;
};

export type GitHubStats = {
  contributions: Contribution[];
  repos: RepoStat[];
};

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const login = username.trim();
  if (!login) {
    return { contributions: [], repos: [] };
  }

  const [contributions, repos] = await Promise.all([
    fetchContributions(login),
    fetchTopRepos(login),
  ]);

  return { contributions, repos };
}

async function fetchContributions(username: string): Promise<Contribution[]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { contributions?: Contribution[] };
    return Array.isArray(json.contributions) ? json.contributions : [];
  } catch {
    return [];
  }
}

async function fetchTopRepos(username: string): Promise<RepoStat[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    if (!res.ok) return [];

    const reposJson = (await res.json()) as Array<{
      name: string;
      stargazers_count: number;
      html_url: string;
      owner?: { avatar_url?: string };
      fork: boolean;
      archived: boolean;
    }>;

    return reposJson
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map((r) => ({
        name: r.name,
        count: r.stargazers_count,
        href: r.html_url,
        avatarUrl: r.owner?.avatar_url,
      }));
  } catch {
    return [];
  }
}
