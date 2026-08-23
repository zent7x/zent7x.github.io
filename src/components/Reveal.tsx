import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, fluid } from "../lib/cn";

export function Reveal({
  className,
  children,
  delay = 0,
  id,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={cn(fluid, on ? "translate-y-0 blur-0 opacity-100" : "translate-y-16 blur-md opacity-0", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
