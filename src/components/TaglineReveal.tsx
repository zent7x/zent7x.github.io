import { useEffect, useRef, useState } from "react";
import { copy } from "../data/site";

export function TaglineReveal() {
  const words = [
    ...copy.tagline[0].split(" ").map((w) => ({ w, line: 0 })),
    ...copy.tagline[1].split(" ").map((w) => ({ w, line: 1 })),
  ];
  const refs = useRef<Array<HTMLSpanElement | null>>([]);
  const [on, setOn] = useState<boolean[]>(() => words.map(() => false));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOn(words.map(() => true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        setOn((prev) => {
          const next = [...prev];
          for (const entry of entries) {
            const i = Number((entry.target as HTMLElement).dataset.i);
            if (entry.isIntersecting) next[i] = true;
          }
          return next;
        });
      },
      { root: null, rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-24" aria-label="Tagline">
      <p className="text-4xl font-semibold leading-10 text-balance sm:text-5xl sm:leading-none">
        {[0, 1].map((line) => (
          <span key={line} className="block">
            {words
              .map((item, i) => ({ ...item, i }))
              .filter((item) => item.line === line)
              .map((item) => (
                <span
                  key={item.i}
                  ref={(el) => {
                    refs.current[item.i] = el;
                  }}
                  data-i={item.i}
                  className="mr-3 inline-block transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ opacity: on[item.i] ? 1 : 0.3 }}
                >
                  {item.w}
                </span>
              ))}
          </span>
        ))}
      </p>
    </section>
  );
}
