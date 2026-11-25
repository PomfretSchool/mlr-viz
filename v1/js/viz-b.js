import { GROUPS, COMPS, TERMS, PAPER, INK, MUTE, RULE, GOLD, NAVY, counts, jordanPlate, LEVELS, COMP_BY_ID } from "./data.js";
import { el, svgRoot, text, fillFor, strokeFor, rounded, line, attachHover, tooltipHtml, wrap } from "./draw.js";
import { paintMiniHill } from "./viz-a.js";

const W = 1200;
const H = 640;

export function renderYears(ctx) {
  const svg = svgRoot(W, H, "Eleven term snapshots from third-form fall through senior winter.");
  const plates = jordanPlate();
  const idx = ctx.termIndex ?? plates.length - 1;
  const cur = plates[idx];
  const c = counts(cur.snap);

  svg.appendChild(text(48, 32, "Jordan Hale, Class of 2027 — every term-end from arrival to senior winter.", {
    fill: MUTE, size: 13,
  }));
  svg.appendChild(text(48, 58, cur.label, { fill: INK, size: 22, weight: "700", family: "var(--display)" }));
  svg.appendChild(text(48, 82, cur.note, { fill: INK, size: 14 }));
  svg.appendChild(text(1152, 58, `${c.fDone} / 21 foundational`, { fill: INK, size: 13, anchor: "end" }));
  svg.appendChild(text(1152, 78, `${c.aDone} advanced complete`, { fill: MUTE, size: 13, anchor: "end" }));

  // cumulative lines
  const lx0 = 48, lx1 = 1152, ly0 = 210, ly1 = 118;
  svg.appendChild(line(lx0, ly0, lx1, ly0, { stroke: RULE, "stroke-width": 1 }));
  const fLine = [];
  const aLine = [];
  plates.forEach((p, i) => {
    const x = lx0 + (i / (plates.length - 1)) * (lx1 - lx0);
    const cc = counts(p.snap);
    const fy = ly0 - (cc.fDone / 21) * (ly0 - ly1);
    const ay = ly0 - (cc.aDone / 14) * (ly0 - ly1); // 14 as a soft visual scale, not a target
    fLine.push([x, fy]);
    aLine.push([x, ay]);
  });
  svg.appendChild(el("path", { d: toPath(fLine), fill: "none", stroke: NAVY, "stroke-width": 2 }));
  svg.appendChild(el("path", { d: toPath(aLine), fill: "none", stroke: GOLD, "stroke-width": 2 }));
  svg.appendChild(text(lx1, ly1 - 8, "foundational of 21", { fill: NAVY, size: 10, anchor: "end" }));
  svg.appendChild(text(lx1 - 160, ly1 - 8, "advanced count (no ceiling)", { fill: GOLD, size: 10, anchor: "end" }));

  // filmstrip of mini hilltops
  const fw = 92, fh = 88, fy = 248;
  plates.forEach((p, i) => {
    const x = 48 + i * 104;
    const selected = i === idx;
    svg.appendChild(rounded(x - 6, fy - 8, fw + 12, fh + 36, 6, {
      fill: selected ? "#E7EDE4" : "transparent",
      stroke: selected ? GOLD : "transparent",
      "stroke-width": 1.5,
    }));
    paintMiniHill(svg, x, fy, fw, fh, p.snap);
    svg.appendChild(text(x + fw / 2, fy + fh + 18, p.short, {
      fill: selected ? INK : MUTE, size: 10, anchor: "middle", weight: selected ? "700" : "400",
    }));
    const hit = rounded(x - 6, fy - 8, fw + 12, fh + 36, 6, { fill: "transparent", stroke: "none" });
    hit.style.cursor = "pointer";
    hit.addEventListener("click", () => ctx.setTerm(i));
    svg.appendChild(hit);
  });

  // larger selected hilltop + events this term
  paintMiniHill(svg, 48, 400, 420, 200, cur.snap);
  svg.appendChild(text(500, 418, "Evidence this term", { fill: MUTE, size: 12 }));
  cur.earnedThis.slice(0, 10).forEach((ev, i) => {
    const comp = COMP_BY_ID[ev.comp];
    const y = 444 + i * 18;
    svg.appendChild(el("circle", { cx: 508, cy: y - 4, r: 4, fill: fillFor(comp.ink, ev.level) }));
    svg.appendChild(text(520, y, `${comp.name} · ${ev.title}`, { fill: INK, size: 12 }));
  });
  if (cur.earnedThis.length > 10) {
    svg.appendChild(text(520, 444 + 10 * 18, `+ ${cur.earnedThis.length - 10} more`, { fill: MUTE, size: 12 }));
  }

  return svg;
}

