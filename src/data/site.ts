export const profile = {
  name: "Adeeb",
  fullName: "Adeeb",
  alias: "zentex",
  handle: "zent7x",
  city: "Kashmir",
  region: "Kashmir",
  coords: "34.0837 N",
  email: "zentex@warm.run",
  og: "/media/og.jpg",
  links: {
    github: "https://github.com/zent7x",
    x: "https://x.com/zent7x",
    email: "mailto:zentex@warm.run?subject=Hard%20problem",
    warm: "https://warm.run",
    routing: "https://routing.run",
    publive: "https://thepublive.com",
  },
} as const;

export const copy = {
  headline: ["AI systems that stay", "under your control"],
  subhead:
    "routing.run routes your LLM traffic and remembers nothing, so prompts never end up in vendor logs. warm.run turns agent runs into loops you can replay, review, and undo.",
  proof: "routing.run is live. warm.run is in build. The Publive engagement surfaced critical bugs, under a written scope.",
  cta: "Email me the hard problem",
  risk: "One email. A written yes or no. No deck, no call until I reply.",
  tagline: ["I ship the loop.", "You keep the keys."],
} as const;

export const benefits = [
  {
    title: "Your prompts stay yours",
    body: "routing.run is an OpenAI compatible LLM router with zero prompt logging. The model is a commodity. The context is not.",
  },
  {
    title: "Loops you can actually replay",
    body: "warm.run is loop engineering with guardrails, replay, and review ready PRs. You can see what the agent did, and you can undo it.",
  },
  {
    title: "I break things on purpose",
    body: "Authorized security research only. I worked with Publive to find critical bugs in their systems. If you want a stranger poking prod for fun, that is not me.",
  },
  {
    title: "Tools that do not phone home",
    body: "tally, cogrep, and grasp run on your machine. No account. No cloud required. The newest ship is a terminal browser that paints Chromium into Ghostty.",
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Send the ugly problem",
    body: "Email what is stuck. A repo, a threat model, a routing mess. Ugly is useful. Polished pitches waste both of us.",
  },
  {
    n: "02",
    title: "I answer in writing",
    body: "You get a scope, a no, or a few sharp questions. No intro call required. If I cannot help, I say so.",
  },
  {
    n: "03",
    title: "We ship or we stop",
    body: "If it is a yes, I work in the open on GitHub when I can. If it is a no, you still leave with the writeup.",
  },
] as const;

export const faqs = [
  {
    q: "What do you actually take on?",
    a: "LLM routing, agent loops, local developer tools, and authorized security work. If the job is a slide deck or a growth hack, I will pass.",
  },
  {
    q: "Are you a freelancer or a founder?",
    a: "Both. I am building warm.run and routing.run. Consulting is for problems that are sharp enough to be worth the context switch.",
  },
  {
    q: "Do you log prompts on routing.run?",
    a: "No. Zero prompt logging is the product. If a vendor needs your prompts to improve the model, that is their business, not yours.",
  },
  {
    q: "Where are you based?",
    a: "Kashmir. I ship from the mountains. Timezone is IST. Async email is the default.",
  },
  {
    q: "How should I email you?",
    a: "Use the form below or write zentex@warm.run. Put the problem in the first paragraph. Links beat PDFs.",
  },
  {
    q: "Do you only do authorized security work?",
    a: "Yes. Scope in writing. I do not hunt friends, family, or random production boxes. If you need that energy, look elsewhere.",
  },
  {
    q: "Can you work inside an existing repo?",
    a: "Yes. That is the usual case. I read the codebase, I do not replace it with a rewrite unless the rewrite is the actual job.",
  },
  {
    q: "What does this cost?",
    a: "It depends on the blast radius. I quote in writing after I understand the problem. If the quote is wrong for you, we stop there. No retainers hiding in the weeds.",
  },
] as const;

export const ventures = [
  {
    name: "warm.run",
    url: profile.links.warm,
    logo: "/logos/warm.svg",
    mark: "full",
    status: "2026 · Building",
    desc: "Loop engineering with guardrails, replay, and review ready PRs. Formerly Keelcode.",
  },
  {
    name: "routing.run",
    url: profile.links.routing,
    logo: "/logos/routing.png",
    mark: "line",
    status: "2025 · Live",
    desc: "OpenAI compatible LLM router with zero prompt logging.",
  },
] as const;

