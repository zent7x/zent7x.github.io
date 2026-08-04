export const profile = {
  name: "Adeeb",
  fullName: "Adeeb Bashir",
  alias: "zentex",
  handle: "zent7x",
  role: "Founder & engineer",
  location: "Kashmir, India",
  city: "Srinagar",
  coords: "34.0837° N · 74.7973° E",
  est: "2024",
  tagline: "I build AI infrastructure and break things for a living.",
  motto: "The less you know is the better.",
  avatar: "/avatar.png",
  email: "zentex@warm.run",
  links: {
    github: "https://github.com/zent7x",
    x: "https://x.com/zent7x",
    satviks: "https://x.com/satviks",
    email: "mailto:zentex@warm.run",
    keelcode: "https://keelcode.ai",
    routing: "https://routing.run",
  },
} as const;

export const work = [
  {
    id: "001",
    name: "routing.run",
    url: "https://routing.run",
    desc: "OpenAI-compatible LLM router · fallback chains · zero prompt logging.",
    status: "Live",
    live: true,
  },
  {
    id: "002",
    name: "Keelcode",
    url: "https://keelcode.ai",
    desc: "Loop engineering with guardrails, replay, and review-ready PRs.",
    status: "Building",
    live: false,
  },
  {
    id: "003",
    name: "grasp",
    url: "https://github.com/zent7x/grasp",
    desc: "Code context for AI agents — index once, serve the right slice.",
    status: "Open source",
    live: false,
  },
  {
    id: "004",
    name: "codemap",
    url: "https://github.com/zent7x/codemap",
    desc: "Turn any repository into a self-contained explorable map.",
    status: "Open source",
    live: false,
  },
  {
    id: "005",
    name: "cogrep",
    url: "https://github.com/zent7x/cogrep",
    desc: "Local-first semantic code search from your terminal.",
    status: "Open source",
    live: false,
  },
  {
    id: "006",
    name: "tally",
    url: "https://github.com/zent7x/tally",
    desc: "Offline finance tracker — one HTML file, no cloud.",
    status: "Open source",
    live: false,
  },
] as const;

export const stack = [
  "TypeScript",
  "Rust",
  "Python",
  "Bun",
  "React",
  "Solidity",
  "Docker",
  "PostgreSQL",
  "Redis",
  "Foundry",
  "Cloudflare Workers",
] as const;

export const focus = [
  "LLM routing & inference infra",
  "Autonomous coding loops",
  "Bug bounty & offensive tooling",
  "Smart contract audits",
] as const;

export const social = [
  { label: "GitHub", line: "@zent7x", href: profile.links.github },
  { label: "X", line: "@zent7x", href: profile.links.x },
  { label: "satviks", line: "@satviks", href: profile.links.satviks },
  { label: "Email", line: profile.email, href: profile.links.email },
  { label: "Product", line: "routing.run", href: profile.links.routing },
] as const;
