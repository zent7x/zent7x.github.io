(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const handle = "zent7x";

  /* scroll progress */
  const bar = document.getElementById("scroll-progress");
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* command palette */
  const palette = document.getElementById("palette");
  const backdrop = document.getElementById("palette-backdrop");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-list");
  let open = false;
  let filtered = [];
  let idx = 0;

  const actions = [
    { id: "ventures", label: "Jump to ventures", run: () => document.getElementById("ventures")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "projects", label: "Jump to projects", run: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "github", label: "Jump to GitHub activity", run: () => document.getElementById("github")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "contact", label: "Jump to contact", run: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "routing", label: "Open routing.run", run: () => window.open("https://routing.run", "_blank", "noopener") },
    { id: "keelcode", label: "Open Keelcode", run: () => window.open("https://keelcode.ai", "_blank", "noopener") },
    { id: "gh", label: "Open GitHub profile", run: () => window.open("https://github.com/zent7x", "_blank", "noopener") },
    { id: "blog", label: "Open blog", run: () => window.open("https://zent7x.com/blog", "_blank", "noopener") },
    { id: "x", label: "Open X / Twitter", run: () => window.open("https://x.com/zent7x", "_blank", "noopener") },
    { id: "satviks", label: "Open @satviks on X", run: () => window.open("https://x.com/satviks", "_blank", "noopener") },
    { id: "email", label: "Copy email address", run: () => copyText("zentex@warm.run") },
  ];

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  function renderList() {
    if (!list) return;
    list.innerHTML = "";
    if (!filtered.length) {
      list.innerHTML = "<li class='palette-empty'>No matches</li>";
      return;
    }
    filtered.forEach((a, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "palette-item" + (i === idx ? " is-active" : "");
      btn.innerHTML = `<span>${a.label}</span><span class="palette-key">${a.id}</span>`;
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("click", () => {
        a.run();
        closePalette();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function filter(q) {
    const s = q.trim().toLowerCase();
    filtered = s
      ? actions.filter((a) => `${a.label} ${a.id}`.toLowerCase().includes(s))
      : [...actions];
    idx = 0;
    renderList();
  }

  function openPalette() {
    if (!palette) return;
    palette.hidden = false;
    open = true;
    document.body.style.overflow = "hidden";
    filter("");
    requestAnimationFrame(() => input?.focus());
  }

  function closePalette() {
    if (!palette) return;
    palette.hidden = true;
    open = false;
    document.body.style.overflow = "";
    if (input) input.value = "";
  }

  backdrop?.addEventListener("click", closePalette);
  input?.addEventListener("input", () => filter(input.value));

  document.getElementById("hint-palette")?.addEventListener("click", openPalette);
  document.getElementById("hint-routing")?.addEventListener("click", () => {
    window.open("https://routing.run", "_blank", "noopener");
  });
  document.getElementById("hint-keelcode")?.addEventListener("click", () => {
    window.open("https://keelcode.ai", "_blank", "noopener");
  });

  const heroPhoto = document.getElementById("hero-photo");
  const themeColor = document.getElementById("theme-color");
  heroPhoto?.addEventListener("click", () => {
    const root = document.documentElement;
    const white = root.classList.toggle("site-white");
    if (themeColor) themeColor.content = white ? "#ffffff" : "#09090b";
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      open ? closePalette() : openPalette();
      return;
    }
    if (e.key === "r" && !e.metaKey && !e.ctrlKey && !e.altKey && !open) {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      window.open("https://routing.run", "_blank", "noopener");
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length) idx = (idx + 1) % filtered.length;
      renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length) idx = (idx - 1 + filtered.length) % filtered.length;
      renderList();
    } else if (e.key === "Enter" && filtered[idx]) {
      e.preventDefault();
      filtered[idx].run();
      closePalette();
    }
  });

  /* stack chips */
  document.querySelectorAll("[data-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const name = chip.getAttribute("data-chip") || chip.title;
      copyText(name);
      chip.classList.add("is-flash");
      setTimeout(() => chip.classList.remove("is-flash"), 400);
    });
  });

  /* github contributions */
  const contribWrap = document.getElementById("contrib-wrap");
  const contribSkeleton = document.getElementById("contrib-skeleton");
  const contribMeta = document.getElementById("contrib-meta");
  const contribMonths = document.getElementById("contrib-months");
  const ghTotal = document.getElementById("gh-total");
  const ghActiveDays = document.getElementById("gh-active-days");
  const ghLongestStreak = document.getElementById("gh-longest-streak");
  const dateFmt = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const monthFmt = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  });

  if (contribSkeleton) {
    for (let i = 0; i < 364; i++) {
      const cell = document.createElement("span");
      cell.style.setProperty("--i", String(i % 20));
      contribSkeleton.appendChild(cell);
    }
  }

  let contribTip = document.querySelector(".contrib-tip");
  if (!contribTip) {
    contribTip = document.createElement("div");
    contribTip.className = "contrib-tip";
    contribTip.hidden = true;
    document.body.appendChild(contribTip);
  }

  function placeContribTip(cell) {
    if (!contribTip || contribTip.hidden) return;
    const rect = cell.getBoundingClientRect();
    const tipRect = contribTip.getBoundingClientRect();
    const margin = 8;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));
    let top = rect.top - tipRect.height - margin;
    if (top < margin) top = rect.bottom + margin;
    contribTip.style.left = `${left}px`;
    contribTip.style.top = `${top}px`;
  }

  function showContribTip(cell, text) {
    if (!contribTip) return;
    contribTip.textContent = text;
    contribTip.hidden = false;
    placeContribTip(cell);
  }

  function hideContribTip() {
    if (contribTip) contribTip.hidden = true;
  }

  function wireContribGrid(grid) {
    grid.querySelectorAll(".contrib-day").forEach((cell) => {
      cell.addEventListener("pointerenter", () => {
        grid.querySelectorAll(".contrib-day.is-hot").forEach((c) => c.classList.remove("is-hot"));
        cell.classList.add("is-hot");
        showContribTip(cell, cell.dataset.tip || "");
      });
      cell.addEventListener("pointerleave", () => {
        cell.classList.remove("is-hot");
        hideContribTip();
      });
    });

    window.addEventListener(
      "scroll",
      () => {
        const hot = grid.querySelector(".contrib-day.is-hot");
        if (hot) placeContribTip(hot);
      },
      { passive: true }
    );
  }

  function renderContributionMonths(days) {
    if (!contribMonths) return;
    contribMonths.innerHTML = "";
    let previous = "";
    days.forEach((day, index) => {
      const label = monthFmt.format(new Date(day.date + "T00:00:00Z"));
      if (label === previous) return;
      previous = label;
      const month = document.createElement("span");
      month.textContent = label;
      month.style.gridColumnStart = String(Math.floor(index / 7) + 1);
      contribMonths.appendChild(month);
    });
  }

  async function loadContributions() {
    if (!contribWrap || contribWrap.dataset.ready === "true") return;
    contribWrap.dataset.ready = "true";

    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${handle}?y=last`);
      if (!res.ok) throw new Error("unavailable");
      const data = await res.json();
      const days = Array.isArray(data.contributions) ? data.contributions.slice(-364) : [];
      if (!days.length) throw new Error("unavailable");

      const total = days.reduce((n, d) => n + Number(d.count || 0), 0);
      const activeDays = days.filter((day) => Number(day.count || 0) > 0).length;
      const bestDay = days.reduce((best, day) =>
        Number(day.count || 0) > Number(best.count || 0) ? day : best
      , days[0]);
      let streak = 0;
      let longestStreak = 0;
      days.forEach((day) => {
        streak = Number(day.count || 0) > 0 ? streak + 1 : 0;
        longestStreak = Math.max(longestStreak, streak);
      });

      if (ghTotal) ghTotal.textContent = total.toLocaleString();
      if (ghActiveDays) ghActiveDays.textContent = activeDays.toLocaleString();
      if (ghLongestStreak) ghLongestStreak.textContent = `${longestStreak}d`;
      renderContributionMonths(days);

      const grid = document.createElement("div");
      grid.className = "contrib-grid";
      grid.setAttribute("role", "img");
      grid.setAttribute(
        "aria-label",
        `${total.toLocaleString()} contributions in the last year`
      );

      days.forEach((day, index) => {
        const count = Number(day.count || 0);
        const level = Math.max(0, Math.min(4, Number(day.level || 0)));
        const when = dateFmt.format(new Date(day.date + "T00:00:00Z"));
        const tip =
          count === 0
            ? `No contributions · ${when}`
            : `${count.toLocaleString()} · ${when}`;

        const cell = document.createElement("span");
        cell.className = "contrib-day";
        cell.dataset.level = String(level);
        cell.dataset.tip = tip;
        cell.style.setProperty("--delay", `${Math.min(index, 80) * 5}ms`);
        grid.appendChild(cell);
      });

      contribSkeleton?.replaceWith(grid);
      wireContribGrid(grid);
      requestAnimationFrame(() => {
        contribWrap.scrollLeft = contribWrap.scrollWidth;
      });
      if (contribMeta) {
        const bestCount = Number(bestDay.count || 0).toLocaleString();
        contribMeta.textContent = `Last 52 weeks · best day ${bestCount} commits`;
      }
    } catch {
      contribSkeleton?.remove();
      contribMonths?.remove();
      if (contribMeta) contribMeta.textContent = "Contributions unavailable right now.";
    } finally {
      contribWrap.setAttribute("aria-busy", "false");
    }
  }

  if (contribWrap) {
    const run = () => loadContributions();
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 1200);
    }
  }

  /* subtle cursor glow */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.getElementById("cursor-glow");
    let ticking = false;
    window.addEventListener(
      "mousemove",
      (e) => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            if (glow) {
              glow.style.setProperty("--mx", e.clientX + "px");
              glow.style.setProperty("--my", e.clientY + "px");
            }
            ticking = false;
          });
        }
      },
      { passive: true }
    );
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
