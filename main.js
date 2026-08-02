/**
 * Portfolio — router schematic + deploy stamp
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const graphEl = document.getElementById("graph");
  const capFoot = document.getElementById("graph-foot");

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
    if (capFoot) {
      capFoot.innerHTML = `→ /v1/chat/completions · routed → <strong>${active.name}</strong> · ${ms}ms`;
    }
  }

  function tick() {
    pulseStep += 1;
    const active = paths[activeIdx];
    if (pulseStep > active.path.length + 4) {
      pulseStep = 0;
      activeIdx = (activeIdx + 1) % paths.length;
    }
    renderGraph();
  }

  if (graphEl && !reduce) {
    renderGraph();
    setInterval(tick, 95);
  } else if (graphEl) {
    pulseStep = 999;
    activeIdx = 0;
    renderGraph();
  }

  const deploy = document.getElementById("deploy-date");
  if (deploy) deploy.textContent = new Date().toISOString().slice(0, 10);
})();
