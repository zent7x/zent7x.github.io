export const profile = {
  name: "Adeeb",
  fullName: "Adeeb Bashir",
  alias: "zentex",
  handle: "zent7x",
  role: "Founder & engineer",
  location: "Kashmir, India",
  tagline: "I build AI infrastructure and break things for a living.",
  avatar: "/avatar.png",
  email: "hi@zent7x.dev",
  links: {
    github: "https://github.com/zent7x",
    x: "https://x.com/zent7x",
    email: "mailto:hi@zent7x.dev",
    keelcode: "https://keelcode.ai",
    routing: "https://routing.run",
  },
} as const;

export const companies = [
  {
    name: "Keelcode",
    url: "https://keelcode.ai",
    logo: "/logos/keelcode.png",
    year: "2026",
    status: "Building",
    blurb: "Loop engineering with guardrails, replay, and review-ready PRs.",
  },
  {
    name: "routing.run",
    url: "https://routing.run",
    logo: "/logos/routing.png",
    year: "2025",
    status: "Live",
    blurb: "OpenAI-compatible LLM router with zero prompt logging.",
  },
] as const;

export const projects = [
  {
    name: "grasp",
    url: "https://github.com/zent7x/grasp",
    desc: "Code context for AI agents",
  },
  {
    name: "codemap",
    url: "https://github.com/zent7x/codemap",
    desc: "Repository visualization",
  },
  {
    name: "cogrep",
    url: "https://github.com/zent7x/cogrep",
    desc: "Semantic code search",
  },
  {
    name: "tally",
    url: "https://github.com/zent7x/tally",
    desc: "Offline finance tracker",
  },
] as const;

export const stack = [
  "TypeScript",
  "Rust",
  "Python",
  "Bun",
  "React",
  "Docker",
  "PostgreSQL",
  "Redis",
  "Solidity",
] as const;

export const social = [
  { label: "GitHub", href: profile.links.github },
  { label: "X", href: profile.links.x },
  { label: "Email", href: profile.links.email },
] as const;
