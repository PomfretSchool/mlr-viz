import { GROUPS, COMPS, BY_ID, LEVELS, counts, daysBetween, fmt, fmtMonth, addDays, stateAt } from "./data.js";

/* ---------- tiny SVG kit ---------- */
const NS = "http://www.w3.org/2000/svg";
function s(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  parent?.appendChild(e);
  return e;
}
function t(parent, x, y, str, attrs = {}) { const e = s("text", { x, y, ...attrs }, parent); e.textContent = str; return e; }
function root(w, h) { return s("svg", { viewBox: `0 0 ${w} ${h}`, class: "viz", role: "img" }); }
function h(html) { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Level L of a competency rendered as a tint of the area color: 35% / 65% / 100%. */
export function tint(hex, L) {
  const f = [0, 0.35, 0.65, 1][L];
  const n = parseInt(hex.slice(1), 16), m = (v) => Math.round(255 + (v - 255) * f);
  return `rgb(${m(n >> 16)},${m((n >> 8) & 255)},${m(n & 255)})`;
}

/** What one unit (competency c, level L) looks like right now. */
function unit(ctx, c, L) {
  const st = ctx.st[c.id];
  if (st.level >= L) return { fill: tint(c.group.ink, L), cls: "u-earned" };
  if (ctx.living && st.pending?.level === L) return { cls: "u-" + st.pending.status };
  return { cls: ctx.living || c.kind === "F" ? "u-open" : "u-none" };
}
const visible = (ctx, c) => ctx.st[c.id].level > 0 || (ctx.living && ctx.st[c.id].pending);
const byFirst = (ctx) => (a, b) => (ctx.st[a.id].first || "9") < (ctx.st[b.id].first || "9") ? -1 : 1;

function box(parent, ctx, c, L, x, y, w, hh, rx = 3) {
  const u = unit(ctx, c, L);
  if (u.cls === "u-none") return;
  s("rect", { x, y, width: w, height: hh, rx, fill: u.fill, class: u.cls, "data-comp": c.id, "data-level": L }, parent);
}

function arcPath(cx, cy, r0, r1, a0, a1) {
  const p = (r, a) => `${(cx + r * Math.sin(a)).toFixed(1)},${(cy - r * Math.cos(a)).toFixed(1)}`;
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p(r1, a0)}A${r1},${r1} 0 ${big} 1 ${p(r1, a1)}L${p(r0, a1)}A${r0},${r0} 0 ${big} 0 ${p(r0, a0)}Z`;
}
function wedge(parent, ctx, c, L, cx, cy, r0, r1, a0, a1) {
  const u = unit(ctx, c, L);
  if (u.cls === "u-none") return;
  s("path", { d: arcPath(cx, cy, r0, r1, a0, a1), fill: u.fill, class: u.cls, "data-comp": c.id, "data-level": L }, parent);
}

/* ---------- 1. Castle ---------- */
function castle(ctx) {
  const W = 1200, H = 560, G = 482, x0 = 40, bay = (W - 2 * x0) / 7, svg = root(W, H);
  const row = 27, WT = G - 3 * row, tw = 108, fh = 50, fg = 4;
  s("line", { x1: 10, x2: W - 10, y1: G, y2: G, class: "ground" }, svg);
  GROUPS.forEach((g, gi) => {
    const bx = x0 + gi * bay, cx = bx + bay / 2, tx = cx - tw / 2;
    const F = g.comps.filter((c) => c.kind === "F").map((c) => BY_ID[c.id]);
    const A = g.comps.filter((c) => c.kind === "A").map((c) => BY_ID[c.id]);
    const k = ctx.k.byGroup[g.id];
    // wall: one column per foundational competency, one course per level
    const cw = (bay - 2) / 3;
    F.forEach((c, ci) => { for (let L = 1; L <= 3; L++) box(svg, ctx, c, L, bx + 1 + ci * cw + 1.5, G - L * row + 1.5, cw - 3, row - 3); });
    // a finished wall gets its battlements on either side of the tower
    if (k.fDone === 3) for (const mx of [bx + 6, bx + bay - 20]) s("rect", { x: mx, y: WT - 12, width: 14, height: 10, rx: 2, fill: tint(g.ink, 3) }, svg);
    // tower: built floors (chosen advanced competencies, in the order started), then open floors
    const built = A.filter((c) => visible(ctx, c)).sort(byFirst(ctx));
    const open = ctx.living ? A.filter((c) => !visible(ctx, c)) : [];
    const floorY = (i) => WT - 4 - (i + 1) * (fh + fg) + fg;
    built.forEach((c, i) => {
      const y = floorY(i);
      for (let L = 1; L <= 3; L++) box(svg, ctx, c, L, tx + (L - 1) * (tw / 3) + 1.5, y, tw / 3 - 3, fh);
      if (ctx.st[c.id].level === 3) s("path", { d: `M${tx + tw + 2},${y + 6}l18,7l-18,7z`, fill: g.ink, "data-comp": c.id }, svg);
    });
    open.forEach((c, j) => s("rect", { x: tx + 1.5, y: floorY(built.length + j), width: tw - 3, height: fh, rx: 3, class: "u-ghost", "data-comp": c.id }, svg));
    const n = built.length + open.length, top = floorY(n - 1);
    const maxed = A.every((c) => ctx.st[c.id].level === 3);
    if (n) {
      const roof = `M${tx - 6},${top - 4}L${cx},${top - 46}L${tx + tw + 6},${top - 4}Z`;
      if (maxed) s("path", { d: roof, fill: g.ink }, svg);
      else if (ctx.living) s("path", { d: roof, class: "u-ghost" }, svg);
      else for (let m = 0; m < 4; m++) s("rect", { x: tx + 4 + m * 28, y: top - 16, width: 16, height: 12, rx: 2, fill: tint(g.ink, 1) }, svg);
    }
    if (ctx.living && open.length) t(svg, cx, floorY(built.length) + fh / 2 + 4, `+ ${open.length} open floor${open.length === 1 ? "" : "s"}`, { class: "ghost-label", "text-anchor": "middle" });
    t(svg, cx, G + 24, g.short, { class: "lab", "text-anchor": "middle" });
    t(svg, cx, G + 42, `wall ${k.fDone}/3 · ${k.aStarted} floor${k.aStarted === 1 ? "" : "s"}`, { class: "lab-sm", "text-anchor": "middle" });
  });
  t(svg, 10, 20, "Pennant = advanced competency complete.  Roof = all four complete.", { class: "lab-sm" });
  return svg;
}

/* ---------- 2. Garden ---------- */
const bez = (p0, p1, p2, u) => [0, 1].map((i) => (1 - u) ** 2 * p0[i] + 2 * (1 - u) * u * p1[i] + u * u * p2[i]);
const tan = (p0, p1, p2, u) => Math.atan2(...[1, 0].map((i) => 2 * (1 - u) * (p1[i] - p0[i]) + 2 * u * (p2[i] - p1[i])));
function piece(p0, p1, p2, u0, u1) {
  let d = "";
  for (let k = 0; k <= 10; k++) { const p = bez(p0, p1, p2, u0 + ((u1 - u0) * k) / 10); d += (k ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1); }
  return d;
}
function garden(ctx) {
  const W = 1200, G = 330, H = G + 230, x0 = 40, bay = (W - 2 * x0) / 7, svg = root(W, H);
  s("rect", { x: 0, y: G, width: W, height: 196, class: "soil" }, svg);
  s("line", { x1: 0, x2: W, y1: G, y2: G, class: "ground" }, svg);
  // one curve per competency, cut into three pieces: one per level
  function grow(c, curve, widths) {
    let reached = 0;
    for (let L = 1; L <= 3; L++) {
      const u = unit(ctx, c, L);
      if (u.cls === "u-none") break;
      s("path", { d: piece(...curve, (L - 1) / 3, L / 3), stroke: u.fill, "stroke-width": u.cls === "u-earned" ? widths[L - 1] : 2, class: u.cls.replace("u-", "l-"), "data-comp": c.id, "data-level": L }, svg);
      if (u.cls !== "u-earned") { if (u.cls !== "u-open") s("circle", { cx: bez(...curve, L / 3)[0], cy: bez(...curve, L / 3)[1], r: 6, class: u.cls, "data-comp": c.id }, svg); break; }
      reached = L;
    }
    return reached;
  }
  GROUPS.forEach((g, gi) => {
    const cx = x0 + gi * bay + bay / 2, B = [cx, G];
    const F = g.comps.filter((c) => c.kind === "F").map((c) => BY_ID[c.id]);
    const A = g.comps.filter((c) => c.kind === "A").map((c) => BY_ID[c.id]);
    // roots: start straight down, then spread
    F.forEach((c, ri) => {
      const dx = [-62, 0, 62][ri], curve = [B, [cx + dx * 0.15, G + 70], [cx + dx, G + 160 - Math.abs(dx) * 0.25]];
      if (grow(c, curve, [5, 3.6, 2.4]) === 3) {
        const p = curve[2];
        s("circle", { cx: p[0], cy: p[1], r: 3.5, fill: g.ink, "data-comp": c.id }, svg);
      }
    });
    // stalks: start upright, lean outward; leaves at Begun and Likely, a bloom at Complete
    const slots = [[-24, 250], [26, 232], [-66, 204], [66, 190]];
    const up = A.filter((c) => visible(ctx, c)).sort(byFirst(ctx));
    up.forEach((c, i) => {
      const [dx, hgt] = slots[i], b = [cx + dx * 0.12, G], curve = [b, [cx + dx * 0.15, G - hgt * 0.55], [cx + dx, G - hgt]];
      const reached = grow(c, curve, [4, 3.4, 2.8]);
      for (let L = 1; L <= Math.min(reached, 2); L++) {
        const p = bez(...curve, L / 3 - 0.04), a = tan(...curve, L / 3), side = (L + i) % 2 ? 1 : -1;
        const lx = p[0] + side * 10 * Math.cos(a), ly = p[1] + side * 10 * Math.sin(a);
        s("ellipse", { cx: lx, cy: ly, rx: 13, ry: 5, fill: tint(g.ink, 2), transform: `rotate(${(a * 180) / Math.PI + side * 35} ${lx} ${ly})`, "data-comp": c.id }, svg);
      }
      if (reached === 3) {
        const q = curve[2];
        for (let k = 0; k < 6; k++) { const pa = (k * Math.PI) / 3; s("ellipse", { cx: q[0] + 8 * Math.sin(pa), cy: q[1] - 8 * Math.cos(pa), rx: 5.5, ry: 8, fill: g.ink, transform: `rotate(${(pa * 180) / Math.PI} ${q[0] + 8 * Math.sin(pa)} ${q[1] - 8 * Math.cos(pa)})`, "data-comp": c.id }, svg); }
        s("circle", { cx: q[0], cy: q[1], r: 4.5, class: "pistil", "data-comp": c.id }, svg);
      }
    });
    if (ctx.living) A.filter((c) => !visible(ctx, c)).forEach((c, i, arr) =>
      s("ellipse", { cx: cx - (arr.length - 1) * 10 + i * 20, cy: G + 11, rx: 5, ry: 3.5, class: "seed", "data-comp": c.id }, svg));
    t(svg, cx, H - 12, g.short, { class: "lab", "text-anchor": "middle" });
  });
  t(svg, 10, 20, "Stalks: advanced competencies chosen. Leaf = Begun, Likely. Bloom = Complete.", { class: "lab-sm" });
  t(svg, 10, G + 188, "Roots: the 21 foundational competencies, one segment per level.", { class: "lab-sm" });
  return svg;
}

/* ---------- 3. Compass (signature) ---------- */
function compass(ctx, size = 760) {
  const W = 1000, H = size, cx = W / 2, cy = H / 2 + 4, r0 = 58, step = (H / 2 - 120) / 6, rF = r0 + 3 * step, svg = root(W, H);
  const sec = (2 * Math.PI) / 7, pad = 0.05;
  s("circle", { cx, cy, r: rF + 2, class: "fline" }, svg);
  GROUPS.forEach((g, gi) => {
    const a0 = gi * sec + pad, span = sec - 2 * pad;
    g.comps.forEach((cc, i) => {
      const c = BY_ID[cc.id], F = c.kind === "F", n = F ? 3 : 4, j = F ? i : i - 3, w = span / n;
      for (let L = 1; L <= 3; L++) {
        const ra = (F ? r0 : rF + 4) + (L - 1) * step;
        wedge(svg, ctx, c, L, cx, cy, ra + 1, ra + step - 1, a0 + j * w + 0.008, a0 + (j + 1) * w - 0.008);
      }
    });
    const am = gi * sec + sec / 2, rl = rF + 3 * step + 26, x = cx + rl * Math.sin(am), y = cy - rl * Math.cos(am);
    const anchor = Math.abs(Math.sin(am)) < 0.2 ? "middle" : Math.sin(am) > 0 ? "start" : "end";
    t(svg, x, y, g.short, { class: "lab", "text-anchor": anchor });
    const k = ctx.k.byGroup[g.id];
    t(svg, x, y + 17, `${k.fDone}/3 · ${k.aDone} adv`, { class: "lab-sm", "text-anchor": anchor });
  });
  t(svg, cx, cy + 6, ctx.k.fDone + ctx.k.aDone, { class: "big", "text-anchor": "middle" });
  t(svg, cx, cy + 26, "complete", { class: "lab-sm", "text-anchor": "middle" });
  return svg;
}

/* ---------- 4. Dials ---------- */
function dials(ctx) {
  const W = 1200, H = 560, svg = root(W, H), R = 118;
  GROUPS.forEach((g, gi) => {
    const row = gi < 4 ? 0 : 1, col = row ? gi - 4 : gi, n = row ? 3 : 4;
    const cx = W / 2 + (col - (n - 1) / 2) * 280, cy = 190 + row * 270;
    const F = g.comps.filter((c) => c.kind === "F").map((c) => BY_ID[c.id]), A = g.comps.filter((c) => c.kind === "A").map((c) => BY_ID[c.id]);
    const ring = (list, ra, rb) => {
      const units = list.flatMap((c) => [1, 2, 3].map((L) => [c, L])), w = Math.PI / units.length;
      units.forEach(([c, L], k) => {
        const u = unit(ctx, c, L), a0 = -Math.PI / 2 + k * w + 0.012, a1 = a0 + w - 0.024;
        s("path", { d: arcPath(cx, cy, ra, rb, a0, a1), fill: u.fill, class: u.cls === "u-none" ? "u-track" : u.cls, "data-comp": c.id, "data-level": L }, svg);
      });
    };
    ring(F, R - 58, R - 34);
    ring(A, R - 28, R);
    const k = ctx.k.byGroup[g.id], aL = A.reduce((a, c) => a + ctx.st[c.id].level, 0);
    t(svg, cx, cy - 8, `${aL}`, { class: "big", "text-anchor": "middle" });
    t(svg, cx, cy + 10, aL === 12 ? "advanced: full" : "of 12 advanced levels", { class: "lab-sm", "text-anchor": "middle" });
    t(svg, cx, cy + 40, g.short, { class: "lab", "text-anchor": "middle" });
    t(svg, cx, cy + 58, `foundation ${k.fDone}/3`, { class: "lab-sm", "text-anchor": "middle" });
    if (aL === 12) s("path", { d: arcPath(cx, cy, R + 4, R + 7, -Math.PI / 2, Math.PI / 2), fill: g.ink }, svg);
  });
  return svg;
}

/* ---------- 5. Seasons (timeline) ---------- */
function seasons(ctx) {
  const rec = ctx.rec, W = 1200, L0 = 150, R0 = 1170, top = 110, rh = 74, H = top + 7 * rh + 40, svg = root(W, H);
  const start = `${rec.student.entryYear}-09-01`, end = `${rec.student.cls}-06-10`, span = daysBetween(start, end);
  const X = (iso) => L0 + ((R0 - L0) * daysBetween(start, iso)) / span;
  for (let k = 0; k < 4; k++) {
    const a = X(`${rec.student.entryYear + k}-09-01`), b = X(`${rec.student.entryYear + k + 1}-06-10`);
    if (k % 2 === 0) s("rect", { x: a, y: top - 14, width: b - a, height: 7 * rh + 10, class: "band" }, svg);
    t(svg, (a + b) / 2, H - 12, ["Third form", "Fourth form", "Fifth form", "Sixth form"][k], { class: "lab-sm", "text-anchor": "middle" });
  }
  // cumulative levels earned: one sparkline across the top
  const earned = Object.values(rec.comps).flat().filter((x) => x.earned && x.earned <= ctx.date).map((x) => x.earned).sort();
  const allEarned = Object.values(rec.comps).flat().filter((x) => x.earned).length || 1;
  const Y = (n) => 80 - (n / allEarned) * 60;
  let d = `M${L0},${Y(0)}`;
  earned.forEach((e, i) => { d += `H${X(e).toFixed(1)}V${Y(i + 1).toFixed(1)}`; });
  d += `H${X(ctx.date).toFixed(1)}`;
  s("path", { d, class: "spark" }, svg);
  t(svg, X(ctx.date) + 6, Y(earned.length) + 4, `${earned.length} levels earned`, { class: "lab-sm" });
  t(svg, 12, 54, "all areas", { class: "lab-sm" });
  GROUPS.forEach((g, gi) => {
    const y = top + gi * rh + rh / 2;
    s("line", { x1: L0, x2: R0, y1: y, y2: y, class: "base" }, svg);
    t(svg, 12, y + 4, g.short, { class: "lab" });
    g.comps.forEach((cc) => {
      const c = BY_ID[cc.id], up = c.kind === "A" ? -1 : 1;
      for (const x of rec.comps[c.id] || []) {
        if (x.earned && x.earned <= ctx.date) {
          const len = 6 + x.level * 7, xx = X(x.earned);
          s("line", { x1: xx, x2: xx, y1: y, y2: y + up * len, stroke: tint(g.ink, x.level), class: "tick", "data-comp": c.id, "data-level": x.level }, svg);
          if (x.level === 3) s("circle", { cx: xx, cy: y + up * len, r: 3, fill: g.ink, "data-comp": c.id }, svg);
        }
      }
      const p = ctx.st[c.id].pending;
      if (ctx.living && p) s("circle", { cx: X(p.since), cy: y, r: 5, class: "u-" + p.status, "data-comp": c.id }, svg);
    });
  });
  t(svg, L0 - 10, top + rh / 2 - 12, "advanced ▲", { class: "lab-xs", "text-anchor": "end" });
  t(svg, L0 - 10, top + rh / 2 + 20, "foundational ▼", { class: "lab-xs", "text-anchor": "end" });
  const nx = X(ctx.date);
  s("line", { x1: nx, x2: nx, y1: 20, y2: top + 7 * rh, class: "now" }, svg);
  if (ctx.date < end) s("rect", { x: nx, y: top - 14, width: R0 - nx, height: 7 * rh + 10, class: "future" }, svg);
  // crosshair
  const cross = s("g", { class: "cross", visibility: "hidden" }, svg), cl = s("line", { y1: 20, y2: top + 7 * rh }, cross), ct = t(cross, 0, 16, "", { class: "lab-sm", "text-anchor": "middle" });
  svg.addEventListener("mousemove", (e) => {
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    if (pt.x < L0 || pt.x > R0) return cross.setAttribute("visibility", "hidden");
    cross.setAttribute("visibility", "visible");
    cl.setAttribute("x1", pt.x); cl.setAttribute("x2", pt.x); ct.setAttribute("x", pt.x);
    ct.textContent = fmtMonth(addDays(start, Math.round(((pt.x - L0) / (R0 - L0)) * span)));
  });
  svg.addEventListener("mouseleave", () => cross.setAttribute("visibility", "hidden"));
  return svg;
}

/* ---------- 6. Ledger (the record, Tufte small multiples) ---------- */
function ledger(ctx) {
  const cells = (c) => [1, 2, 3].map((L) => { const u = unit(ctx, c, L); return `<i class="${u.cls}" ${u.fill ? `style="background:${u.fill}"` : ""}></i>`; }).join("");
  const row = (c) => {
    const st = ctx.st[c.id], flag = ctx.living && st.pending ? `<b class="flag ${st.pending.status}" title="${st.pending.status === "raised" ? "Raised hand" : "Back with notes"}"></b>` : "";
    return `<div class="lr" data-comp="${c.id}"><span class="nm">${esc(c.name)}</span>${flag}<span class="cells">${cells(c)}</span><span class="dt">${st.level === 3 ? fmtMonth(st.last) : ""}</span></div>`;
  };
  return h(`<div class="ledger">${GROUPS.map((g) => {
    const F = g.comps.filter((c) => c.kind === "F").map((c) => BY_ID[c.id]);
    const A = g.comps.filter((c) => c.kind === "A").map((c) => BY_ID[c.id]).filter((c) => ctx.living || ctx.st[c.id].level);
    return `<section style="--area:${g.ink}"><h3>${esc(g.name)}</h3>
      <div class="sub">Foundational</div>${F.map(row).join("")}
      <div class="sub">Advanced${ctx.living ? " · choose any" : " · chosen"}</div>${A.map(row).join("") || `<div class="lr empty">None chosen yet</div>`}</section>`;
  }).join("")}</div>`);
}

/* ---------- 7. Next moves (student) ---------- */
function nextMoves(ctx) {
  const st = ctx.st, item = (c, extra, cta) => `<button class="mv" data-comp="${c.id}" style="--area:${c.group.ink}"><span class="dot"></span><span><b>${esc(c.name)}</b><small>${extra}</small></span>${cta ? `<span class="cta">${cta}</span>` : ""}</button>`;
  if (!ctx.living) {
    const recent = COMPS.filter((c) => st[c.id].level).sort((a, b) => (st[b.id].last > st[a.id].last ? 1 : -1)).slice(0, 10);
    return h(`<div class="moves one"><section><h3>Recently earned</h3><p class="hint">Snapshot mode hides works in progress. Switch to <b>Living</b> to see next moves.</p>${recent.map((c) => item(c, `${LEVELS[st[c.id].level]} · ${fmt(st[c.id].last)}`)).join("")}</section></div>`);
  }
  const raised = COMPS.filter((c) => st[c.id].pending?.status === "raised");
  const back = COMPS.filter((c) => st[c.id].pending?.status === "returned");
  const close = COMPS.filter((c) => st[c.id].level === 2 && !st[c.id].pending);
  const doors = GROUPS.filter((g) => ctx.k.byGroup[g.id].fDone === 3).flatMap((g) => g.comps.filter((c) => c.kind === "A" && !visible(ctx, BY_ID[c.id])).slice(0, 2).map((c) => BY_ID[c.id])).slice(0, 6);
  const begun = COMPS.filter((c) => c.kind === "F" && st[c.id].level === 1 && !st[c.id].pending);
  const note = (c) => { const ev = (ctx.rec.comps[c.id] || []).find((x) => x.level === st[c.id].pending.level).evidence.filter((e) => e.who === "guide" && e.date <= ctx.date).at(-1); return ev ? `“${esc(ev.text)}” · ${esc(ev.name)}` : ""; };
  const col = (title, hint, list, f, cta) => `<section><h3>${title} <span class="n">${list.length}</span></h3><p class="hint">${hint}</p>${list.map((c) => item(c, f(c), cta)).join("") || `<p class="empty">Nothing here right now.</p>`}</section>`;
  return h(`<div class="moves">
    ${col("Back with notes", "A guide asked for one more piece. These are the quickest wins.", back, note, "Add evidence")}
    ${col("Waiting on a guide", "Your hand is up. Nothing to do but keep going.", raised, (c) => `${LEVELS[st[c.id].pending.level]} · asked ${daysBetween(st[c.id].pending.since, ctx.date)} days ago`)}
    ${col("One step from complete", "Already likely to complete. One more piece finishes it.", close, (c) => c.group.short, "Add evidence")}
    ${col(doors.length ? "Doors you've opened" : "Already moving", doors.length ? "Foundations done in these areas, so these advanced paths are open. Pick any that fit you." : "Begun. Each one needs a bit more evidence.", doors.length ? doors : begun, (c) => c.group.short, doors.length ? "Explore" : "Add evidence")}
  </div>`);
}

/* ---------- 8. Review flow (guides + platform team) ---------- */
function review(ctx) {
  const reqs = COMPS.flatMap((c) => (ctx.rec.comps[c.id] || []).filter((x) => x.requested <= ctx.date).map((x) => ({ c, ...x, earned: x.earned && x.earned <= ctx.date ? x.earned : null, returned: x.returned && x.returned <= ctx.date ? x.returned : null })));
  const done = reqs.filter((x) => x.earned), firstTime = done.filter((x) => !x.returned).length;
  const days = done.map((x) => daysBetween(x.requested, x.earned)).sort((a, b) => a - b), med = days.length ? days[Math.floor(days.length / 2)] : 0;
  const open = reqs.filter((x) => !x.earned).sort((a, b) => (a.requested < b.requested ? -1 : 1));
  const wrap = h(`<div class="review">
    <div class="tiles">
      <div><b>${reqs.length}</b><span>level requests</span></div>
      <div><b>${done.length ? Math.round((100 * firstTime) / done.length) : 0}%</b><span>approved on first look</span></div>
      <div><b>${med}</b><span>median days, request → earned</span></div>
      <div><b>${open.length}</b><span>open now</span></div>
    </div>
    <h3>Open requests</h3>
    <div class="open">${open.map((x) => { const age = daysBetween(x.requested, ctx.date); return `<div class="or" data-comp="${x.c.id}"><span class="nm">${esc(x.c.name)} <small>→ ${LEVELS[x.level]}</small></span><span class="agebar ${x.returned ? "returned" : "raised"}" style="width:${Math.min(age, 60) * 4}px"></span><small>${age} d · ${x.returned ? "back with notes" : "waiting on guide"}</small></div>`; }).join("") || `<p class="empty">No open requests.</p>`}</div>
    <h3>Every approval: days from request to earned</h3>
  </div>`);
  const W = 1100, L0 = 130, R0 = 1080, rh = 34, H = 7 * rh + 40, svg = root(W, H), X = (d) => L0 + ((R0 - L0) * Math.min(d, 60)) / 60;
  for (const d of [0, 7, 14, 30, 60]) { s("line", { x1: X(d), x2: X(d), y1: 0, y2: 7 * rh, class: "grid" }, svg); t(svg, X(d), 7 * rh + 18, d === 60 ? "60+ days" : d, { class: "lab-sm", "text-anchor": "middle" }); }
  GROUPS.forEach((g, gi) => t(svg, 0, gi * rh + rh / 2 + 4, g.short, { class: "lab" }));
  done.forEach((x, i) => {
    const y = x.c.gi * rh + rh / 2 + (((i * 7) % 5) - 2) * 4;
    s("circle", { cx: X(daysBetween(x.requested, x.earned)), cy: y, r: 4.5, fill: tint(x.c.group.ink, x.level), class: x.returned ? "dot-returned" : "", "data-comp": x.c.id }, svg);
  });
  wrap.appendChild(svg);
  wrap.appendChild(h(`<p class="hint">Ringed dots went back to the student once before approval. A tail past 30 days is where requests stall.</p>`));
  return wrap;
}

/* ---------- 9. College one-pager ---------- */
function onePager(ctx) {
  const snap = { ...ctx, living: false }, k = ctx.k, st = ctx.st;
  const strong = GROUPS.map((g) => [g, k.byGroup[g.id].aDone, k.byGroup[g.id].aStarted]).filter((x) => x[2]).sort((a, b) => b[1] - a[1] || b[2] - a[2]).slice(0, 2);
  const sentence = `${k.fDone === 21 ? "Completed all 21 foundational competencies" : `Completed ${k.fDone} of 21 foundational competencies`}` +
    (k.aDone ? ` and ${k.aDone} advanced competenc${k.aDone === 1 ? "y" : "ies"} of their choosing` : "") +
    (strong.length ? `, concentrated in ${strong.map(([g]) => g.name).join(" and ")}.` : ".");
  const wrap = h(`<div class="onepager">
    <header><div><h2>${esc(ctx.rec.student.name)}</h2><p>Class of ${ctx.rec.student.cls} · Pomfret School · record as of ${fmt(ctx.date)}</p><p class="syn">Synthetic student. All data invented.</p><br><button class="print" onclick="window.print()">Print / save PDF</button></div>
    <blockquote>“${esc(ctx.rec.student.statement)}”</blockquote></header>
    <p class="lede">${sentence}</p>
    <div class="op-grid"><div class="op-compass"></div><div class="op-strong"><h3>Advanced work, by area</h3>${GROUPS.map((g) => {
      const list = g.comps.filter((c) => c.kind === "A" && st[c.id].level === 3);
      return list.length ? `<p style="--area:${g.ink}"><b>${esc(g.short)}</b> ${list.map((c) => esc(c.name)).join(" · ")}</p>` : "";
    }).join("") || "<p>None yet.</p>"}</div></div>
  </div>`);
  wrap.querySelector(".op-compass").appendChild(compass(snap, 620));
  wrap.appendChild(ledger(snap));
  return wrap;
}

/* ---------- 10. Data contract (for the platform team) ---------- */
function contract(ctx) {
  const ex = COMPS.find((c) => (ctx.rec.comps[c.id] || []).some((x) => x.returned)) || COMPS[0];
  return h(`<div class="contract">
    <p>Every view on this page is a pure function of one record and one date. The record is what the platform already stores: one entry per level a student asks for, with three dates. Example (<b>${esc(ex.name)}</b>, ${esc(ctx.rec.student.name)}):</p>
    <pre>${esc(JSON.stringify({ [ex.id]: ctx.rec.comps[ex.id] }, null, 2))}</pre>
    <h3>Derived state (stateAt)</h3>
    <pre>level   = highest L whose earned ≤ date
pending = the next request with requested ≤ date and not yet earned
          status "returned" if returned ≤ date, else "raised"
first   = date of the first request (orders tower floors and stalks)</pre>
    <h3>What each view needs</h3>
    <ul><li><b>Castle, Garden, Compass, Dials, Ledger</b>: level + pending per competency.</li>
    <li><b>Seasons</b>: every earned date (ticks) and pending.since.</li>
    <li><b>Review flow</b>: requested / returned / earned per request.</li>
    <li><b>Next moves</b>: pending + the latest guide comment.</li></ul>
    <p>Mode <b>Living</b> shows raised hands, notes, and open room. Mode <b>Snapshot</b> draws only what is earned: the view for a college reader.</p>
  </div>`);
}

export const VIEWS = [
  { id: "castle", title: "Castle", kind: "Static + replay", who: "Student · College", render: castle,
    note: "The 21 foundational competencies are the wall: one column each, one course per level. Each advanced competency a student chooses adds a floor to that area's tower, in the order they started it, filling left to right by level. A pennant flies from each finished floor; all four finished puts the roof on. Dashed floors are open to build, not gaps." },
  { id: "garden", title: "Garden", kind: "Animated growth", who: "Student", render: garden,
    note: "Roots are the foundational competencies; each grows one segment per level. Stalks are the advanced ones the student chose: leaves at Begun and Likely, a bloom at Complete. Stalks start upright and lean out as they grow. Seeds in the soil are advanced paths not yet started. Press Play to watch the whole record grow." },
  { id: "compass", title: "Compass", kind: "Static signature", who: "College · Student", render: compass,
    note: "Inside the ring: foundational work, the same for everyone when finished. Outside the ring: advanced work, different for every student. The outer shape is the student's signature; read it for where they went deep." },
  { id: "dials", title: "Dials", kind: "Hover", who: "Student · Advisor", render: dials,
    note: "One dial per area. Inner arc: 9 foundational levels. Outer arc: 12 advanced levels. A dial that fills its outer arc gets a solid rim: that area is maxed out. Every segment is one level of one competency; hover for which." },
  { id: "seasons", title: "Seasons", kind: "Timeline + crosshair", who: "Advisor · Student", render: seasons,
    note: "Time runs left to right across four years. Each tick is a level earned: foundational below the line, advanced above, longer ticks for higher levels, a dot for complete. The top line counts every level earned. Hover to read dates." },
  { id: "ledger", title: "Ledger", kind: "Static record", who: "College · Advisor", render: ledger,
    note: "The full record in small multiples: every competency, three cells per level, month completed on the right. In Snapshot mode, unchosen advanced competencies are left out entirely." },
  { id: "next", title: "Next moves", kind: "Action list", who: "Student", render: nextMoves,
    note: "What to do next, sorted by how close each item is. Nothing here counts what is missing; it only points at what is open." },
  { id: "review", title: "Review flow", kind: "Workflow", who: "Guides · Platform team", render: review,
    note: "How level requests move through review: requests waiting now, and how long every past approval took. Ringed dots were returned once with notes." },
  { id: "onepager", title: "College one-pager", kind: "Print", who: "College", render: onePager,
    note: "A single printable page: a one-sentence summary written from the data, the compass, the advanced work by name, and the full ledger. Always drawn in Snapshot mode." },
  { id: "data", title: "Data contract", kind: "Reference", who: "Platform team", render: contract,
    note: "The record shape these views read, and the one function that derives everything else." },
];

export { counts, stateAt };