function toPath(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
}

export function renderPath(ctx) {
  const svg = svgRoot(W, H, "A shared path of 21 foundational stones with optional side trails.");
  svg.appendChild(text(W / 2, 32, "Everyone walks the loop. Trails are choice. A long trail is a strength, not extra credit toward a total.", {
    fill: MUTE, size: 13, anchor: "middle",
  }));

  const cx = 600, cy = 340, a = 340, b = 210;
  const fComps = COMPS.filter((c) => c.kind === "F");

  // loop
  svg.appendChild(el("ellipse", {
    cx, cy, rx: a, ry: b,
    fill: "none", stroke: RULE, "stroke-width": 1.5,
  }));

  const fPts = fComps.map((c, i) => {
    const t = -Math.PI / 2 + (i / fComps.length) * Math.PI * 2;
    return { c, x: cx + Math.cos(t) * a, y: cy + Math.sin(t) * b, t };
  });

  // advanced trails from group centroids
  GROUPS.forEach((g) => {
    const members = fPts.filter((p) => p.c.group === g.id);
    const mx = members.reduce((s, p) => s + p.x, 0) / members.length;
    const my = members.reduce((s, p) => s + p.y, 0) / members.length;
    const vx = mx - cx, vy = my - cy;
    const mag = Math.hypot(vx, vy) || 1;
    const ux = vx / mag, uy = vy / mag;
    const adv = g.comps.filter((c) => c.kind === "A");
    adv.forEach((c, i) => {
      const d = 28 + i * 22;
      const x = mx + ux * d;
      const y = my + uy * d;
      if (i === 0) svg.appendChild(line(mx, my, x, y, { stroke: RULE, "stroke-width": 1 }));
      else {
        const prevD = 28 + (i - 1) * 22;
        svg.appendChild(line(mx + ux * prevD, my + uy * prevD, x, y, { stroke: RULE, "stroke-width": 1 }));
      }
      const level = ctx.snap[c.id] || 0;
      const node = el("circle", {
        cx: x, cy: y, r: 7,
        fill: level ? fillFor(g.ink, level) : PAPER,
        stroke: level ? g.ink : RULE,
        "stroke-width": 1.1,
      });
      attachHover(node, tooltipHtml({ ...c, groupShort: g.short }, level), ctx);
      svg.appendChild(node);
    });
  });

  fPts.forEach((p) => {
    const g = GROUPS.find((x) => x.id === p.c.group);
    const level = ctx.snap[p.c.id] || 0;
    const node = el("circle", {
      cx: p.x, cy: p.y, r: 11,
      fill: level ? fillFor(g.ink, level) : PAPER,
      stroke: level ? g.ink : g.ink,
      "stroke-width": level ? 1.5 : 1.2,
      opacity: level ? 1 : 0.55,
    });
    attachHover(node, tooltipHtml({ ...p.c, groupShort: g.short }, level), ctx);
    svg.appendChild(node);
  });

  svg.appendChild(text(cx, cy - 8, "the 21", { fill: MUTE, size: 12, anchor: "middle" }));
  svg.appendChild(text(cx, cy + 10, "shared path", { fill: MUTE, size: 12, anchor: "middle" }));
  return svg;
}

