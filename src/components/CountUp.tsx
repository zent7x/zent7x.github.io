import { useEffect, useState } from "react";

export function CountUp({
  value,
  suffix = "",
}: {
  value: number | null;
  suffix?: string;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (value == null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  if (value == null) return <>—</>;
  return (
    <>
      {n.toLocaleString()}
      {suffix}
    </>
  );
}