export const projects = [
  {
    name: "terminal-fenster",
    url: "https://zent7x.com/terminal-fenster/",
    logo: "/logos/terminal-fenster.svg",
    mark: "full",
    desc: "Real Chromium pixels inside your terminal via Kitty graphics. A browser that paints frames into Ghostty.",
    featured: true,
  },
  {
    name: "grasp",
    url: "https://github.com/zent7x/grasp",
    logo: "/logos/grasp.svg",
    mark: "full",
    desc: "Code context for AI agents on repos too big for one context window.",
    featured: false,
  },
  {
    name: "codemap",
    url: "https://github.com/zent7x/codemap",
    logo: "/logos/codemap.svg",
    mark: "full",
    desc: "Turn any repository into a self contained explorable HTML map.",
    featured: false,
  },
  {
    name: "cogrep",
    url: "https://github.com/zent7x/cogrep",
    logo: "/logos/cogrep.svg",
    mark: "full",
    desc: "Local semantic code search and clone detection from your terminal.",
    featured: false,
  },
  {
    name: "tally",
    url: "https://github.com/zent7x/tally",
    logo: "/logos/tally.svg",
    mark: "full",
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

export const status = "open to hard problems." as const;

export const bio =
  "I run two products and a security practice from Kashmir. routing.run keeps prompts out of vendor logs. warm.run makes agent loops reviewable. Between releases I take authorized security engagements, like the Publive work that surfaced critical bugs. Most days are Rust, TypeScript, and a terminal." as const;

export const now = [
  {
    name: "warm.run",
    url: profile.links.warm,
    logo: "/logos/warm.svg",
    mark: "full",
    role: "Founder",
    state: "Building",
    tone: "building",
    desc: "Overnight loops that ship review-ready PRs. Formerly Keelcode.",
  },
  {
    name: "routing.run",
    url: profile.links.routing,
    logo: "/logos/routing.png",
    mark: "line",
    state: "Live",
    tone: "live",
    desc: "OpenAI compatible LLM router with zero prompt logging.",
  },
] as const;

export const oss = [
  {
    name: "terminal-fenster",
    url: "https://zent7x.com/terminal-fenster/",
    logo: "/logos/terminal-fenster.svg",
    mark: "full",
    desc: "Real Chromium pixels inside your terminal.",
  },
  {
    name: "grasp",
    url: "https://github.com/zent7x/grasp",
    logo: "/logos/grasp.svg",
    mark: "full",
    desc: "Code context for agents on repos too big for one window.",
  },
  {
    name: "codemap",
    url: "https://github.com/zent7x/codemap",
    logo: "/logos/codemap.svg",
    mark: "full",
    desc: "Any repository as a self contained explorable map.",
  },
  {
    name: "cogrep",
    url: "https://github.com/zent7x/cogrep",
    logo: "/logos/cogrep.svg",
    mark: "full",
    desc: "Local semantic code search and clone detection.",
  },
  {
    name: "tally",
    url: "https://github.com/zent7x/tally",
    logo: "/logos/tally.svg",
    mark: "full",
    desc: "Offline finance tracker. One HTML file, no cloud.",
  },
] as const;

export const security = {
  name: "Publive",
  url: profile.links.publive,
  logo: "/logos/publive.svg",
  mark: "line",
  desc: "Worked with Publive to find critical bugs in their systems. Authorized scope only.",
} as const;

export const posts = [
  {
    slug: "chromium-in-the-terminal",
    title: "Real Chromium pixels in your terminal",
    date: "2026-08-02",
    summary: "Why terminal-fenster paints actual browser frames into Ghostty instead of faking a text mode web.",
    body: [
      "Terminal browsers usually cheat. They parse HTML, throw away the layout, and print what survives. That works for reading a man page online and falls apart the moment a page depends on its real rendering, which in 2026 is nearly every page.",
      "terminal-fenster takes the other road. A headless Chromium renders the page for real, and the frames are painted straight into the terminal through the Kitty graphics protocol. Ghostty treats them like any other cell content. Your scrollback, your splits, and your keybindings keep working, and the page looks like the page.",
      "Input goes the other way. Keys and clicks in the terminal are mapped back into Chromium events, so you can log in, scroll, and fill forms without leaving the shell. The whole thing exists because my work lives in a terminal, and switching to a browser window a hundred times a day was the single most annoying part of it.",
    ],
  },
  {
    slug: "zero-prompt-logging",
    title: "Zero prompt logging is the product",
    date: "2026-07-05",
    summary: "The router in the middle sees everything. routing.run is built on the idea that it should remember nothing.",
    body: [
      "An LLM router sits in the most sensitive spot of the whole stack. Every prompt, every system message, and every tool result passes through it. Most providers treat that stream as an asset to mine. I think the mining is the bug.",
      "routing.run is OpenAI compatible on the outside and deliberately forgetful on the inside. Requests are routed, billed, and dropped. There is no prompt store to breach, subpoena, or train on, because the store does not exist.",
      "The models themselves are a commodity now. They get cheaper and better every quarter no matter what I do. The thing that is not a commodity is your context, and a router that remembers nothing is the only honest way to hold it.",
    ],
  },
  {
    slug: "authorized-means-written",
    title: "Authorized means written down",
    date: "2026-06-10",
    summary: "How I run security engagements, and why nothing happens before the scope exists on paper.",
    body: [
      "Every security engagement I take starts the same way. A written scope that names the systems, the techniques, and the window. Not a verbal ok on a call. A document both sides can point at later.",
      "The Publive work ran like that. Scope first, then recon, then findings written up as they landed, each with reproduction steps and impact stated plainly. Critical bugs got reported the day they were confirmed, not saved for a dramatic final report.",
      "I do not test systems I was not asked to test. Curiosity is not authorization, and a bug found outside scope is not a favor, it is a liability for everyone involved. If you want your systems poked, the invitation has to exist in writing. Then I am happy to break things carefully.",
    ],
  },
] as const;

export type Post = (typeof posts)[number];

export const nav = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "proof", label: "Proof", href: "/#proof" },
  { id: "faq", label: "FAQ", href: "/#faq" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;
