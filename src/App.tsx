import { useEffect, useMemo } from "react";
import { BlogIndex, BlogPost } from "./components/Blog";
import { Header } from "./components/Header";
import { Footer, Home } from "./components/Home";
import { NotFound, Privacy, Terms } from "./components/Pages";
import { posts } from "./data/site";
import { base } from "./lib/url";

function pathOf() {
  const { pathname } = window.location;
  const local = pathname.startsWith(base) ? pathname.slice(base.length - 1) : pathname;
  return local.replace(/\/+$/, "") || "/";
}

function resolve(path: string) {
  if (path === "/") return { view: <Home />, title: "zentex · Adeeb" };
  if (path === "/privacy") return { view: <Privacy />, title: "Privacy · zentex" };
  if (path === "/terms") return { view: <Terms />, title: "Terms · zentex" };
  if (path === "/blog") return { view: <BlogIndex />, title: "Writing · zentex" };
  if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    const post = posts.find((p) => p.slug === slug);
    if (post) return { view: <BlogPost post={post} />, title: `${post.title} · zentex` };
  }
  return { view: <NotFound />, title: "404 · zentex" };
}

export default function App({ path }: { path?: string }) {
  const { view, title } = useMemo(() => resolve(path ?? pathOf()), [path]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="mx-auto max-w-[680px] px-6 pt-12 sm:pt-16">
      <Header />
      {view}
      <Footer />
    </div>
  );
}
