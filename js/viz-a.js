import { GROUPS, PAPER, INK, MUTE, RULE, counts, LEVELS } from "./data.js";
import { el, svgRoot, text, fillFor, strokeFor, rounded, line, attachHover, tooltipHtml, wrap, wrap2 } from "./draw.js";

const W = 1200;
const H = 640;

export function renderHilltop(ctx) {
  const svg = svgRoot(W, H, "Seven towers. Foundational bricks at the base, advanced stories above.");
  const snap = ctx.snap;
  const ground = 548;
  const brickH = 52;
  const brickW = 132;
  const col = 156;
  const startX = 64;

  svg.appendChild(line(36, ground + 0.5, 1164, ground + 0.5, { stroke: RULE, "stroke-width": 1.25 }));
  svg.appendChild(text(40, 32, "Lower three bricks: the 21 expected by graduation. Upper four: optional height, a signature if they choose.", { fill: MUTE, size: 13 }));

  const plinthTop = ground - 3 * brickH;
  svg.appendChild(rounded(startX - 10, plinthTop - 6, 7 * col - 14, 3 * brickH + 12, 6, {
    fill: "#E4E9E3",
    stroke: "none",
  }));

  GROUPS.forEach((g, gi) => {
    const x = startX + gi * col;
    const found = g.comps.filter((c) => c.kind === "F");
    const adv = g.comps.filter((c) => c.kind === "A");

    found.forEach((c, i) => {
      const y = ground - (i + 1) * brickH;
      brick(svg, x, y, brickW, brickH - 5, c, snap[c.id] || 0, ctx, g);
    });

    adv.forEach((c, i) => {
      const y = ground - (3 + i + 1) * brickH - 12;
      brick(svg, x, y, brickW, brickH - 5, c, snap[c.id] || 0, ctx, g);
    });

    const lines = wrap(g.short, 12);
    lines.forEach((ln, i) => {
      svg.appendChild(text(x + brickW / 2, ground + 22 + i * 14, ln, { fill: INK, size: 13, anchor: "middle", weight: "700" }));
    });
  });

  return svg;
}

function brick(svg, x, y, w, h, comp, level, ctx, group) {
  const ink = group.ink;
  const n = rounded(x, y, w, h, 3, {
    fill: fillFor(ink, level),
    stroke: strokeFor(ink, level),
    "stroke-width": level === 3 ? 0 : 1,
  });
  attachHover(n, tooltipHtml({ ...comp, groupShort: group.short, ink }, level), ctx);
  svg.appendChild(n);
  const lines = wrap2(comp.name);
  const start = y + h / 2 - (lines.length - 1) * 6 + 4;
  lines.forEach((ln, i) => {
    svg.appendChild(text(x + w / 2, start + i * 12, ln, {
      fill: level >= 2 ? "#F4F6F3" : (level === 1 ? INK : MUTE),
      size: 9,
      anchor: "middle",
    }));
  });
}

export function renderStars(ctx) {
  const svg = svgRoot(W, H, "Seven constellations. Guide stars are foundational; outer stars are advanced.");
  svg.appendChild(text(W / 2, 36, "Guide stars (the inner three) are how a class navigates. Outer stars are where this student wandered.", {
    fill: MUTE, size: 13, anchor: "middle",
  }));

  const cx = W / 2;
  const cy = 340;
  const R = 205;

  GROUPS.forEach((g, gi) => {
    const ang = -Math.PI / 2 + (gi * 2 * Math.PI) / 7;
    const gx = cx + Math.cos(ang) * R;
    const gy = cy + Math.sin(ang) * R;
    const rot = ang + Math.PI / 2;

    const local = [
      [0, -20], [-15, 14], [15, 14],
      [-42, -6], [42, -6], [-26, -42], [26, -42],
    ];

    const pts = local.map(([lx, ly]) => {
      const rx = lx * Math.cos(rot) - ly * Math.sin(rot);
      const ry = lx * Math.sin(rot) + ly * Math.cos(rot);
      return [gx + rx, gy + ry];
    });

    const doneIdx = g.comps.map((c, i) => ((ctx.snap[c.id] || 0) >= 3 ? i : -1)).filter((i) => i >= 0);
    if (doneIdx.length >= 2) {
      const path = doneIdx.map((i, k) => `${k ? "L" : "M"} ${pts[i][0]} ${pts[i][1]}`).join(" ");
      svg.appendChild(el("path", { d: path, fill: "none", stroke: fillFor(g.ink, 2), "stroke-width": 1.25, opacity: 0.85 }));
    }

    g.comps.forEach((c, i) => {
      const [x, y] = pts[i];
      const level = ctx.snap[c.id] || 0;
      const r = c.kind === "F" ? 7.5 : 6;
      const node = el("circle", {
        cx: x, cy: y, r: level ? r : r - 1.5,
        fill: level ? fillFor(g.ink, level) : "transparent",
        stroke: level ? g.ink : RULE,
        "stroke-width": level === 3 ? 0 : 1.2,
      });
      attachHover(node, tooltipHtml({ ...c, groupShort: g.short, ink: g.ink }, level), ctx);
      svg.appendChild(node);
    });

    const lx = cx + Math.cos(ang) * (R + 78);
    const ly = cy + Math.sin(ang) * (R + 78);
    svg.appendChild(text(lx, ly, g.short, { fill: g.ink, size: 12, anchor: "middle", weight: "700" }));
  });

  svg.appendChild(text(cx, cy + 4, "Portrait", { fill: MUTE, size: 12, anchor: "middle" }));
  return svg;
}