export function renderWaffle(ctx) {
  const svg = svgRoot(W, H, "Two waffles: 21 asked of everyone, 28 that become a signature.");
  svg.appendChild(text(80, 40, "Asked of everyone", { fill: INK, size: 20, weight: "700", family: "var(--display)" }));
  svg.appendChild(text(80, 64, "21 foundational. A graduation hope, not a race.", { fill: MUTE, size: 13 }));
  svg.appendChild(text(680, 40, "A signature, if they choose", { fill: INK, size: 20, weight: "700", family: "var(--display)" }));
  svg.appendChild(text(680, 64, "28 advanced. Count them. Do not percent them.", { fill: MUTE, size: 13 }));

  const s = 48;
  GROUPS.forEach((g, gi) => {
    const f = g.comps.filter((c) => c.kind === "F");
    f.forEach((c, i) => {
      const x = 80 + i * (s + 10);
      const y = 100 + gi * (s + 14);
      const level = ctx.snap[c.id] || 0;
      const cell = rounded(x, y, s, s, 5, {
        fill: fillFor(g.ink, level),
        stroke: strokeFor(g.ink, level),
      });
      attachHover(cell, tooltipHtml({ ...c, groupShort: g.short }, level), ctx);
      svg.appendChild(cell);
    });
    svg.appendChild(text(80 + 3 * (s + 10) + 4, 100 + gi * (s + 14) + 30, g.short, { fill: MUTE, size: 12 }));

    const a = g.comps.filter((c) => c.kind === "A");
    a.forEach((c, i) => {
      const x = 680 + i * (s + 10);
      const y = 100 + gi * (s + 14);
      const level = ctx.snap[c.id] || 0;
      const cell = rounded(x, y, s, s, 5, {
        fill: fillFor(g.ink, level),
        stroke: strokeFor(g.ink, level),
      });
      attachHover(cell, tooltipHtml({ ...c, groupShort: g.short }, level), ctx);
      svg.appendChild(cell);
    });
  });

  const c = counts(ctx.snap);
  svg.appendChild(text(80, 600, `${c.fDone} complete`, { fill: INK, size: 14, weight: "700" }));
  svg.appendChild(text(680, 600, `${c.aDone} complete · ${c.aAny} with evidence`, { fill: INK, size: 14, weight: "700" }));
  return svg;
}

export function renderEvidence(ctx) {
  const svg = svgRoot(W, H, "Each piece of evidence in time, one lane per group.");
  const events = ctx.evidence || [];
  svg.appendChild(text(48, 32, "Evidence in time. One mark per submission. The density is the work, not a score.", {
    fill: MUTE, size: 13,
  }));

  const termIndex = Object.fromEntries(TERMS.map((t, i) => [t.id, i]));
  const maxT = Math.max(1, ...events.map((e) => termIndex[e.term] ?? 0));
  const x0 = 160, x1 = 1140;
  const y0 = 70;

  TERMS.filter((_, i) => i <= maxT).forEach((t, i, arr) => {
    const x = x0 + (i / Math.max(1, arr.length - 1)) * (x1 - x0);
    svg.appendChild(line(x, 56, x, 600, { stroke: "#E0E5E0", "stroke-width": 1 }));
    svg.appendChild(text(x, 52, t.short, { fill: MUTE, size: 10, anchor: "middle" }));
  });

  GROUPS.forEach((g, gi) => {
    const y = y0 + 28 + gi * 74;
    svg.appendChild(text(148, y + 6, g.short, { fill: INK, size: 13, anchor: "end", weight: "700" }));
    svg.appendChild(line(x0, y, x1, y, { stroke: RULE, "stroke-width": 1 }));
    const lane = events.filter((e) => COMP_BY_ID[e.comp].group === g.id);
    const stacked = {};
    lane.forEach((e) => {
      const ti = termIndex[e.term] ?? 0;
      const x = x0 + (ti / Math.max(1, maxT)) * (x1 - x0);
      stacked[ti] = (stacked[ti] || 0) + 1;
      const yOff = (stacked[ti] - 1) * 9;
      const comp = COMP_BY_ID[e.comp];
      const node = el("circle", {
        cx: x,
        cy: y - 6 - yOff,
        r: 5.5,
        fill: fillFor(g.ink, e.level),
        stroke: g.ink,
        "stroke-width": 0.6,
      });
      attachHover(node, tooltipHtml({ ...comp, groupShort: g.short }, e.level, e.title), ctx);
      svg.appendChild(node);
    });
  });

  svg.appendChild(text(48, 624, `${events.length} pieces of evidence on this record.`, { fill: MUTE, size: 12 }));
  return svg;
}

