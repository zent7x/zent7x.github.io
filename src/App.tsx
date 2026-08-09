import { useEffect } from "react";
import { CommandPalette } from "./components/CommandPalette";
import { GithubActivity } from "./components/GithubActivity";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects, Stack, Ventures } from "./components/Sections";
import { Contact, Footer, Quote } from "./components/Shell";
import { useTheme } from "./hooks/useTheme";

function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress" id="scroll-progress" aria-hidden />;
}

function CursorGlow() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const glow = document.getElementById("cursor-glow");
    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        glow?.style.setProperty("--mx", `${e.clientX}px`);
        glow?.style.setProperty("--my", `${e.clientY}px`);
        ticking = false;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return <div className="cursor-glow" id="cursor-glow" aria-hidden />;
}

export default function App() {
  const { toggle } = useTheme();

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <div className="noise" aria-hidden />
      <div className="page">
        <Header />
        <main>
          <Hero onToggleTheme={toggle} />
          <Ventures />
          <Projects />
          <Stack />
          <GithubActivity />
          <Quote />
          <Contact />
        </main>
        <Footer />
      </div>
      <CommandPalette />
    </>
  );
}