export function renderProfile(ctx) {
  const svg = svgRoot(W, H, "Seven bullet graphs. Foundational has a target of three. Advanced has no ceiling.");
  svg.appendChild(text(72, 36, "Foundational has a destination (3 of 3). Advanced is a count, not a percent — there is no ‘behind.’", {
    fill: MUTE, size: 13,
  }));

  const c = counts(ctx.snap);
  svg.appendChild(text(72, 62, `${c.fDone} of 21 foundational complete. ${c.aDone} advanced complete. ${c.inMotion} in motion.`, {
    fill: INK, size: 14, weight: "700",
  }));

  GROUPS.forEach((g, gi) => {
    const y = 100 + gi * 72;
    svg.appendChild(text(72, y + 14, g.short, { fill: INK, size: 14, weight: "700" }));

    const fComps = g.comps.filter((c) => c.kind === "F");
    const aComps = g.comps.filter((c) => c.kind === "A");
    const fDone = fComps.filter((c) => ctx.snap[c.id] === 3).length;
    const aDone = aComps.filter((c) => ctx.snap[c.id] === 3).length;

    const fx = 240;
    const fw = 360;
    svg.appendChild(rounded(fx, y, fw, 18, 2, { fill: "#E4E8E4" }));
    svg.appendChild(rounded(fx, y, (fDone / 3) * fw, 18, 2, { fill: g.ink }));
    svg.appendChild(line(fx + fw, y - 4, fx + fw, y + 22, { stroke: INK, "stroke-width": 2 }));
    svg.appendChild(text(fx, y - 8, "Foundational", { fill: MUTE, size: 10 }));
    svg.appendChild(text(fx + fw + 10, y + 14, `${fDone}/3`, { fill: INK, size: 12 }));

    fComps.forEach((c, i) => {
      const px = fx + i * 22;
      const py = y + 28;
      const cell = rounded(px, py, 16, 16, 2, {
        fill: fillFor(g.ink, ctx.snap[c.id] || 0),
        stroke: strokeFor(g.ink, ctx.snap[c.id] || 0),
      });
      attachHover(cell, tooltipHtml({ ...c, groupShort: g.short }, ctx.snap[c.id] || 0), ctx);
      svg.appendChild(cell);
    });

    const ax = 720;
    const aw = 320;
    svg.appendChild(text(ax, y - 8, "Advanced (no target)", { fill: MUTE, size: 10 }));
    svg.appendChild(rounded(ax, y, aw, 18, 2, { fill: "#E4E8E4" }));
    svg.appendChild(rounded(ax, y, (aDone / 4) * aw * 0.92, 18, 2, { fill: fillFor(g.ink, 2) }));
    // open end
    svg.appendChild(el("polygon", {
      points: `${ax + aw - 2},${y} ${ax + aw + 12},${y + 9} ${ax + aw - 2},${y + 18}`,
      fill: "#E4E8E4",
    }));
    svg.appendChild(text(ax + aw + 18, y + 14, `${aDone}`, { fill: INK, size: 12 }));

    aComps.forEach((c, i) => {
      const px = ax + i * 22;
      const py = y + 28;
      const cell = rounded(px, py, 16, 16, 2, {
        fill: fillFor(g.ink, ctx.snap[c.id] || 0),
        stroke: strokeFor(g.ink, ctx.snap[c.id] || 0),
      });
      attachHover(cell, tooltipHtml({ ...c, groupShort: g.short }, ctx.snap[c.id] || 0), ctx);
      svg.appendChild(cell);
    });
  });

  return svg;
}

