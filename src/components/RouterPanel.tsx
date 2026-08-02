import { useEffect, useState } from "react";

const providers = ["openai", "anthropic", "mistral", "cohere", "groq", "google"];

export function RouterPanel() {
  const [route, setRoute] = useState("openai");
  const [ms, setMs] = useState(142);
  const [req, setReq] = useState(16);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoute(providers[Math.floor(Math.random() * providers.length)]!);
      setMs(90 + Math.floor(Math.random() * 120));
      setReq((n) => n + 1);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="router" aria-hidden="true">
      <div className="router__head">
        <span>router · schematic</span>
        <span>/v1/chat/completions</span>
      </div>
      <svg className="router__svg" viewBox="0 0 360 200" fill="none">
        <text x="16" y="28" className="router__label">
          client
        </text>
        <line x1="56" y1="24" x2="108" y2="24" className="router__wire" />
        <rect x="108" y="12" width="36" height="24" rx="4" className="router__box" />
        <text x="116" y="28" className="router__mono">
          / /
        </text>
        <line x1="144" y1="24" x2="188" y2="24" className="router__wire" />
        <line x1="188" y1="24" x2="188" y2="168" className="router__wire" />
        {providers.map((name, i) => {
          const y = 40 + i * 22;
          const active = name === route;
          return (
            <g key={name}>
              <line
                x1="188"
                y1="24"
                x2="220"
                y2={y}
                className={active ? "router__wire router__wire--hot" : "router__wire"}
              />
              <rect
                x="220"
                y={y - 12}
                width={name.length * 7 + 28}
                height="20"
                rx="4"
                className={active ? "router__box router__box--hot" : "router__box"}
              />
              <text x="232" y={y + 2} className={active ? "router__mono router__mono--hot" : "router__mono"}>
                {name}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="router__foot">
        → /v1/chat/completions · routed → <strong>{route}</strong> · {ms}ms · req#
        {String(req).padStart(5, "0")}
      </p>
    </div>
  );
}