export function renderDoors(ctx) {
  const svg = svgRoot(W, H, "Invitations to add evidence. Doors already ajar, then the next step on the shared path.");
  const snap = ctx.snap;
  const strongest = GROUPS.map((g) => ({
    g,
    score: g.comps.reduce((s, c) => s + (snap[c.id] || 0), 0),
  })).sort((a, b) => b.score - a.score)[0];

  const inMotionF = COMPS.filter((c) => c.kind === "F" && (snap[c.id] === 1 || snap[c.id] === 2))
    .sort((a, b) => (snap[b.id] - snap[a.id]));
  const emptyFound = COMPS.filter((c) => c.kind === "F" && (snap[c.id] || 0) === 0);
  const nextFound = emptyFound.find((c) => {
    const g = GROUPS.find((x) => x.id === c.group);
    return g.comps.some((x) => (snap[x.id] || 0) > 0);
  }) || emptyFound[0];
  const further = strongest.g.comps.find((c) => c.kind === "A" && (snap[c.id] || 0) > 0 && (snap[c.id] || 0) < 3)
    || strongest.g.comps.find((c) => c.kind === "A" && (snap[c.id] || 0) < 3);

  const cards = [];
  inMotionF.slice(0, 2).forEach((c) => {
    cards.push({
      comp: c,
      kicker: "Already in motion",
      verb: "Add the next piece of evidence",
      why: `${LEVELS[snap[c.id]].name}. One more artifact could close this.`,
    });
  });
  if (further && cards.length < 3) {
    cards.push({
      comp: further,
      kicker: `Further into ${strongest.g.short}`,
      verb: "Tag later, stronger work here",
      why: "Advanced is optional. This is where their record already leans.",
    });
  }
  if (nextFound && cards.length < 3) {
    cards.push({
      comp: nextFound,
      kicker: "On the shared path",
      verb: "Open this when the work is real",
      why: "Foundational — expected by graduation, on the student’s own clock.",
    });
  }

  svg.appendChild(text(48, 36, "Doors ajar", { fill: INK, size: 22, weight: "700", family: "var(--display)" }));
  svg.appendChild(text(48, 60, "Nothing here is late. These are the nearest places to add evidence.", { fill: MUTE, size: 13 }));

  // quiet matrix
  GROUPS.forEach((g, gi) => {
    g.comps.forEach((c, ci) => {
      const extra = c.kind === "A" ? 6 : 0;
      const x = 48 + ci * 22 + extra;
      const y = 92 + gi * 22;
      const level = snap[c.id] || 0;
      const highlighted = cards.some((card) => card.comp.id === c.id);
      svg.appendChild(el("rect", {
        x, y, width: 18, height: 18, rx: 2,
        fill: fillFor(g.ink, level),
        stroke: highlighted ? INK : strokeFor(g.ink, level),
        "stroke-width": highlighted ? 1.6 : 0.8,
      }));
    });
  });

  cards.slice(0, 3).forEach((card, i) => {
    const x = 48 + i * 370;
    const y = 280;
    svg.appendChild(rounded(x, y, 350, 300, 8, { fill: PAPER, stroke: RULE, "stroke-width": 1 }));
    svg.appendChild(el("rect", { x, y, width: 8, height: 300, fill: card.comp.ink, rx: 2 }));
    svg.appendChild(text(x + 28, y + 36, card.kicker, { fill: MUTE, size: 12 }));
    wrap(card.comp.name, 22).forEach((ln, li) => {
      svg.appendChild(text(x + 28, y + 68 + li * 26, ln, { fill: INK, size: 22, weight: "700", family: "var(--display)" }));
    });
    svg.appendChild(text(x + 28, y + 140, card.comp.kind === "F" ? "Foundational" : "Advanced", { fill: MUTE, size: 12 }));
    wrap(card.why, 36).forEach((ln, li) => {
      svg.appendChild(text(x + 28, y + 172 + li * 18, ln, { fill: INK, size: 14 }));
    });
    svg.appendChild(rounded(x + 28, y + 240, 220, 36, 4, { fill: NAVY }));
    svg.appendChild(text(x + 138, y + 264, card.verb, { fill: PAPER, size: 12, anchor: "middle", weight: "700" }));
  });

  return svg;
}
