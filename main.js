/**
 * Claw portfolio — router viz + reactive / interactive chrome
 */
(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerFine = window.matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;
  const body = document.body;

  if (pointerFine) body.classList.add("is-pointer-fine");

  /* ── theme (persisted) ─────────────────────────────────────────── */
  const themeKey = "zent7x-theme";
  const themeMeta = document.getElementById("theme-color-meta");
  const themeBtn = document.getElementById("theme-toggle");

  function applyTheme(mode) {
    if (mode === "light") {
      root.setAttribute("data-theme", "light");
      if (themeMeta) themeMeta.setAttribute("content", "#f5f0e6");
    } else {
      root.removeAttribute("data-theme");
      if (themeMeta) themeMeta.setAttribute("content", "#0a0908");
    }
    try {
      localStorage.setItem(themeKey, mode);
    } catch (_) {
      /* ignore */
    }
  }

  function initTheme() {
    try {
      const stored = localStorage.getItem(themeKey);
      if (stored === "light" || stored === "dark") {
        applyTheme(stored === "light" ? "light" : "dark");
      }
    } catch (_) {
      /* ignore */
    }
  }

  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  }

  initTheme();
  themeBtn?.addEventListener("click", toggleTheme);

  /* ── scroll progress ───────────────────────────────────────────── */
  const scrollBar = document.getElementById("scroll-progress");
  let scrollTicking = false;

  function updateScroll() {
    const doc = document.documentElement;
    const h = doc.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.min(1, window.scrollY / h) : 0;
    root.style.setProperty("--scroll-pct", String(pct));
    if (scrollBar) {
      scrollBar.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
    }
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true }
  );
  updateScroll();

  /* ── cursor-reactive glow ──────────────────────────────────────── */
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let glowTicking = false;

  function pushGlow() {
    root.style.setProperty("--mx", `${mx}px`);
    root.style.setProperty("--my", `${my}px`);
    glowTicking = false;
  }

  if (!prefersReducedMotion && pointerFine) {
    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!glowTicking) {
          glowTicking = true;
          requestAnimationFrame(pushGlow);
        }
      },
      { passive: true }
    );
  }

  /* ── 3D tilt (project cards) ───────────────────────────────────── */
  function bindTilt(el) {
    const maxX = 11;
    const maxY = 9;
    el.addEventListener(
      "mousemove",
      (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const ry = px * 2 * maxX;
        const rx = -py * 2 * maxY;
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
      },
      { passive: true }
    );
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach(bindTilt);
  }

  /* ── magnetic buttons ───────────────────────────────────────────── */
  function bindMagnetic(el) {
    const strength = 0.28;
    const max = 12;
    el.addEventListener(
      "mousemove",
      (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let dx = (e.clientX - cx) * strength;
        let dy = (e.clientY - cy) * strength;
        dx = Math.max(-max, Math.min(max, dx));
        dy = Math.max(-max, Math.min(max, dy));
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      },
      { passive: true }
    );
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(bindMagnetic);
  }

  /* ── hero panel parallax ───────────────────────────────────────── */
  const heroPanel = document.getElementById("hero-panel");
  const heroGrid = document.querySelector(".hero-grid");

  if (!prefersReducedMotion && heroPanel && heroGrid && pointerFine) {
    heroGrid.addEventListener(
      "mousemove",
      (e) => {
        const r = heroGrid.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        heroPanel.style.transform = `translate(${px * -8}px, ${py * -6}px) rotateX(${py * -1.2}deg) rotateY(${px * 1.4}deg)`;
      },
      { passive: true }
    );
    heroGrid.addEventListener("mouseleave", () => {
      heroPanel.style.transform = "";
    });
  }

  /* ── section-aware nav ─────────────────────────────────────────── */
  const navLinks = document.querySelectorAll("[data-section-link]");
  const sections = document.querySelectorAll("[data-nav-section]");

  if (navLinks.length && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.getAttribute("data-nav-section");
          navLinks.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("data-section-link") === id);
          });
        });
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ── stack chips: tap pulse + copy ───────────────────────────── */
  document.querySelectorAll("[data-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-chip].is-active").forEach((c) => {
        if (c !== chip) c.classList.remove("is-active");
      });
      chip.classList.toggle("is-active");
      chip.classList.remove("is-pop");
      void chip.offsetWidth;
      chip.classList.add("is-pop");
      const text = chip.textContent?.trim() || "";
      if (text && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    });
  });

  /* ── command palette ───────────────────────────────────────────── */
  const palette = document.getElementById("palette");
  const paletteBackdrop = document.getElementById("palette-backdrop");
  const paletteInput = document.getElementById("palette-input");
  const paletteList = document.getElementById("palette-list");

  const ACTIONS = [
    { id: "work", label: "Jump to selected work", keys: "work projects", run: () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "stack", label: "Jump to stack", keys: "stack tools tech", run: () => document.getElementById("stack")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "contact", label: "Jump to contact", keys: "contact email social", run: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "now", label: "Jump to now", keys: "now current", run: () => document.getElementById("now")?.scrollIntoView({ behavior: "smooth" }) },
    {
      id: "routing",
      label: "Open routing.run",
      keys: "router api llm",
      run: () => window.open("https://routing.run", "_blank", "noopener,noreferrer"),
    },
    {
      id: "gh",
      label: "Open GitHub",
      keys: "github code zent7x",
      run: () => window.open("https://github.com/zent7x", "_blank", "noopener,noreferrer"),
    },
    {
      id: "x",
      label: "Open X / Twitter",
      keys: "twitter x social",
      run: () => window.open("https://x.com/zent7x", "_blank", "noopener,noreferrer"),
    },
    { id: "theme", label: "Toggle light / dark theme", keys: "theme appearance", run: toggleTheme },
  ];

  let paletteOpen = false;
  let filtered = [...ACTIONS];
  let hilite = 0;

  function renderPaletteList() {
    if (!paletteList) return;
    paletteList.innerHTML = "";
    if (filtered.length === 0) {
      const li = document.createElement("li");
      li.className = "palette-hint";
      li.textContent = "No matches — try work, stack, routing, theme…";
      paletteList.appendChild(li);
      return;
    }
    filtered.forEach((action, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "palette-item" + (i === hilite ? " is-hilite" : "");
      btn.innerHTML = `<span>${action.label}</span><span class="palette-item-key">${action.id}</span>`;
      btn.addEventListener("mousedown", (ev) => ev.preventDefault());
      btn.addEventListener("click", () => {
        action.run();
        closePalette();
      });
      li.appendChild(btn);
      paletteList.appendChild(li);
    });
  }

  function filterPalette(q) {
    const s = q.trim().toLowerCase();
    if (!s) {
      filtered = [...ACTIONS];
    } else {
      filtered = ACTIONS.filter((a) => {
        const blob = `${a.label} ${a.keys}`.toLowerCase();
        return blob.includes(s);
      });
    }
    hilite = 0;
    renderPaletteList();
  }

  function openPalette() {
    if (!palette) return;
    palette.removeAttribute("hidden");
    paletteOpen = true;
    body.style.overflow = "hidden";
    filterPalette("");
    requestAnimationFrame(() => paletteInput?.focus());
  }

  function closePalette() {
    if (!palette) return;
    palette.setAttribute("hidden", "");
    paletteOpen = false;
    body.style.overflow = "";
    if (paletteInput) paletteInput.value = "";
  }

  paletteBackdrop?.addEventListener("click", closePalette);
  paletteInput?.addEventListener("input", () => filterPalette(paletteInput.value));

  window.addEventListener("keydown", (e) => {
    const isK = e.key === "k" && (e.metaKey || e.ctrlKey);
    if (isK) {
      e.preventDefault();
      paletteOpen ? closePalette() : openPalette();
      return;
    }
    if (!paletteOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!filtered.length) return;
      hilite = (hilite + 1) % filtered.length;
      renderPaletteList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!filtered.length) return;
      hilite = (hilite - 1 + filtered.length) % filtered.length;
      renderPaletteList();
    } else if (e.key === "Enter" && filtered[hilite]) {
      e.preventDefault();
      filtered[hilite].run();
      closePalette();
    }
  });

  /* ── ASCII router (existing) ───────────────────────────────────── */
  const providers = [
    { name: "openai", row: 0 },
    { name: "anthropic", row: 2 },
    { name: "mistral", row: 4 },
    { name: "cohere", row: 8 },
    { name: "groq", row: 10 },
    { name: "google", row: 12 },
  ];

  const W = 56;
  const H = 13;
  const cy = 6;
  const coreL = 14;
  const coreR = 18;
  const trunkCol = 32;
  const labelCol = 36;
  const labelWidth = 13;

  function baseGrid() {
    const g = Array.from({ length: H }, () => Array(W).fill(" "));

    "client".split("").forEach((ch, i) => {
      g[cy][2 + i] = ch;
    });
    for (let x = 9; x < coreL; x++) g[cy][x] = "─";
    "[ / ]".split("").forEach((ch, i) => {
      g[cy][coreL + i] = ch;
    });
    for (let x = coreR + 1; x <= trunkCol; x++) g[cy][x] = "─";
    for (let y = 0; y < H; y++) g[y][trunkCol] = "│";

    providers.forEach((p) => {
      if (p.row === 0) g[p.row][trunkCol] = "┌";
      else if (p.row === H - 1) g[p.row][trunkCol] = "└";
      else g[p.row][trunkCol] = "├";
      for (let x = trunkCol + 1; x < labelCol; x++) g[p.row][x] = "─";
      const lbl = `[ ${p.name.padEnd(9)} ]`;
      for (let i = 0; i < lbl.length; i++) g[p.row][labelCol + i] = lbl[i];
    });

    g[cy][trunkCol] = "┤";
    return g;
  }

  function pathFor(p) {
    const path = [];
    for (let x = 9; x < coreL; x++) path.push([x, cy]);
    for (let x = coreL; x <= coreR; x++) path.push([x, cy]);
    for (let x = coreR + 1; x <= trunkCol; x++) path.push([x, cy]);
    if (p.row < cy) {
      for (let y = cy - 1; y >= p.row; y--) path.push([trunkCol, y]);
    } else if (p.row > cy) {
      for (let y = cy + 1; y <= p.row; y++) path.push([trunkCol, y]);
    }
    for (let x = trunkCol + 1; x < labelCol; x++) path.push([x, p.row]);
    for (let x = labelCol; x < labelCol + labelWidth; x++) path.push([x, p.row]);
    return path;
  }

  function escapeHtml(c) {
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === "&") return "&amp;";
    return c;
  }

  const paths = providers.map((p) => ({ ...p, path: pathFor(p) }));
  const baseG = baseGrid();
  let pulseStep = 0;
  let activeIdx = 0;
  let frame = 0;

  const graphEl = document.getElementById("graph");
  const capTop = document.getElementById("graph-caption-top");

  function renderGraph() {
    if (!graphEl) return;
    const active = paths[activeIdx];
    const head = Math.min(pulseStep, active.path.length - 1);
    const tail = Math.max(0, head - 4);
    const pulseSet = new Set();
    for (let k = tail; k <= head; k++) {
      const c = active.path[k];
      if (c) pulseSet.add(`${c[0]},${c[1]}`);
    }

    let html = "";
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const ch = baseG[y][x];
        const isPulse = pulseSet.has(`${x},${y}`);
        const isCore = y === cy && x >= coreL && x <= coreR;
        const isLabel = /[a-z]/.test(ch) || ch === "[" || ch === "]";
        const isClient = y === cy && x >= 2 && x <= 7;

        let cls = "";
        if (isCore) cls = "core";
        else if (isPulse) cls = "pulse";
        else if (isLabel || isClient) cls = "lbl";

        html += cls ? `<span class="${cls}">${escapeHtml(ch)}</span>` : escapeHtml(ch);
      }
      html += "\n";
    }

    const ms = 80 + Math.floor(Math.random() * 90);
    graphEl.innerHTML = html;
    if (capTop) capTop.textContent = `→ ${active.name} · ${ms}ms`;
  }

  function tick() {
    frame += 1;
    pulseStep += 1;
    const active = paths[activeIdx];
    if (pulseStep > active.path.length + 4) {
      pulseStep = 0;
      activeIdx = (activeIdx + 1) % paths.length;
    }
    renderGraph();
  }

  if (graphEl && !prefersReducedMotion) {
    renderGraph();
    setInterval(tick, 95);
  } else if (graphEl) {
    pulseStep = 999;
    activeIdx = 0;
    renderGraph();
  }

  /* ── scroll reveal ─────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");
  if (!prefersReducedMotion && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) ent.target.classList.add("is-visible");
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── footer year + stamp ───────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  const stamp = document.getElementById("stamp");
  if (stamp) {
    stamp.textContent = `last deploy · ${new Date().toISOString().slice(0, 10)}`;
  }

  /* ── `R` → routing.run ─────────────────────────────────────────── */
  window.addEventListener("keydown", (e) => {
    if (e.key !== "r" || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (paletteOpen) return;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    window.open("https://routing.run", "_blank", "noopener,noreferrer");
  });
})();
