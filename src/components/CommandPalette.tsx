import { useEffect, useMemo, useState } from "react";
import { profile } from "../data/site";

type Action = { id: string; label: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const actions = useMemo<Action[]>(
    () => [
      { id: "ventures", label: "Jump to ventures", run: () => document.getElementById("ventures")?.scrollIntoView({ behavior: "smooth" }) },
      { id: "projects", label: "Jump to projects", run: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
      { id: "github", label: "Jump to GitHub activity", run: () => document.getElementById("github")?.scrollIntoView({ behavior: "smooth" }) },
      { id: "contact", label: "Jump to contact", run: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
      { id: "fenster", label: "Open terminal-fenster", run: () => window.open("https://zent7x.com/terminal-fenster/", "_blank", "noopener") },
      { id: "routing", label: "Open routing.run", run: () => window.open(profile.links.routing, "_blank", "noopener") },
      { id: "keelcode", label: "Open Keelcode", run: () => window.open(profile.links.keelcode, "_blank", "noopener") },
      { id: "gh", label: "Open GitHub profile", run: () => window.open(profile.links.github, "_blank", "noopener") },
      { id: "blog", label: "Open blog", run: () => window.open(profile.links.blog, "_blank", "noopener") },
      { id: "x", label: "Open X / Twitter", run: () => window.open(profile.links.x, "_blank", "noopener") },
      {
        id: "email",
        label: "Copy email address",
        run: () => void navigator.clipboard?.writeText(profile.email),
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? actions.filter((a) => `${a.label} ${a.id}`.toLowerCase().includes(s)) : actions;
  }, [actions, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => (i + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === "Enter" && filtered[idx]) {
        e.preventDefault();
        filtered[idx].run();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, idx, open]);

  useEffect(() => {
    setIdx(0);
  }, [q, open]);

  useEffect(() => {
    const btn = document.getElementById("hint-palette");
    if (!btn) return;
    const openPalette = () => setOpen(true);
    btn.addEventListener("click", openPalette);
    return () => btn.removeEventListener("click", openPalette);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (!open) return null;

  return (
    <div className="palette">
      <div className="palette-backdrop" onClick={() => setOpen(false)} />
      <div className="palette-dialog" role="dialog" aria-modal="true" aria-label="Quick jump">
        <p className="palette-label">anywhere on warm.run</p>
        <input
          className="palette-input"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Where to?"
          spellCheck={false}
          autoComplete="off"
        />
        <ul className="palette-list">
          {filtered.length === 0 ? (
            <li className="palette-empty">No matches</li>
          ) : (
            filtered.map((a, i) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={`palette-item${i === idx ? " is-active" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    a.run();
                    setOpen(false);
                  }}
                >
                  <span>{a.label}</span>
                  <span className="palette-key">{a.id}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p className="palette-foot">↑↓ navigate · ↵ open · esc close</p>
      </div>
    </div>
  );
}
