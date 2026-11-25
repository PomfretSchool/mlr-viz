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
  const W = 1200, H = 680, G = 600, x0 = 40, bay = (W - 2 * x0) / 7, svg = root(W, H);
  s("line", { x1: 10, x2: W - 10, y1: G, y2: G, class: "ground" }, svg);
  GROUPS.forEach((g, gi) => {
    const bx = x0 + gi * bay, cx = bx + bay / 2, F = g.comps.filter((c) => c.kind === "F").map((c) => BY_ID[c.id]);
    const A = g.comps.filter((c) => c.kind === "A").map((c) => BY_ID[c.id]);
    // foundation: three columns (one per foundational competency), three courses (one per level)
    const cw = (bay - 4) / 3;
    F.forEach((c, ci) => { for (let L = 1; L <= 3; L++) box(svg, ctx, c, L, bx + 2 + ci * cw + 1.5, G - L * 26 + 1.5, cw - 3, 23); });
    // tower: one floor per advanced competency the student has chosen, in the order they started
    const tw = 102, tx = cx - tw / 2, base = G - 78, fh = 44;
    const built = A.filter((c) => visible(ctx, c)).sort(byFirst(ctx));
    built.forEach((c, i) => {
      const y = base - (i + 1) * (fh + 3);
      for (let L = 1; L <= 3; L++) box(svg, ctx, c, L, tx + (L - 1) * (tw / 3) + 1.5, y, tw / 3 - 3, fh);
    });
    const top = base - built.length * (fh + 3);
    const flagged = built.some((c) => ctx.st[c.id].level === 3);
    if (built.length) {
      for (let m = 0; m < 4; m++) s("rect", { x: tx + 4 + m * 26, y: top - 14, width: 16, height: 12, rx: 2, class: "merlon" }, svg);
      if (built.some((c) => ctx.st[c.id].level === 3)) {
        const done = built.filter((c) => ctx.st[c.id].level === 3).length;
        s("line", { x1: cx, x2: cx, y1: top - 14, y2: top - 58, class: "pole" }, svg);
        s("path", { d: `M${cx},${top - 58}l${18 + done * 6},8l${-18 - done * 6},8z`, fill: g.ink }, svg);
      }
    }
    if (ctx.living) {
      const room = 4 - built.length;
      for (let i = 0; i < room; i++) {
        const y = top - (flagged ? 64 : built.length ? 18 : 0) - (i + 1) * (fh + 3);
        const c = A.filter((c) => !visible(ctx, c))[i];
        s("rect", { x: tx + 1.5, y, width: tw - 3, height: fh, rx: 3, class: "u-ghost", "data-comp": c.id }, svg);
        if (i === 0) t(svg, cx, y + fh / 2 + 5, "+ room to build", { class: "ghost-label", "text-anchor": "middle" });
      }
    }
    const k = ctx.k.byGroup[g.id];
    t(svg, cx, G + 26, g.short, { class: "lab", "text-anchor": "middle" });
    t(svg, cx, G + 44, `base ${k.fDone}/3 · ${k.aDone} flag${k.aDone === 1 ? "" : "s"}`, { class: "lab-sm", "text-anchor": "middle" });
  });
  return svg;
}

