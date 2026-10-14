(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const handle = "zent7x";
  document.documentElement.classList.add("js");

  /* A small, hash-based navigation layer. All panels remain visible without JS. */
  const panels = [...document.querySelectorAll("[data-panel]")];
  const pageLinks = [...document.querySelectorAll("[data-page-link]")];
  let routeFrame = 0;

  function hashTarget(hash) {
    try {
      return document.getElementById(decodeURIComponent(hash.replace(/^#/, "")));
    } catch {
      return null;
    }
  }

  function showRoute(hash, { focus = false, smooth = false } = {}) {
    if (!panels.length) return;
    const target = hashTarget(hash);
    if (target?.closest("[data-project-category][hidden]")) {
      document.querySelector('[data-project-filter="all"]')?.click();
    }
    if (target?.tagName === "DETAILS") target.open = true;
    const enclosingDetails = target?.closest("details");
    if (enclosingDetails) enclosingDetails.open = true;
    const skipToContent = target?.id === "main";
    const activePanel = target?.closest("[data-panel]") ||
      (skipToContent ? panels.find((panel) => !panel.hidden) : null) ||
      panels.find((panel) => panel.dataset.panel === "about") || panels[0];
    const focusedPanel = document.activeElement?.closest("[data-panel]");
    const moveFocus = focus || (focusedPanel && focusedPanel !== activePanel);
    panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
    pageLinks.forEach((link) => {
      const active = link.hash === `#${activePanel.dataset.panel}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    cancelAnimationFrame(routeFrame);
    routeFrame = requestAnimationFrame(() => {
      const deepTarget = target && target !== activePanel && activePanel.contains(target);
      if (moveFocus) {
        const heading = skipToContent ? target : (deepTarget ? target : activePanel)
          .querySelector("[data-panel-heading], h1, h2, h3") || (deepTarget ? target : activePanel);
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
      const visibleContributions = activePanel.querySelector("#contrib-wrap[data-ready='true']");
      if (visibleContributions) visibleContributions.scrollLeft = visibleContributions.scrollWidth;
      const tooltip = document.querySelector(".contrib-tip");
      if (tooltip) tooltip.hidden = true;
      if (deepTarget || skipToContent) {
        target.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "instant", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    });
  }

  function navigate(hash, options = {}) {
    if (location.hash !== hash) history.pushState(null, "", hash);
    showRoute(hash, options);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href^='#']");
    if (!link || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const target = hashTarget(link.hash);
    if (target?.id === "main") {
      event.preventDefault();
      showRoute("#main", { focus: true });
      return;
    }
    if (!target?.closest("[data-panel]")) return;
    event.preventDefault();
    navigate(link.hash, { focus: true, smooth: !link.hasAttribute("data-page-link") });
  });
  window.addEventListener("hashchange", () => showRoute(location.hash));
  showRoute(location.hash);

  /* Theme preference also works when storage is unavailable. */
  const themeToggle = document.getElementById("theme-toggle");
  const themeColor = document.getElementById("theme-color");
  function syncTheme() {
    const light = document.documentElement.classList.contains("site-white");
    const label = `Switch to ${light ? "dark" : "light"} theme`;
    themeToggle?.setAttribute("aria-label", label);
    themeToggle?.setAttribute("aria-pressed", String(light));
    if (themeToggle) { themeToggle.title = label; themeToggle.hidden = false; }
    if (themeColor) themeColor.content = light ? "#ffffff" : "#141414";
  }
  try {
    const savedTheme = localStorage.getItem("zentex-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.classList.toggle("site-white", savedTheme === "light");
    }
  } catch { /* Keep the current theme in storage-restricted contexts. */ }
  syncTheme();
  themeToggle?.addEventListener("click", () => {
    const light = document.documentElement.classList.toggle("site-white");
    try { localStorage.setItem("zentex-theme", light ? "light" : "dark"); } catch { /* optional persistence */ }
    syncTheme();
  });

  /* Clipboard feedback is visible and announced to assistive technology. */
  const copyStatus = document.getElementById("copy-status");
  const copyEmail = document.getElementById("copy-email");
  const copyLabel = copyEmail?.querySelector("[data-copy-label]");
  const originalCopyLabel = copyLabel?.textContent || "Copy email";
  if (copyEmail) copyEmail.hidden = false;
  let copyReset;
  let statusTimer;
  function announce(message) {
    if (!copyStatus) return;
    clearTimeout(statusTimer);
    copyStatus.textContent = "";
    statusTimer = setTimeout(() => { copyStatus.textContent = message; }, 20);
  }
  async function copyText(text) {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch { /* Try the selection-based fallback below. */ }
    }
    if (!copied) {
      const previousFocus = document.activeElement;
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(field);
      field.select();
      try { copied = document.execCommand("copy"); } catch { /* Report the failure below. */ }
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
    announce(copied ? `${text} copied to clipboard.` : `Could not copy. You can select and copy: ${text}`);
    return copied;
  }
  copyEmail?.addEventListener("click", async () => {
    const copied = await copyText("zentex@warm.run");
    if (copyLabel) copyLabel.textContent = copied ? "Copied" : "Try again";
    copyEmail.dataset.copied = String(copied);
    clearTimeout(copyReset);
    copyReset = setTimeout(() => {
      if (copyLabel) copyLabel.textContent = originalCopyLabel;
      delete copyEmail.dataset.copied;
    }, 2400);
  });

  /* Command palette: searchable buttons, keyboard navigation, and modal focus. */
  const palette = document.getElementById("palette");
  const backdrop = document.getElementById("palette-backdrop");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-list");
  let open = false;
  let filtered = [];
  let idx = 0;
  let previousFocus = null;
  let previousOverflow = "";

  const actions = [
    { id: "about", label: "Go to about", run: () => navigate("#about", { focus: true }) },
    { id: "work", label: "Go to work", run: () => navigate("#work", { focus: true }) },
    { id: "writing", label: "Go to writing", run: () => navigate("#writing", { focus: true }) },
    { id: "more", label: "Go to elsewhere", run: () => navigate("#more", { focus: true }) },
    ...[
      ["ventures", "ventures"], ["projects", "projects"], ["blog", "blog"],
      ["interests", "interests"], ["games", "games"], ["stack", "stack"],
      ["github", "GitHub activity"], ["chess", "chess puzzle"], ["contact", "contact"],
    ].map(([id, label]) => ({
      id, label: `Jump to ${label}`, run: () => navigate(`#${id}`, { focus: true, smooth: true }),
    })),
    { id: "routing", label: "Open routing.run", run: () => window.open("https://routing.run", "_blank", "noopener") },
    { id: "warm", label: "Open warm.run", run: () => window.open("https://warm.run", "_blank", "noopener") },
    { id: "gh", label: "Open GitHub profile", run: () => window.open("https://github.com/zent7x", "_blank", "noopener") },
    { id: "x", label: "Open X / Twitter", run: () => window.open("https://x.com/zent7x", "_blank", "noopener") },
    { id: "email", label: "Copy email address", run: () => copyText("zentex@warm.run") },
    ...[...document.querySelectorAll(".project-detail[id]")].map((project) => ({
      id: project.id,
      label: project.querySelector("summary strong").textContent,
      kind: "Project",
      keywords: project.querySelector(".project-detail__copy > span").textContent,
      run: () => navigate(`#${project.id}`, { focus: true, smooth: true }),
    })),
    ...[...document.querySelectorAll("[data-article]")].map((article) => ({
      id: article.dataset.article,
      label: article.querySelector("h2").textContent,
      kind: "Writing",
      keywords: article.querySelector(".article-copy p").textContent,
      run: () => location.assign(article.querySelector("a").href),
    })),
  ];

  if (input) {
    input.setAttribute("aria-label", "Search pages and actions");
    input.setAttribute("aria-controls", "palette-list");
  }

  function activateResult({ focus = false, scroll = true } = {}) {
    list?.querySelectorAll(".palette-item").forEach((button, index) => {
      button.classList.toggle("is-active", index === idx);
      if (index !== idx) return;
      if (focus) button.focus({ preventScroll: true });
      if (scroll) button.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  }

  function runAction(action) {
    closePalette();
    action.run();
  }

  function renderList() {
    if (!list) return;
    list.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement("li");
      empty.className = "palette-empty";
      empty.textContent = "No matches. Try a project name, article, or page.";
      empty.setAttribute("role", "status");
      list.appendChild(empty);
      return;
    }
    filtered.forEach((action, index) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "palette-item" + (index === idx ? " is-active" : "");
      const label = document.createElement("span");
      label.textContent = action.label;
      const key = document.createElement("span");
      key.className = "palette-key";
      key.textContent = action.kind || (action.id === "email" ? "Action" : action.label.startsWith("Open ") ? "Link" : "Page");
      key.setAttribute("aria-hidden", "true");
      button.append(label, key);
      button.addEventListener("focus", () => {
        idx = index;
        activateResult({ scroll: true });
      });
      button.addEventListener("click", () => runAction(action));
      item.appendChild(button);
      list.appendChild(item);
    });
    activateResult();
  }

  function filter(query) {
    const search = query.trim().toLowerCase();
    filtered = search
      ? actions.filter((action) => `${action.label} ${action.id} ${action.keywords || ""}`.toLowerCase().includes(search))
      : [...actions];
    idx = 0;
    renderList();
  }

  function openPalette() {
    if (!palette || open) return;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    palette.hidden = false;
    open = true;
    document.body.style.overflow = "hidden";
    if (input) input.value = "";
    filter("");
    requestAnimationFrame(() => { if (open) input?.focus({ preventScroll: true }); });
  }

  function closePalette() {
    if (!palette || !open) return;
    palette.hidden = true;
    open = false;
    document.body.style.overflow = previousOverflow;
    if (input) input.value = "";
    if (previousFocus?.isConnected && !previousFocus.closest("[hidden]")) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  backdrop?.addEventListener("click", closePalette);
  input?.addEventListener("input", () => filter(input.value));
  document.querySelectorAll("[data-open-palette]").forEach((paletteTrigger) => {
    paletteTrigger.addEventListener("click", openPalette);
    paletteTrigger.hidden = false;
  });
  document.getElementById("palette-close")?.addEventListener("click", closePalette);
  document.getElementById("hint-routing")?.addEventListener("click", () => {
    window.open("https://routing.run", "_blank", "noopener");
  });
  document.getElementById("hint-warm")?.addEventListener("click", () => {
    window.open("https://warm.run", "_blank", "noopener");
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open ? closePalette() : openPalette();
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    } else if (event.key === "Tab") {
      const focusable = [...palette.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), a[href], [tabindex='0']"
      )].filter((element) => !element.closest("[hidden]") && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) return;
      if (event.shiftKey && (document.activeElement === first || !palette.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !palette.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!filtered.length) return;
      event.preventDefault();
      if (document.activeElement === input) idx = event.key === "ArrowDown" ? 0 : filtered.length - 1;
      else idx = (idx + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length;
      activateResult({ focus: true });
    } else if (event.key === "Enter" && document.activeElement === input && filtered[idx]) {
      event.preventDefault();
      runAction(filtered[idx]);
    }
  });

  /* Stack chips share the same accessible clipboard feedback. */
  document.querySelectorAll("[data-chip]").forEach((chip) => {
    chip.addEventListener("click", async () => {
      const name = chip.getAttribute("data-chip") || chip.title;
      if (!name || !(await copyText(name))) return;
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
  const ghCurrentStreak = document.getElementById("gh-current-streak");
  const ghLongestStreak = document.getElementById("gh-longest-streak");
  const ghSub = document.getElementById("gh-sub");
  const ghFootCopy = document.getElementById("gh-foot-copy");
  const githubRecent = document.getElementById("github-recent");
  const githubRecentList = document.getElementById("github-recent-list");
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
  const relativeFmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  function animateCount(el, value, suffix = "") {
    if (!el) return;
    const target = Number(value) || 0;
    if (reduce || target <= 0) {
      el.textContent = `${target.toLocaleString()}${suffix}`;
      return;
    }
    const duration = 700;
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (target - from) * eased);
      el.textContent = `${current.toLocaleString()}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function formatRelative(iso) {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const deltaSec = Math.round((then - Date.now()) / 1000);
    const abs = Math.abs(deltaSec);
    if (abs < 60) return relativeFmt.format(deltaSec, "second");
    if (abs < 3600) return relativeFmt.format(Math.round(deltaSec / 60), "minute");
    if (abs < 86400) return relativeFmt.format(Math.round(deltaSec / 3600), "hour");
    if (abs < 86400 * 30) return relativeFmt.format(Math.round(deltaSec / 86400), "day");
    return relativeFmt.format(Math.round(deltaSec / (86400 * 30)), "month");
  }

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

  function renderContributionMonths(calendar) {
    if (!contribMonths) return;
    contribMonths.innerHTML = "";
    contribMonths.style.gridTemplateColumns = `repeat(${calendar.weeks}, 9px)`;
    calendar.months.forEach(({ date, column }) => {
      const month = document.createElement("span");
      month.textContent = monthFmt.format(new Date(date + "T00:00:00Z"));
      month.style.gridColumnStart = String(column);
      contribMonths.appendChild(month);
    });
  }

  function currentStreakFrom(days) {
    let i = days.length - 1;
    if (i >= 0 && Number(days[i].count || 0) === 0) i -= 1;
    let streak = 0;
    for (; i >= 0; i -= 1) {
      if (Number(days[i].count || 0) > 0) streak += 1;
      else break;
    }
    return streak;
  }

  async function loadRecentRepos() {
    if (!githubRecent || !githubRecentList) return;
    try {
      const res = await fetch(
        `https://api.github.com/users/${handle}/repos?sort=pushed&per_page=4&type=owner`
      );
      if (!res.ok) throw new Error("unavailable");
      const repos = await res.json();
      if (!Array.isArray(repos) || !repos.length) return;

      githubRecentList.innerHTML = "";
      repos.slice(0, 4).forEach((repo) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = repo.html_url;
        a.target = "_blank";
        a.rel = "noopener";
        const name = document.createElement("span");
        name.className = "github-recent__name";
        name.textContent = repo.name;
        const meta = document.createElement("span");
        meta.className = "github-recent__meta";
        const parts = [];
        if (repo.language) parts.push(repo.language);
        const rel = formatRelative(repo.pushed_at);
        if (rel) parts.push(rel);
        meta.textContent = parts.join(" · ");
        a.append(name, meta);
        li.appendChild(a);
        githubRecentList.appendChild(li);
      });
      githubRecent.hidden = false;
    } catch {
      /* optional enrichment */
    }
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
      const { contributionCalendar } = await import("./contribution-calendar.mjs");
      const calendar = contributionCalendar(days);

      const total = days.reduce((n, d) => n + Number(d.count || 0), 0);
      const activeDays = days.filter((day) => Number(day.count || 0) > 0).length;
      const bestDay = days.reduce(
        (best, day) => (Number(day.count || 0) > Number(best.count || 0) ? day : best),
        days[0]
      );
      let streak = 0;
      let longestStreak = 0;
      days.forEach((day) => {
        streak = Number(day.count || 0) > 0 ? streak + 1 : 0;
        longestStreak = Math.max(longestStreak, streak);
      });
      const currentStreak = currentStreakFrom(days);

      animateCount(ghTotal, total);
      animateCount(ghActiveDays, activeDays);
      animateCount(ghCurrentStreak, currentStreak, "d");
      animateCount(ghLongestStreak, longestStreak, "d");
      renderContributionMonths(calendar);

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
            : `${count.toLocaleString()} contribution${count === 1 ? "" : "s"} · ${when}`;

        const cell = document.createElement("span");
        cell.className = "contrib-day";
        cell.dataset.level = String(level);
        cell.dataset.tip = tip;
        cell.style.gridRowStart = String(calendar.cells[index].row);
        cell.style.gridColumnStart = String(calendar.cells[index].column);
        cell.style.setProperty("--delay", `${Math.min(index, 80) * 5}ms`);
        grid.appendChild(cell);
      });

      contribSkeleton?.replaceWith(grid);
      wireContribGrid(grid);
      const snapToEnd = () => {
        contribWrap.scrollLeft = contribWrap.scrollWidth;
      };
      requestAnimationFrame(() => {
        snapToEnd();
        requestAnimationFrame(snapToEnd);
      });
      window.setTimeout(snapToEnd, 120);
      if (contribMeta) {
        const bestCount = Number(bestDay.count || 0).toLocaleString();
        const bestWhen = dateFmt.format(new Date(bestDay.date + "T00:00:00Z"));
        contribMeta.textContent = `Peak day · ${bestCount} on ${bestWhen}`;
      }
      if (ghSub) {
        ghSub.textContent = `${total.toLocaleString()} contributions · last 52 weeks`;
      }
      if (ghFootCopy) {
        ghFootCopy.textContent =
          currentStreak > 0
            ? `On a ${currentStreak}-day streak. Commits, experiments, and tools in public.`
            : "Commits, experiments, and tools from public activity.";
      }
    } catch {
      contribSkeleton?.remove();
      contribMonths?.remove();
      if (contribMeta) contribMeta.textContent = "Contributions unavailable right now.";
      if (ghSub) ghSub.textContent = "Public contributions unavailable";
    } finally {
      contribWrap.setAttribute("aria-busy", "false");
    }
  }

  if (contribWrap) {
    const run = () => {
      loadContributions();
      loadRecentRepos();
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 800);
    }
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
