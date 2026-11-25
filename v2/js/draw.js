const NS = "http://www.w3.org/2000/svg";
export const INK = "#1C2430";
export const MUTE = "#5A6570";
export const EMPTY = "#E6E8E3";
export const RULE = "#D0D4CC";

export function el(tag, attrs = {}, kids = []) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.setAttribute("class", v);
    else if (k === "text") n.textContent = v;
    else n.setAttribute(k, v);
  }
  for (const kid of kids) {
    if (kid != null) n.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
  }
  return n;
}

export function svgRoot(w, h, aria) {
  return el("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    height: "100%",
    role: "img",
    "aria-label": aria,
    preserveAspectRatio: "xMidYMin meet",
  });
}

export function text(x, y, str, opts = {}) {
  const { fill = INK, size = 12, anchor = "start", weight = "400", ...rest } = opts;
  return el("text", {
    x, y, fill, "font-size": size, "text-anchor": anchor, "font-weight": weight,
    "font-family": "var(--ui)",
    "dominant-baseline": rest.baseline || "alphabetic",
    text: str,
  });
}

export function levelWord(level) {
  return ["No evidence yet", "Begun", "Likely to complete", "Complete"][level] || "";
}

export function wrap2(str, max = 22) {
  if (str.length <= max) return [str];
  const target = Math.ceil(str.length / 2);
  let idx = str.indexOf(" ", target);
  if (idx < 0) idx = str.lastIndexOf(" ", target);
  if (idx < 0) return [str];
  return [str.slice(0, idx), str.slice(idx + 1)];
}

export function tooltipHtml(comp, level, extra = "") {
  const kind = comp.kind === "F" ? "Foundational" : "Advanced";
  return `<strong>${comp.name}</strong><span class="tip-meta">${comp.groupShort} · ${kind} · ${levelWord(level)}</span>${extra ? `<span class="tip-extra">${extra}</span>` : ""}`;
}

export function attachHover(node, html, ctx) {
  node.style.cursor = "pointer";
  node.addEventListener("pointerenter", () => ctx.setTip(html));
  node.addEventListener("pointerleave", () => ctx.setTip(""));
  node.addEventListener("pointermove", (e) => ctx.moveTip(e));
}

/** Three equal cells. Color = group. Fill count = Begun / Likely / Complete. */
export function meter(svg, x, y, w, h, ink, level, ctx, html) {
  const gap = Math.max(1, w * 0.04);
  const cw = (w - gap * 2) / 3;
  const g = el("g");
  for (let i = 0; i < 3; i++) {
    g.appendChild(el("rect", {
      x: x + i * (cw + gap),
      y, width: Math.max(cw, 0.5), height: h, rx: Math.min(2, h / 4),
      fill: i < level ? ink : EMPTY,
    }));
  }
  if (ctx && html) attachHover(g, html, ctx);
  svg.appendChild(g);
  return g;
}

/** Continuous bar with ticks at 1/3 and 2/3. For tiny multiples. */
export function bar(svg, x, y, w, h, ink, level) {
  svg.appendChild(el("rect", { x, y, width: w, height: h, rx: 1, fill: EMPTY }));
  if (level > 0) {
    svg.appendChild(el("rect", { x, y, width: Math.max(1, w * (level / 3)), height: h, rx: 1, fill: ink }));
  }
}

export function line(x1, y1, x2, y2, attrs) {
  return el("line", { x1, y1, x2, y2, ...attrs });
}
