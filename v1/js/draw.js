import { PAPER } from "./data.js";

const NS = "http://www.w3.org/2000/svg";

export function el(tag, attrs = {}, kids = []) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.setAttribute("class", v);
    else if (k === "text") n.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v);
  }
  for (const kid of kids) {
    if (kid == null) continue;
    n.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
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
    preserveAspectRatio: "xMidYMid meet",
  });
}

export function text(x, y, str, opts = {}) {
  const { fill = "#1F2A3A", size = 12, anchor = "start", weight = "400", family = "var(--ui)", ...rest } = opts;
  return el("text", {
    x, y, fill, "font-size": size, "text-anchor": anchor, "font-weight": weight,
    "font-family": family, "dominant-baseline": rest.baseline || "alphabetic",
    ...Object.fromEntries(Object.entries(rest).filter(([k]) => k !== "baseline")),
    text: str,
  });
}

export function mix(hex, onto, t) {
  const a = hexToRgb(hex);
  const b = hexToRgb(onto);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

export function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Level 0 = paper (open). 1 = light wash, 2 = mid, 3 = full ink. Never red. */
export function fillFor(ink, level) {
  if (level <= 0) return "transparent";
  if (level === 1) return mix(ink, PAPER, 0.72);
  if (level === 2) return mix(ink, PAPER, 0.38);
  return ink;
}

export function strokeFor(ink, level) {
  if (level <= 0) return "#C5CDC8";
  return mix(ink, "#1F2A3A", 0.15);
}

export function levelWord(level) {
  return ["No evidence yet", "Begun", "Likely to complete", "Complete"][level] || "";
}

export function wrap(str, n = 22) {
  const words = str.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + " " + w : w;
    if (next.length > n) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export function wrap2(str) {
  if (str.length <= 22) return [str];
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

export function rounded(x, y, w, h, r, attrs) {
  return el("rect", { x, y, width: w, height: h, rx: r, ry: r, ...attrs });
}

export function line(x1, y1, x2, y2, attrs) {
  return el("line", { x1, y1, x2, y2, ...attrs });
}
