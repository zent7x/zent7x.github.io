import { useEffect, useMemo } from "react";
import { BlogIndex, BlogPost } from "./components/Blog";
import { Header } from "./components/Header";
import { Footer, Home } from "./components/Home";
import { NotFound, Privacy, Terms } from "./components/Pages";
import { posts } from "./data/site";

function pathOf() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function resolve(path: string) {
  if (path === "/") return { view: <Home />, title: "zentex. Adeeb. AI systems you control" };
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

export default function App() {
  const { view, title } = useMemo(() => resolve(pathOf()), []);

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
