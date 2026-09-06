import { ArrowUpRight, MapPin } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { copy, now, oss, posts, profile, security } from "../data/site";
import { cn, fluid } from "../lib/cn";
import { href as withBase } from "../lib/url";
import { Reveal } from "./Reveal";

function Badge({
  href,
  logo,
  icon,
  label,
}: {
  href?: string;
  logo?: string;
  icon?: ReactNode;
  label: string;
}) {
  const cls = `${fluid} inline-flex items-center gap-1 rounded-md bg-chip px-2 py-0.5 align-baseline font-medium text-fg hover:bg-line`;
  const inner = (
    <>
      {logo ? (
        <span className="grid size-5 place-items-center rounded-sm bg-white">
          <img src={withBase(logo)} alt="" width={14} height={14} className="size-3.5 object-contain" />
        </span>
      ) : (
        icon
      )}
      {label}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <h2 className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-faint">{n}</span>
      <span className="text-xl font-semibold">{label}</span>
    </h2>
  );
}

function StateTag({ state, tone }: { state: string; tone: "live" | "building" }) {
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-wide",
        tone === "live" ? "text-[#3FBE6E] dark:text-[#4FE884]" : "text-[#B08A00] dark:text-[#FACC15]",
      )}
    >
      {state}
    </span>
  );
}

function Row({
  name,
  url,
  logo,
  desc,
  role,
  state,
  tone,
  mark = "line",
}: {
  name: string;
  url: string;
  logo: string;
  desc: string;
  role?: string;
  state?: string;
  tone?: "live" | "building";
  mark?: "line" | "full";
}) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${fluid} group -mx-3 flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-chip active:scale-[0.98]`}
      >
        {mark === "full" ? (
          <img src={withBase(logo)} alt="" width={40} height={40} className="size-10 shrink-0 rounded-md shadow-[0_0_0_1px_var(--line)]" />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-white shadow-[0_0_0_1px_var(--line)]">
            <img src={withBase(logo)} alt="" width={28} height={28} className="size-7 object-contain" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-semibold">{name}</span>
            {role && <span className="text-sm text-muted">{role}</span>}
            {state && tone && <StateTag state={state} tone={tone} />}
          </span>
          <span className="mt-1 block text-muted text-pretty">{desc}</span>
        </span>
        <ArrowUpRight className={`${fluid} size-4 shrink-0 text-faint group-hover:text-fg`} aria-hidden />
      </a>
    </li>
  );
}

export function Home() {
  const routing = now.find((n) => n.name === "routing.run");
  const warm = now.find((n) => n.name === "warm.run");
  return (
    <main id="main">
      <Reveal className="mt-16" immediate>
        <h1
          className="bg-clip-text text-2xl font-semibold tracking-tight text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, var(--fg), var(--grad-to))" }}
        >
          hey, i’m adeeb, also zentex.
        </h1>
        <p className="mt-4 max-w-[680px] text-lg leading-8 text-muted text-pretty">
          founder and security researcher in{" "}
          <Badge icon={<MapPin className="size-4" aria-hidden />} label="kashmir" />, building{" "}
          <Badge href={warm?.url} logo={warm?.logo} label="warm.run" /> and{" "}
          <Badge href={routing?.url} logo={routing?.logo} label="routing.run" />. i work on llm routing, agent loops, and local developer tools, and i take authorized security engagements, like the work with{" "}
          <Badge href={security.url} logo={security.logo} label="publive" /> that surfaced critical bugs.
        </p>
        <p className="mt-4 max-w-[680px] text-lg leading-8 text-muted text-pretty">
          the parts i enjoy most are the places where systems leak, loops nobody can replay, and tools that still work with the wifi off. most days are rust, typescript, and a terminal.
        </p>
        <figure className="mt-12 rounded-2xl bg-chip p-2">
          <img
            src={withBase("/media/kashmir.jpg")}
            alt="Krishansar Lake near Sonamarg, Kashmir: a deep blue alpine lake below grey peaks with patches of snow, green meadows in the foreground"
            width={1600}
            height={1066}
            className="aspect-[3/2] w-full rounded-lg object-cover"
            fetchPriority="high"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-2 px-2 py-3 font-mono text-xs text-faint">
            <span>Krishansar Lake, Sonamarg · {profile.region}</span>
            <a
              className="hover:text-fg"
              href="https://commons.wikimedia.org/wiki/File:Krishansar_Lake,_Sonmarg,_Kashmir_valley,_India_01.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              photo: Rohit Sharma, CC BY-SA 4.0
            </a>
          </figcaption>
        </figure>
      </Reveal>

      <Reveal className="mt-24">
        <Kicker n="01" label="Experience" />
        <ul className="mt-4">
          {now.map((item) => (
            <Row key={item.name} {...item} />
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-24">
        <Kicker n="02" label="Open source" />
        <ul className="mt-4">
          {oss.map((item) => (
            <Row key={item.name} {...item} />
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-24">
        <Kicker n="03" label="Writing" />
        <ul className="mt-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <a
                href={withBase(`/blog/${post.slug}`)}
                className={`${fluid} group -mx-3 flex items-baseline gap-4 rounded-lg px-3 py-3 hover:bg-chip active:scale-[0.98]`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-balance">{post.title}</span>
                  <span className="mt-1 block text-muted text-pretty">{post.summary}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-faint">{post.date}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <a
            className={`${fluid} rounded-sm text-sm text-muted underline decoration-line underline-offset-4 hover:text-fg hover:decoration-fg`}
            href={withBase("/blog")}
          >
            All writing
          </a>
        </p>
      </Reveal>

      <Reveal className="mt-24">
        <Kicker n="04" label="Security" />
        <ul className="mt-4">
          <Row {...security} />
        </ul>
      </Reveal>

      <Reveal className="mt-24" id="contact">
        <Kicker n="05" label="Contact" />
        <p className="mt-4 max-w-[680px] text-muted text-pretty">{copy.risk}</p>
        <a
          href={profile.links.email}
          className={`${fluid} mt-6 inline-flex items-center gap-2 rounded-lg bg-fg px-3 py-2 text-base font-semibold text-bg hover:opacity-80 active:scale-[0.98]`}
        >
          {copy.cta}
        </a>
        <p className="mt-6 flex flex-wrap gap-4 text-muted">
          <a className={`${fluid} rounded-sm underline decoration-line underline-offset-4 hover:text-fg hover:decoration-fg`} href={profile.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className={`${fluid} rounded-sm underline decoration-line underline-offset-4 hover:text-fg hover:decoration-fg`} href={profile.links.x} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a className={`${fluid} rounded-sm underline decoration-line underline-offset-4 hover:text-fg hover:decoration-fg`} href={profile.links.email}>
            Email
          </a>
        </p>
      </Reveal>
    </main>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 pb-16 text-sm text-muted">
      <nav className="flex flex-wrap gap-4" aria-label="Footer">
        <a className="hover:text-fg" href={withBase("/blog")}>
          Writing
        </a>
        <a className="hover:text-fg" href={withBase("/privacy")}>
          Privacy
        </a>
        <a className="hover:text-fg" href={withBase("/terms")}>
          Terms
        </a>
      </nav>
    </footer>
  );
}
