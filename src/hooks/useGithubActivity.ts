import { useEffect, useMemo, useState } from "react";
import { profile } from "../data/site";

export type ContribDay = { date: string; count: number; level: number };
export type GhRepo = {
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  description: string | null;
};

export type GithubStats = {
  total: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: number;
  weeks: number[];
  days: ContribDay[];
};

export function useGithubActivity() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [name, setName] = useState(profile.alias);
  const [followers, setFollowers] = useState(0);
  const [repoCount, setRepoCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const handle = profile.handle;

    async function load() {
      try {
        const [userRes, reposRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${handle}`),
          fetch(`https://api.github.com/users/${handle}/repos?per_page=8&sort=updated`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${handle}?y=last`),
        ]);

        if (userRes.ok) {
          const user = await userRes.json();
          if (!cancelled) {
            if (user.avatar_url) setAvatar(user.avatar_url);
            if (user.name || user.login) setName(user.name || user.login);
            setFollowers(Number(user.followers || 0));
            setRepoCount(Number(user.public_repos || 0));
          }
        }

        if (reposRes.ok) {
          const list = (await reposRes.json()) as GhRepo[];
          if (!cancelled) {
            setRepos(list.filter((r) => !(r as { fork?: boolean }).fork).slice(0, 4));
          }
        }

        if (!contribRes.ok) throw new Error("contrib");
        const data = await contribRes.json();
        const days: ContribDay[] = Array.isArray(data.contributions)
          ? data.contributions.slice(-364)
          : [];
        if (!days.length) throw new Error("empty");

        const total = days.reduce((n, d) => n + Number(d.count || 0), 0);
        const activeDays = days.filter((d) => Number(d.count || 0) > 0).length;
        const bestDay = days.reduce(
          (b, d) => (Number(d.count || 0) > Number(b.count || 0) ? d : b),
          days[0],
        );

        let streak = 0;
        let longestStreak = 0;
        days.forEach((d) => {
          streak = Number(d.count || 0) > 0 ? streak + 1 : 0;
          longestStreak = Math.max(longestStreak, streak);
        });

        let currentStreak = 0;
        for (let i = days.length - 1; i >= 0; i--) {
          if (Number(days[i].count || 0) > 0) currentStreak += 1;
          else if (i === days.length - 1) continue;
          else break;
        }

        const weeks: number[] = [];
        for (let i = 0; i < days.length; i += 7) {
          weeks.push(days.slice(i, i + 7).reduce((n, d) => n + Number(d.count || 0), 0));
        }

        if (!cancelled) {
          setStats({
            total,
            activeDays,
            longestStreak,
            currentStreak,
            bestDay: Number(bestDay.count || 0),
            weeks: weeks.slice(-12),
            days,
          });
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    const run = () => void load();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 3000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(run, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  const weekPeak = useMemo(() => Math.max(1, ...(stats?.weeks ?? [1])), [stats]);

  return { stats, repos, avatar, name, followers, repoCount, error, weekPeak };
}
