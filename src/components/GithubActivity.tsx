import { useMemo, useState } from "react";
import { profile } from "../data/site";
import { useGithubActivity } from "../hooks/useGithubActivity";
import { useReveal } from "../hooks/useReveal";
import { CountUp } from "./CountUp";

const dateFmt = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const monthFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});

function SparkArea({ weeks, peak }: { weeks: number[]; peak: number }) {
  const { path, fill } = useMemo(() => {
    const w = 240;
    const h = 72;
    const step = weeks.length > 1 ? w / (weeks.length - 1) : w;
    const pts = weeks.map((v, i) => {
      const x = i * step;
      const y = h - Math.max(4, (v / peak) * (h - 8));
      return [x, y] as const;
    });
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${line} L${w},${h} L0,${h} Z`;
    return { path: line, fill: area };
  }, [weeks, peak]);

  return (
    <svg className="gh-spark" viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ghSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(224,120,80,0.45)" />
          <stop offset="100%" stopColor="rgba(224,120,80,0)" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#ghSparkFill)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

export function GithubActivity() {
  const ref = useReveal<HTMLElement>();
  const { stats, repos, avatar, name, followers, repoCount, error, weekPeak } =
    useGithubActivity();
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);

  const months = useMemo(() => {
    if (!stats) return [] as Array<{ label: string; col: number }>;
    const out: Array<{ label: string; col: number }> = [];
    let prev = "";
    stats.days.forEach((day, index) => {
      const label = monthFmt.format(new Date(`${day.date}T00:00:00Z`));
      if (label === prev) return;
      prev = label;
      out.push({ label, col: Math.floor(index / 7) + 1 });
    });
    return out;
  }, [stats]);

  return (
    <section className="block github-block" id="github" ref={ref} data-reveal>
      <div className="section-head">
        <div>
          <p className="section-kicker">Shipping in public</p>
          <h2>GitHub activity</h2>
        </div>
        <span className="section-no">04 / 04</span>
      </div>

      <div className="gh-board">
        <aside className="gh-side">
          <div className="gh-side__profile">
            <img className="gh-side__avatar" src={avatar} alt="" width={72} height={72} />
            <div>
              <p className="github-status">Live activity</p>
              <p className="gh-side__name">{name}</p>
              <a className="gh-side__handle" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                @{profile.handle}
              </a>
            </div>
          </div>

          <dl className="gh-side__meta">
            <div>
              <dt>Followers</dt>
              <dd>
                <CountUp value={followers || null} />
              </dd>
            </div>
            <div>
              <dt>Public repos</dt>
              <dd>
                <CountUp value={repoCount || null} />
              </dd>
            </div>
          </dl>

          <div className="gh-side__chart">
            <div className="gh-side__chart-head">
              <span>12-week pulse</span>
              <span>peak {stats ? weekPeak.toLocaleString() : "—"}</span>
            </div>
            {stats ? <SparkArea weeks={stats.weeks} peak={weekPeak} /> : <div className="gh-spark-skel" />}
          </div>

          <a className="github-profile" href={profile.links.github} target="_blank" rel="noopener noreferrer">
            Open profile <span aria-hidden>↗</span>
          </a>
        </aside>

        <div className="gh-main">
          <ul className="gh-metrics gh-metrics--board" aria-label="Contribution summary">
            <li className="gh-metric">
              <strong>
                <CountUp value={stats?.total ?? null} />
              </strong>
              <span>Contributions</span>
            </li>
            <li className="gh-metric">
              <strong>
                <CountUp value={stats?.activeDays ?? null} />
              </strong>
              <span>Active days</span>
            </li>
            <li className="gh-metric">
              <strong>
                <CountUp value={stats?.longestStreak ?? null} suffix="d" />
              </strong>
              <span>Longest streak</span>
            </li>
            <li className="gh-metric">
              <strong>
                <CountUp value={stats?.currentStreak ?? null} suffix="d" />
              </strong>
              <span>Current streak</span>
            </li>
          </ul>

          <div className="contrib-zone contrib-zone--board">
            <div className="contrib-zone__head">
              <p className="contrib-meta">
                {error
                  ? "Contributions unavailable right now."
                  : stats
                    ? `Last 52 weeks · best day ${stats.bestDay.toLocaleString()}`
                    : "Loading the last 52 weeks…"}
              </p>
              <div className="contrib-legend" aria-label="Contribution intensity">
                <span>Less</span>
                <i /><i /><i /><i /><i />
                <span>More</span>
              </div>
            </div>

            <div className="contrib-wrap">
              <div
                className="contrib-months"
                style={{ gridTemplateColumns: `repeat(${Math.ceil((stats?.days.length || 364) / 7)}, 12px)` }}
              >
                {months.map((m) => (
                  <span key={`${m.label}-${m.col}`} style={{ gridColumnStart: m.col }}>
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="contrib-grid-shell">
                <div className="contrib-weekdays" aria-hidden>
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>
                <div
                  className="contrib-grid"
                  role="img"
                  aria-label={
                    stats
                      ? `${stats.total.toLocaleString()} contributions in the last year`
                      : "Contribution calendar"
                  }
                >
                  {(stats?.days ?? Array.from({ length: 364 }, () => null)).map((day, index) => {
                    if (!day) {
                      return <span key={index} className="contrib-skel" />;
                    }
                    const count = Number(day.count || 0);
                    const when = dateFmt.format(new Date(`${day.date}T00:00:00Z`));
                    const text =
                      count === 0 ? `No contributions · ${when}` : `${count.toLocaleString()} · ${when}`;
                    return (
                      <span
                        key={day.date}
                        className="contrib-day"
                        data-level={Math.max(0, Math.min(4, Number(day.level || 0)))}
                        style={{ ["--delay" as string]: `${Math.min(index, 80) * 4}ms` }}
                        onPointerEnter={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          setTip({ text, x: r.left + r.width / 2, y: r.top });
                        }}
                        onPointerLeave={() => setTip(null)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {repos.length > 0 && (
        <div className="gh-repos-rail">
          <p className="gh-repos__label">Recently updated</p>
          <ul className="gh-repos__rail">
            {repos.map((repo) => (
              <li key={repo.name}>
                <a className="gh-repo-chip" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <span className="gh-repo-chip__name">{repo.name}</span>
                  <span className="gh-repo-chip__meta">
                    {repo.language || "code"} · ★ {repo.stargazers_count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tip && (
        <div
          className="contrib-tip"
          style={{
            left: Math.min(window.innerWidth - 12, Math.max(12, tip.x)),
            top: Math.max(12, tip.y - 10),
            transform: "translate(-50%, -100%)",
          }}
        >
          {tip.text}
        </div>
      )}
    </section>
  );
}
