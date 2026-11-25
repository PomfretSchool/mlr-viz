import { GROUPS, COMPS, TERMS, counts, jordanPlate, COMP_BY_ID, LEVELS } from "./data.js";
import {
  el, svgRoot, text, meter, bar, line, wrap2, attachHover, tooltipHtml,
  INK, MUTE, EMPTY, RULE,
} from "./draw.js";

const W = 1400;
const H = 820;

function tip(comp, group, snap, extra) {
  return tooltipHtml({ ...comp, groupShort: group.short }, snap[comp.id] || 0, extra);
}

export function renderList(ctx) {
  const svg = svgRoot(W, H, "All 49 competencies by name, three-cell fill for Begun, Likely, Complete.");
  const colW = 192;
  const x0 = 28;
  GROUPS.forEach((g, gi) => {
    const x = x0 + gi * colW;
    svg.appendChild(text(x, 28, g.short, { fill: g.ink, size: 15, weight: "700" }));
    const fDone = g.comps.filter((c) => c.kind === "F" && ctx.snap[c.id] === 3).length;
    svg.appendChild(text(x + 168, 28, `${fDone}/3`, { fill: MUTE, size: 11, anchor: "end" }));

    g.comps.forEach((c, ci) => {
      const y = 48 + ci * 108 + (ci >= 3 ? 16 : 0);
      wrap2(c.name, 26).forEach((ln, li) => {
        svg.appendChild(text(x, y + 16 + li * 15, ln, { fill: INK, size: 13 }));
      });
      meter(svg, x, y + 52, 168, 14, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
      if (ci === 2) {
        svg.appendChild(line(x, y + 86, x + 168, y + 86, { stroke: RULE, "stroke-width": 1 }));
        svg.appendChild(text(x, y + 100, "advanced", { fill: MUTE, size: 10 }));
      }
    });
  });
  return svg;
}

export function renderMatrix(ctx) {
  const svg = svgRoot(W, H, "Seven by seven meters. Left three foundational, right four advanced.");
  const x0 = 210;
  const y0 = 56;
  const cw = 148;
  const rh = 102;

  svg.appendChild(text(x0 + cw * 1.5, 28, "Foundational", { fill: MUTE, size: 13, anchor: "middle" }));
  svg.appendChild(text(x0 + cw * 3 + 10 + cw * 2, 28, "Advanced", { fill: MUTE, size: 13, anchor: "middle" }));
  svg.appendChild(line(x0 + cw * 3 + 4, 40, x0 + cw * 3 + 4, y0 + rh * 7 - 20, { stroke: RULE, "stroke-width": 1 }));

  GROUPS.forEach((g, gi) => {
    const y = y0 + gi * rh;
    svg.appendChild(text(x0 - 16, y + 22, g.short, { fill: INK, size: 14, weight: "700", anchor: "end" }));
    g.comps.forEach((c, ci) => {
      const extra = c.kind === "A" ? 10 : 0;
      const x = x0 + ci * cw + extra;
      wrap2(c.name, 18).forEach((ln, li) => {
        svg.appendChild(text(x, y + 14 + li * 13, ln, { fill: INK, size: 11 }));
      });
      meter(svg, x, y + 44, 132, 16, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
    });
  });
  return svg;
}

export function renderHilltop(ctx) {
  const svg = svgRoot(W, H, "Seven towers. Foundational at the base, advanced above. Fill bars, not darker color.");
  const col = 188;
  const x0 = 40;
  const ground = 790;
  const rowH = 92;
  svg.appendChild(line(28, ground, 1372, ground, { stroke: RULE, "stroke-width": 1.25 }));

  GROUPS.forEach((g, gi) => {
    const x = x0 + gi * col;
    const found = g.comps.filter((c) => c.kind === "F");
    const adv = g.comps.filter((c) => c.kind === "A");

    found.forEach((c, i) => {
      const y = ground - (i + 1) * rowH;
      wrap2(c.name, 20).forEach((ln, li) => {
        svg.appendChild(text(x, y + 22 + li * 14, ln, { fill: INK, size: 12 }));
      });
      meter(svg, x, y + 56, 160, 14, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
    });
    svg.appendChild(line(x, ground - 3 * rowH - 6, x + 160, ground - 3 * rowH - 6, { stroke: RULE, "stroke-width": 1 }));

    adv.forEach((c, i) => {
      const y = ground - (4 + i) * rowH - 10;
      wrap2(c.name, 20).forEach((ln, li) => {
        svg.appendChild(text(x, y + 22 + li * 14, ln, { fill: INK, size: 12 }));
      });
      meter(svg, x, y + 56, 160, 14, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
    });
    svg.appendChild(text(x, ground + 22, g.short, { fill: INK, size: 14, weight: "700" }));
  });
  return svg;
}

export function renderProfile(ctx) {
  const svg = svgRoot(W, H, "Seven groups. Foundational fill toward 3. Advanced is a count.");
  const c = counts(ctx.snap);
  svg.appendChild(text(48, 32, `${c.fDone} of 21 foundational complete`, { fill: INK, size: 16, weight: "700" }));
  svg.appendChild(text(420, 32, `${c.aDone} advanced complete`, { fill: INK, size: 16, weight: "700" }));

  GROUPS.forEach((g, gi) => {
    const y = 64 + gi * 106;
    const fComps = g.comps.filter((c) => c.kind === "F");
    const aComps = g.comps.filter((c) => c.kind === "A");
    const fDone = fComps.filter((c) => ctx.snap[c.id] === 3).length;
    const aDone = aComps.filter((c) => ctx.snap[c.id] === 3).length;

    svg.appendChild(text(48, y + 18, g.short, { fill: INK, size: 15, weight: "700" }));

    svg.appendChild(el("rect", { x: 220, y: y, width: 420, height: 18, rx: 2, fill: EMPTY }));
    if (fDone) svg.appendChild(el("rect", { x: 220, y: y, width: (fDone / 3) * 420, height: 18, rx: 2, fill: g.ink }));
    svg.appendChild(line(640, y - 3, 640, y + 21, { stroke: INK, "stroke-width": 2 }));
    svg.appendChild(text(652, y + 15, `${fDone}/3`, { fill: INK, size: 13 }));
    fComps.forEach((c, i) => {
      meter(svg, 220 + i * 92, y + 28, 80, 10, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
      svg.appendChild(text(220 + i * 92, y + 54, wrap2(c.name, 12)[0], { fill: MUTE, size: 10 }));
    });

    svg.appendChild(el("rect", { x: 780, y: y, width: 400, height: 18, rx: 2, fill: EMPTY }));
    if (aDone) svg.appendChild(el("rect", { x: 780, y: y, width: (aDone / 4) * 360, height: 18, rx: 2, fill: g.ink }));
    svg.appendChild(text(1194, y + 15, `${aDone}`, { fill: INK, size: 13 }));
    aComps.forEach((c, i) => {
      meter(svg, 780 + i * 92, y + 28, 80, 10, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
      svg.appendChild(text(780 + i * 92, y + 54, wrap2(c.name, 12)[0], { fill: MUTE, size: 10 }));
    });
  });
  return svg;
}

export function renderYears(ctx) {
  const svg = svgRoot(W, H, "Eleven term-ends, third-form fall through senior winter.");
  const plates = jordanPlate();
  const idx = ctx.termIndex ?? plates.length - 1;
  const cur = plates[idx];

  const lx0 = 32, lx1 = 1368, ly0 = 72, ly1 = 20;
  svg.appendChild(line(lx0, ly0, lx1, ly0, { stroke: RULE, "stroke-width": 1 }));
  const fPts = [];
  const aPts = [];
  plates.forEach((p, i) => {
    const x = lx0 + (i / (plates.length - 1)) * (lx1 - lx0);
    const cc = counts(p.snap);
    fPts.push([x, ly0 - (cc.fDone / 21) * (ly0 - ly1)]);
    aPts.push([x, ly0 - (cc.aDone / 12) * (ly0 - ly1)]);
  });
  svg.appendChild(el("path", { d: fPts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" "), fill: "none", stroke: INK, "stroke-width": 2 }));
  svg.appendChild(el("path", { d: aPts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" "), fill: "none", stroke: "#A67C2A", "stroke-width": 2 }));

  plates.forEach((p, i) => {
    const x = 32 + i * 124;
    const y = 88;
    const on = i === idx;
    if (on) svg.appendChild(el("rect", { x: x - 6, y: y - 6, width: 116, height: 118, rx: 4, fill: "#F0F2EC", stroke: INK, "stroke-width": 1.25 }));
    miniGrid(svg, x, y, 104, 88, p.snap);
    svg.appendChild(text(x + 52, y + 104, p.short, { fill: on ? INK : MUTE, size: 11, anchor: "middle", weight: on ? "700" : "400" }));
    const hit = el("rect", { x: x - 6, y: y - 6, width: 116, height: 118, fill: "transparent" });
    hit.style.cursor = "pointer";
    hit.addEventListener("click", () => ctx.setTerm(i));
    svg.appendChild(hit);
  });

  GROUPS.forEach((g, gi) => {
    const x = 32 + gi * 196;
    const y = 230;
    svg.appendChild(text(x, y, g.short, { fill: g.ink, size: 13, weight: "700" }));
    g.comps.forEach((c, ci) => {
      const yy = y + 14 + ci * 70 + (ci >= 3 ? 8 : 0);
      svg.appendChild(text(x, yy + 14, wrap2(c.name, 22)[0], { fill: INK, size: 12 }));
      meter(svg, x, yy + 22, 170, 12, g.ink, cur.snap[c.id] || 0, ctx, tip(c, g, cur.snap));
    });
  });
  return svg;
}

function miniGrid(svg, x, y, w, h, snap) {
  const cw = w / 7;
  const rh = h / 7;
  GROUPS.forEach((g, gi) => {
    g.comps.forEach((c, ci) => {
      bar(svg, x + gi * cw + 1, y + ci * rh + 1, cw - 2, rh - 2, g.ink, snap[c.id] || 0);
    });
  });
}

export function renderPath(ctx) {
  const svg = svgRoot(W, H, "Shared loop of 21 foundational. Advanced as side trails.");
  const cx = 700, cy = 410, a = 380, b = 250;
  svg.appendChild(el("ellipse", { cx, cy, rx: a, ry: b, fill: "none", stroke: RULE, "stroke-width": 1.5 }));
  const fComps = COMPS.filter((c) => c.kind === "F");
  const fPts = fComps.map((c, i) => {
    const t = -Math.PI / 2 + (i / fComps.length) * Math.PI * 2;
    return { c, x: cx + Math.cos(t) * a, y: cy + Math.sin(t) * b, t };
  });

  GROUPS.forEach((g) => {
    const members = fPts.filter((p) => p.c.group === g.id);
    const mx = members.reduce((s, p) => s + p.x, 0) / members.length;
    const my = members.reduce((s, p) => s + p.y, 0) / members.length;
    const vx = mx - cx, vy = my - cy;
    const mag = Math.hypot(vx, vy) || 1;
    const ux = vx / mag, uy = vy / mag;
    g.comps.filter((c) => c.kind === "A").forEach((c, i) => {
      const d = 32 + i * 24;
      const x = mx + ux * d;
      const y = my + uy * d;
      const prev = i === 0 ? [mx, my] : [mx + ux * (32 + (i - 1) * 24), my + uy * (32 + (i - 1) * 24)];
      svg.appendChild(line(prev[0], prev[1], x, y, { stroke: RULE, "stroke-width": 1 }));
      meter(svg, x - 16, y - 5, 32, 10, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
    });
  });

  fPts.forEach((p) => {
    const g = GROUPS.find((x) => x.id === p.c.group);
    meter(svg, p.x - 22, p.y - 6, 44, 12, g.ink, ctx.snap[p.c.id] || 0, ctx, tip(p.c, g, ctx.snap));
  });
  return svg;
}

export function renderUnits(ctx) {
  const svg = svgRoot(W, H, "Twenty-one foundational, twenty-eight advanced. Same three-cell fill.");
  svg.appendChild(text(48, 36, "Foundational · 21", { fill: INK, size: 18, weight: "700" }));
  svg.appendChild(text(720, 36, "Advanced · 28", { fill: INK, size: 18, weight: "700" }));
  const c = counts(ctx.snap);
  svg.appendChild(text(48, 58, `${c.fDone} complete`, { fill: MUTE, size: 13 }));
  svg.appendChild(text(720, 58, `${c.aDone} complete`, { fill: MUTE, size: 13 }));

  GROUPS.forEach((g, gi) => {
    g.comps.filter((c) => c.kind === "F").forEach((c, i) => {
      const x = 48 + i * 210;
      const y = 88 + gi * 100;
      svg.appendChild(text(x, y + 16, wrap2(c.name, 22)[0], { fill: INK, size: 13 }));
      meter(svg, x, y + 28, 190, 16, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
    });
    g.comps.filter((c) => c.kind === "A").forEach((c, i) => {
      const x = 720 + (i % 2) * 310;
      const y = 88 + gi * 100 + Math.floor(i / 2) * 44;
      svg.appendChild(text(x, y + 14, wrap2(c.name, 24)[0], { fill: INK, size: 12 }));
      meter(svg, x, y + 22, 280, 12, g.ink, ctx.snap[c.id] || 0, ctx, tip(c, g, ctx.snap));
    });
  });
  return svg;
}

export function renderEvidence(ctx) {
  const svg = svgRoot(W, H, "Each piece of evidence by term, one lane per group.");
  const events = ctx.evidence || [];
  const termIndex = Object.fromEntries(TERMS.map((t, i) => [t.id, i]));
  const maxT = Math.max(1, ...events.map((e) => termIndex[e.term] ?? 0));
  const x0 = 150, x1 = 1360;

  TERMS.filter((_, i) => i <= maxT).forEach((t, i, arr) => {
    const x = x0 + (i / Math.max(1, arr.length - 1)) * (x1 - x0);
    svg.appendChild(line(x, 36, x, 790, { stroke: "#ECEEE8", "stroke-width": 1 }));
    svg.appendChild(text(x, 28, t.short, { fill: MUTE, size: 11, anchor: "middle" }));
  });

  GROUPS.forEach((g, gi) => {
    const y = 70 + gi * 104;
    svg.appendChild(text(140, y + 8, g.short, { fill: INK, size: 13, anchor: "end", weight: "700" }));
    svg.appendChild(line(x0, y, x1, y, { stroke: RULE, "stroke-width": 1 }));
    const lane = events.filter((e) => COMP_BY_ID[e.comp].group === g.id);
    const stacked = {};
    lane.forEach((e) => {
      const ti = termIndex[e.term] ?? 0;
      const x = x0 + (ti / Math.max(1, maxT)) * (x1 - x0);
      stacked[ti] = (stacked[ti] || 0) + 1;
      const comp = COMP_BY_ID[e.comp];
      const node = el("rect", {
        x: x - 18, y: y - 8 - (stacked[ti] - 1) * 9,
        width: 36, height: 7, rx: 1,
        fill: g.ink,
      });
      attachHover(node, tooltipHtml({ ...comp, groupShort: g.short }, e.level, e.title), ctx);
      svg.appendChild(node);
    });
  });
  svg.appendChild(text(32, 808, `${events.length} pieces of evidence`, { fill: MUTE, size: 12 }));
  return svg;
}

export function renderNext(ctx) {
  const svg = svgRoot(W, H, "Nearest competencies ready for more evidence.");
  const snap = ctx.snap;
  const strongest = GROUPS.map((g) => ({
    g, score: g.comps.reduce((s, c) => s + (snap[c.id] || 0), 0),
  })).sort((a, b) => b.score - a.score)[0];
  const inMotionF = COMPS.filter((c) => c.kind === "F" && (snap[c.id] === 1 || snap[c.id] === 2))
    .sort((a, b) => snap[b.id] - snap[a.id]);
  const emptyFound = COMPS.filter((c) => c.kind === "F" && (snap[c.id] || 0) === 0);
  const nextFound = emptyFound.find((c) => GROUPS.find((x) => x.id === c.group).comps.some((x) => (snap[x.id] || 0) > 0)) || emptyFound[0];
  const further = strongest.g.comps.find((c) => c.kind === "A" && (snap[c.id] || 0) > 0 && snap[c.id] < 3)
    || strongest.g.comps.find((c) => c.kind === "A" && (snap[c.id] || 0) < 3);

  const cards = [];
  inMotionF.slice(0, 2).forEach((c) => cards.push({
    comp: c,
    kicker: LEVELS[snap[c.id]].name,
    line: "Already in motion",
  }));
  if (further && cards.length < 3) cards.push({
    comp: further,
    kicker: strongest.g.short,
    line: "Tag later work here",
  });
  if (nextFound && cards.length < 3) cards.push({
    comp: nextFound,
    kicker: "Foundational",
    line: "On the shared path",
  });

  GROUPS.forEach((g, gi) => {
    g.comps.forEach((c, ci) => {
      const extra = c.kind === "A" ? 8 : 0;
      meter(svg, 40 + ci * 52 + extra, 36 + gi * 28, 46, 16, g.ink, snap[c.id] || 0, ctx, tip(c, g, snap));
    });
  });

  cards.slice(0, 3).forEach((card, i) => {
    const g = GROUPS.find((x) => x.id === card.comp.group);
    const x = 40 + i * 450;
    const y = 260;
    svg.appendChild(el("rect", { x, y, width: 430, height: 500, fill: "#F7F8F5", stroke: RULE }));
    svg.appendChild(el("rect", { x, y, width: 8, height: 500, fill: g.ink }));
    svg.appendChild(text(x + 28, y + 48, card.line, { fill: MUTE, size: 14 }));
    wrap2(card.comp.name, 18).forEach((ln, li) => {
      svg.appendChild(text(x + 28, y + 92 + li * 32, ln, { fill: INK, size: 26, weight: "700" }));
    });
    svg.appendChild(text(x + 28, y + 170, card.kicker, { fill: MUTE, size: 14 }));
    meter(svg, x + 28, y + 200, 360, 28, g.ink, snap[card.comp.id] || 0, ctx, tip(card.comp, g, snap));
    svg.appendChild(text(x + 28, y + 250, "Begun · Likely · Complete", { fill: MUTE, size: 12 }));
  });
  return svg;
}

export const VIZ = [
  { id: "list", title: "List", render: renderList },
  { id: "matrix", title: "Matrix", render: renderMatrix },
  { id: "hilltop", title: "Hilltop", render: renderHilltop },
  { id: "profile", title: "Profile", render: renderProfile },
  { id: "years", title: "Four years", render: renderYears },
  { id: "path", title: "Path", render: renderPath },
  { id: "units", title: "Forty-nine", render: renderUnits },
  { id: "evidence", title: "Evidence", render: renderEvidence },
  { id: "next", title: "Next", render: renderNext },
];