export function renderMatrix(ctx) {
  const svg = svgRoot(W, H, "A 7 by 7 matrix of competencies. Left three columns foundational, right four advanced.");
  svg.appendChild(text(48, 34, "All 49, one screen. The current list without the scroll. Empty is paper, not a deficit.", {
    fill: MUTE, size: 13,
  }));

  svg.appendChild(text(250, 68, "Foundational", { fill: MUTE, size: 12, anchor: "middle" }));
  svg.appendChild(text(250 + 3 * 52 + 18 + 2 * 52, 68, "Advanced", { fill: MUTE, size: 12, anchor: "middle" }));

  const x0 = 250;
  const y0 = 88;
  const s = 44;
  const gap = 8;

  GROUPS.forEach((g, gi) => {
    const y = y0 + gi * (s + gap);
    wrap(g.short, 14).forEach((ln, i) => {
      svg.appendChild(text(232, y + 18 + i * 12, ln, { fill: INK, size: 13, anchor: "end", weight: "700" }));
    });

    g.comps.forEach((c, ci) => {
      const extra = c.kind === "A" ? 16 : 0;
      const x = x0 + ci * (s + 6) + extra;
      const level = ctx.snap[c.id] || 0;
      const cell = rounded(x, y, s, s, 5, {
        fill: fillFor(g.ink, level),
        stroke: strokeFor(g.ink, level),
        "stroke-width": 1,
      });
      attachHover(cell, tooltipHtml({ ...c, groupShort: g.short }, level), ctx);
      svg.appendChild(cell);
    });
  });

  svg.appendChild(line(x0 + 3 * (s + 6) - 3, y0 - 8, x0 + 3 * (s + 6) - 3, y0 + 7 * (s + gap) - gap + 8, {
    stroke: RULE, "stroke-width": 1,
  }));

  LEVELS.forEach((lv, i) => {
    const x = 920;
    const y = 120 + i * 36;
    svg.appendChild(rounded(x, y, 28, 28, 4, {
      fill: fillFor(GROUPS[0].ink, lv.id),
      stroke: strokeFor(GROUPS[0].ink, lv.id),
    }));
    svg.appendChild(text(x + 36, y + 19, lv.name, { fill: INK, size: 13 }));
  });
  svg.appendChild(text(920, 280, "Same four states as today.", { fill: MUTE, size: 11 }));
  svg.appendChild(text(920, 320, "Left of the rule: expected", { fill: MUTE, size: 11 }));
  svg.appendChild(text(920, 336, "by graduation.", { fill: MUTE, size: 11 }));
  svg.appendChild(text(920, 364, "Right of the rule: optional", { fill: MUTE, size: 11 }));
  svg.appendChild(text(920, 380, "depth, a signature.", { fill: MUTE, size: 11 }));

  return svg;
}

export function renderRings(ctx) {
  const svg = svgRoot(W, H, "Seven growth rings. Equal band thickness so area does not lie.");
  svg.appendChild(text(W / 2, 36, "Equal band thickness — not equal area. We are not encoding with πr². Inner three bands are foundational.", {
    fill: MUTE, size: 13, anchor: "middle",
  }));

  GROUPS.forEach((g, gi) => {
    const cx = 92 + gi * 158 + 70;
    const cy = 320;
    // draw outer (advanced) first so inner sits on top; actually concentric from inside
    g.comps.forEach((c, i) => {
      const r = 18 + i * 14;
      const level = ctx.snap[c.id] || 0;
      const start = -Math.PI * 0.85;
      const end = Math.PI * 0.85;
      const arc = describeArc(cx, cy, r, start, end);
      const node = el("path", {
        d: arc,
        fill: "none",
        stroke: level ? fillFor(g.ink, level) : RULE,
        "stroke-width": 11,
        "stroke-linecap": "butt",
        opacity: level ? 1 : 0.55,
      });
      attachHover(node, tooltipHtml({ ...c, groupShort: g.short }, level), ctx);
      svg.appendChild(node);
      if (i === 2) {
        // faint tick between F and A
        const tick = describeArc(cx, cy, r + 7, start, end);
        svg.appendChild(el("path", { d: tick, fill: "none", stroke: PAPER, "stroke-width": 2 }));
      }
    });
    svg.appendChild(text(cx, 560, g.short, { fill: INK, size: 12, anchor: "middle", weight: "700" }));
  });
  return svg;
}

function describeArc(cx, cy, r, start, end) {
  const p0 = [cx + Math.cos(start) * r, cy + Math.sin(start) * r];
  const p1 = [cx + Math.cos(end) * r, cy + Math.sin(end) * r];
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} 1 ${p1[0]} ${p1[1]}`;
}

export function paintMiniHill(svg, x, y, w, h, snap, inkDim = false) {
  const bw = (w - 6) / 7;
  GROUPS.forEach((g, gi) => {
    const found = g.comps.filter((c) => c.kind === "F");
    const adv = g.comps.filter((c) => c.kind === "A");
    const bh = (h - 6) / 8;
    found.forEach((c, i) => {
      const level = snap[c.id] || 0;
      svg.appendChild(el("rect", {
        x: x + gi * bw + 1,
        y: y + h - (i + 1) * bh,
        width: bw - 2,
        height: bh - 1,
        fill: level ? fillFor(g.ink, level) : (inkDim ? "#E4E8E4" : "transparent"),
        stroke: level ? "none" : RULE,
        "stroke-width": 0.5,
      }));
    });
    adv.forEach((c, i) => {
      const level = snap[c.id] || 0;
      svg.appendChild(el("rect", {
        x: x + gi * bw + 1,
        y: y + h - (4 + i + 1) * bh,
        width: bw - 2,
        height: bh - 1,
        fill: level ? fillFor(g.ink, level) : (inkDim ? "#EEF1EE" : "transparent"),
        stroke: level ? "none" : RULE,
        "stroke-width": 0.4,
      }));
    });
  });
}
