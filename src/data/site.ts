export const profile = {
  name: "Adeeb",
  fullName: "Adeeb Bashir",
  alias: "zentex",
  handle: "zent7x",
  city: "Srinagar",
  coords: "34.0837° N · 74.7973° E",
  tagline: "I build AI infrastructure and break things for a living.",
  bio: "Founder of routing.run and Keelcode. Security researcher — worked with Publive to find critical bugs in their systems. I ship LLM routing, autonomous coding loops, and open-source tools from the mountains.",
  motto: "The less you know is the better.",
  email: "zentex@warm.run",
  avatar: "/avatar.png",
  links: {
    github: "https://github.com/zent7x",
    x: "https://x.com/zent7x",
    blog: "https://zent7x.com/blog",
    email: "mailto:zentex@warm.run",
    keelcode: "https://keelcode.ai",
    routing: "https://routing.run",
    publive: "https://thepublive.com",
  },
} as const;

export const nav = [
  { label: "GitHub", href: profile.links.github, icon: "/icons/github.png" },
  { label: "X", href: profile.links.x, icon: "/icons/x.png" },
  { label: "Blog", href: profile.links.blog, icon: "/icons/blog.png" },
  { label: "Email", href: profile.links.email, icon: "/icons/email.png" },
] as const;

export const ventures = [
  {
    name: "Keelcode",
    url: profile.links.keelcode,
    logo: "/logos/keelcode.svg",
    status: "2026 · Building",
    desc: "Loop engineering with guardrails, replay, and review-ready PRs.",
  },
  {
    name: "routing.run",
    url: profile.links.routing,
    logo: "/logos/routing.svg",
    status: "2025 · Live",
    desc: "OpenAI-compatible LLM router with zero prompt logging.",
  },
] as const;

export const projects = [
  {
    name: "terminal-fenster",
    url: "https://zent7x.com/terminal-fenster/",
    logo: "/logos/terminal-fenster.svg",
    desc: "Real Chromium pixels inside your terminal via Kitty graphics. The newest ship — a browser that paints frames into Ghostty.",
    featured: true,
  },
  {
    name: "grasp",
    url: "https://github.com/zent7x/grasp",
    logo: "/logos/grasp.svg",
    desc: "Code context for AI agents on repos too big for one context window.",
    featured: false,
  },
  {
    name: "codemap",
    url: "https://github.com/zent7x/codemap",
    logo: "/logos/codemap.svg",
    desc: "Turn any repository into a self contained explorable HTML map.",
    featured: false,
  },
  {
    name: "cogrep",
    url: "https://github.com/zent7x/cogrep",
    logo: "/logos/cogrep.svg",
    desc: "Local semantic code search and clone detection from your terminal.",
    featured: false,
  },
  {
    name: "tally",
    url: "https://github.com/zent7x/tally",
    logo: "/logos/tally.svg",
    desc: "Offline finance tracker. No account, no cloud. One HTML file.",
    featured: false,
  },
] as const;

export const stack = [
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "Rust", icon: "/tech/rust.svg", invert: true },
  { name: "Go", icon: "/tech/go.svg" },
  { name: "Python", icon: "/tech/python.svg" },
  { name: "Bun", icon: "/tech/bun.svg" },
  { name: "React", icon: "/tech/react.svg" },
  { name: "PostgreSQL", icon: "/tech/postgresql.svg" },
  { name: "Redis", icon: "/tech/redis.svg" },
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "Kubernetes", icon: "/tech/kubernetes.svg" },
  { name: "Cloudflare", icon: "/tech/cloudflare.svg" },
  { name: "AWS", icon: "/tech/aws.svg", invert: true },
  { name: "Linux", icon: "/tech/linux.svg", invert: true },
  { name: "Git", icon: "/tech/git.svg" },
] as const;

export const pills = [
  { name: "routing.run", href: profile.links.routing, logo: "/logos/routing.svg", className: "routing" },
  { name: "Keelcode", href: profile.links.keelcode, logo: "/logos/keelcode.svg", className: "keelcode" },
  { name: "Publive", href: profile.links.publive, logo: "/logos/publive.svg", className: "publive" },
] as const;
