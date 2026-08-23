import { ArrowLeft } from "@phosphor-icons/react";
import { posts, profile, type Post } from "../data/site";
import { fluid } from "../lib/cn";
import { Reveal } from "./Reveal";

export function BlogIndex() {
  return (
    <main id="main" className="mt-16 pb-8">
      <Reveal>
        <p className="font-mono text-xs text-faint">Writing</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
          Notes from the loop
        </h1>
        <p className="mt-4 max-w-[680px] text-muted text-pretty">
          Short posts about routing, agent loops, terminals, and security work. Written when there is something worth writing.
        </p>
        <ul className="mt-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <a
                href={`/blog/${post.slug}`}
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
      </Reveal>
    </main>
  );
}

export function BlogPost({ post }: { post: Post }) {
  return (
    <main id="main" className="mt-16 pb-8">
      <Reveal>
        <a
          href="/blog"
          className={`${fluid} inline-flex items-center gap-2 rounded-sm text-sm text-muted hover:text-fg`}
        >
          <ArrowLeft className="size-4" aria-hidden />
          All writing
        </a>
        <p className="mt-8 font-mono text-xs text-faint">{post.date}</p>
        <h1 className="mt-4 max-w-[680px] text-3xl font-semibold tracking-tight text-balance">
          {post.title}
        </h1>
        <div className="mt-8 max-w-[680px] space-y-6 text-base text-muted text-pretty">
          {post.body.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
        </div>
        <p className="mt-10 text-sm text-faint">
          Reply by email:{" "}
          <a className="text-muted underline decoration-line underline-offset-4 hover:text-fg hover:decoration-fg" href={`mailto:${profile.email}?subject=${encodeURIComponent(post.title)}`}>
            {profile.email}
          </a>
        </p>
      </Reveal>
    </main>
  );
}
