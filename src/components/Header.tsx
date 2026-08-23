import { Moon, Sun } from "@phosphor-icons/react";
import { profile } from "../data/site";
import { useTheme } from "../hooks/useTheme";
import { fluid } from "../lib/cn";

export function Header() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-50 -translate-y-24 rounded-lg bg-fg px-3 py-2 text-sm font-semibold text-bg focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <header className="flex items-center justify-between">
        <a
          href="/"
          className={`${fluid} flex items-center gap-3 rounded-lg font-mono text-sm text-muted hover:text-fg`}
          aria-label="zentex home"
        >
          <img
            src={profile.avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          zentex ~/
        </a>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          className={`${fluid} grid size-10 place-items-center rounded-full bg-chip text-muted hover:text-fg active:scale-[0.98]`}
        >
          {theme === "light" ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
        </button>
      </header>
    </>
  );
}
