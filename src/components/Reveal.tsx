import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, fluid } from "../lib/cn";

// Content is hidden only under `html.js` (set by theme-init.js before first
// paint), so server-rendered markup stays readable without JavaScript and
// hydration starts from the same classes the server emitted.
export function Reveal({
  className,
  children,
  delay = 0,
  id,
  immediate = false,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
  id?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(immediate);

  useEffect(() => {
    if (on) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on]);

  return (
    <div
      id={id}
      ref={ref}
      className={cn(fluid, !on && "reveal-pending", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