/* ---------- 2. Garden ---------- */
function garden(ctx) {
  const W = 1200, H = 700, G = 380, x0 = 40, bay = (W - 2 * x0) / 7, svg = root(W, H);
  s("rect", { x: 0, y: G, width: W, height: H - G - 50, class: "soil" }, svg);
  s("line", { x1: 0, x2: W, y1: G, y2: G, class: "ground" }, svg);
  const rad = (d) => (d * Math.PI) / 180;
  function seg(c, L, p0, p1, width) {
    const u = unit(ctx, c, L);
    if (u.cls === "u-none") return;
    const cls = u.cls.replace("u-", "l-");
    s("line", { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: u.fill, "stroke-width": width, class: cls, "data-comp": c.id, "data-level": L }, svg);
    return u.cls;
  }
  GROUPS.forEach((g, gi) => {
    const cx = x0 + gi * bay + bay / 2, F = g.comps.filter((c) => c.kind === "F").map((c) => BY_ID[c.id]);
    const A = g.comps.filter((c) => c.kind === "A").map((c) => BY_ID[c.id]);
    // roots: one per foundational competency, one segment per level
    F.forEach((c, ri) => {
      const a = rad([-22, 0, 22][ri]);
      let p = [cx, G];
      for (let L = 1; L <= 3; L++) {
        const aa = a * (1 + 0.25 * L), wob = (L % 2 ? 5 : -5) * (ri - 1 || 1);
        const q = [p[0] + 52 * Math.sin(aa) + wob * 0.3, p[1] + 52 * Math.cos(aa)];
        seg(c, L, p, q, 6 - L * 1.2);
        p = q;
      }
      if (ctx.st[c.id].level === 3) s("circle", { cx: p[0], cy: p[1], r: 3.5, fill: g.ink, "data-comp": c.id }, svg);
    });
    // stalks: one per advanced competency chosen, in the order started, from the middle outward
    const slots = [-6, 8, -22, 24];
    const up = A.filter((c) => visible(ctx, c)).sort(byFirst(ctx));
    up.forEach((c, i) => {
      const a0 = rad(slots[i]);
      let p = [cx, G];
      for (let L = 1; L <= 3; L++) {
        const aa = a0 * (1 + 0.4 * L), q = [p[0] + 72 * Math.sin(aa), p[1] - 72 * Math.cos(aa)];
        const cls = seg(c, L, p, q, 3);
        if (cls === "u-earned" && L < 3) {
          const side = (L + i) % 2 ? 1 : -1, ang = (aa * 180) / Math.PI + side * 50;
          s("ellipse", { cx: q[0] + side * 9 * Math.cos(aa), cy: q[1] + side * 9 * Math.sin(aa), rx: 10, ry: 4, fill: tint(g.ink, 2), transform: `rotate(${ang} ${q[0] + side * 9 * Math.cos(aa)} ${q[1] + side * 9 * Math.sin(aa)})`, "data-comp": c.id }, svg);
        }
        if (cls === "u-earned" && L === 3) {
          for (let k = 0; k < 5; k++) { const pa = (k * 2 * Math.PI) / 5; s("circle", { cx: q[0] + 8 * Math.sin(pa), cy: q[1] - 8 * Math.cos(pa), r: 6.5, fill: g.ink, "data-comp": c.id }, svg); }
          s("circle", { cx: q[0], cy: q[1], r: 4, class: "pistil", "data-comp": c.id }, svg);
        }
        if (cls === "u-raised" || cls === "u-returned") s("circle", { cx: q[0], cy: q[1], r: 6, class: cls, "data-comp": c.id }, svg);
        if (cls !== "u-earned") break;
        p = q;
      }
    });
    if (ctx.living) A.filter((c) => !visible(ctx, c)).forEach((c, i, arr) =>
      s("circle", { cx: cx - (arr.length - 1) * 9 + i * 18, cy: G + 12, r: 4, class: "seed", "data-comp": c.id }, svg));
    t(svg, cx, H - 22, g.short, { class: "lab", "text-anchor": "middle" });
  });
  t(svg, 12, G - 8, "advanced: stalks rise", { class: "lab-sm" });
  t(svg, 12, G + 22, "foundational: roots deepen", { class: "lab-sm" });
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
    note: "The 21 foundational competencies are the wall: one column each, one course per level. Each advanced competency a student chooses adds a floor to that area's tower, in the order they started it. A flag flies once a floor is complete. Dashed outlines are room to build, not gaps." },
  { id: "garden", title: "Garden", kind: "Animated growth", who: "Student", render: garden,
    note: "Roots are the foundational competencies; each grows one segment per level. Stalks are the advanced ones the student chose: leaves at Begun and Likely, a bloom at Complete. Seeds in the soil are advanced paths not yet started. Press Play to watch it grow." },
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
