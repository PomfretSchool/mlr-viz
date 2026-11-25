import { STUDENTS, BY_ID, LEVELS, TODAY, stateAt, counts, addDays, daysBetween, fmt } from "./data.js";
import { VIEWS, tint } from "./views.js";

const $ = (q) => document.querySelector(q);
const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const hash = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
const S = {
  view: VIEWS.some((v) => v.id === hash.v) ? hash.v : "castle",
  sid: STUDENTS.some((r) => r.student.id === hash.s) ? hash.s : "avery",
  mode: hash.m === "snapshot" ? "snapshot" : "living",
  date: TODAY, open: null, timer: null,
};
const rec = () => STUDENTS.find((r) => r.student.id === S.sid);
const startDate = () => `${rec().student.entryYear}-09-01`;

/* ---- controls ---- */
$("#student").innerHTML = STUDENTS.map((r) => `<option value="${r.student.id}">${esc(r.student.name)} · ’${String(r.student.cls).slice(2)}</option>`).join("");
$("#nav").innerHTML = VIEWS.map((v) => `<button data-v="${v.id}">${v.title}</button>`).join("");
$("#student").onchange = (e) => { S.sid = e.target.value; S.date = TODAY; S.open = null; draw(); };
$("#nav").onclick = (e) => { const v = e.target.closest("[data-v]"); if (v) { S.view = v.dataset.v; draw(); } };
document.querySelectorAll("[data-mode]").forEach((b) => (b.onclick = () => { S.mode = b.dataset.mode; draw(); }));
$("#when").oninput = (e) => { stop(); S.date = addDays(startDate(), +e.target.value); draw(); };
$("#play").onclick = () => {
  if (S.timer) return stop();
  if (S.date >= TODAY) S.date = startDate();
  $("#play").textContent = "Pause";
  S.timer = setInterval(() => {
    S.date = addDays(S.date, 6);
    if (S.date >= TODAY) { S.date = TODAY; stop(); }
    draw();
  }, 45);
};
function stop() { clearInterval(S.timer); S.timer = null; $("#play").textContent = "Play"; }

/* ---- draw ---- */
function draw() {
  const r = rec(), st = stateAt(r, S.date), k = counts(st), v = VIEWS.find((x) => x.id === S.view);
  const ctx = { rec: r, st, k, date: S.date, living: S.mode === "living" && v.id !== "onepager" };
  document.body.dataset.mode = ctx.living ? "living" : "snapshot";
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === S.view));
  document.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b.dataset.mode === S.mode));
  $("#student").value = S.sid;
  const span = daysBetween(startDate(), TODAY);
  Object.assign($("#when"), { max: span, value: daysBetween(startDate(), S.date) });
  const term = r.terms.findLast((t) => t.start <= S.date);
  $("#date").textContent = `${term ? term.label : "Before entry"} · ${fmt(S.date)}`;
  $("#title").textContent = v.title;
  $("#tags").innerHTML = `<span>${v.kind}</span><span>${v.who}</span>`;
  $("#note").textContent = v.note;
  $("#stats").innerHTML = `<b>${k.fDone}</b>/21 foundational <b>${k.aDone}</b> advanced complete <b>${k.aStarted - k.aDone}</b> underway` +
    (ctx.living ? ` <span class="pill raised">${k.raised} hand${k.raised === 1 ? "" : "s"} up</span> <span class="pill returned">${k.returned} back with notes</span>` : "");
  const stage = $("#stage");
  stage.replaceChildren(v.render(ctx));
  stage.querySelectorAll(`[data-comp="${S.open}"]`).forEach((e) => e.classList.add("sel"));
  drawer(ctx);
  location.replace(`#v=${S.view}&s=${S.sid}&m=${S.mode}`);
}

/* ---- drawer: the same story the platform's side panel tells ---- */
function drawer(ctx) {
  const d = $("#drawer");
  if (!S.open) { d.hidden = true; return; }
  const c = BY_ID[S.open], st = ctx.st[c.id], levels = (ctx.rec.comps[c.id] || []).filter((x) => x.requested <= ctx.date);
  const status = (x) => x.earned && x.earned <= ctx.date ? `<span class="chip earned">Earned ${fmt(x.earned)}</span>` :
    x.returned && x.returned <= ctx.date ? `<span class="chip returned">Back with notes</span>` : `<span class="chip raised">Hand raised</span>`;
  d.hidden = false;
  d.innerHTML = `<button class="x" aria-label="Close">×</button>
    <p class="area" style="--area:${c.group.ink}">${esc(c.group.name)}</p>
    <h2>${esc(c.name)}</h2>
    <p class="kind">${c.kind === "F" ? "Foundational · every student" : "Advanced · chosen"} · ${LEVELS[st.level]}</p>
    <div class="lv-cells">${[1, 2, 3].map((L) => `<i style="background:${st.level >= L ? tint(c.group.ink, L) : "transparent"}"></i><span>${LEVELS[L]}</span>`).join("")}</div>
    ${levels.map((x) => `<section class="lv"><header><b>${LEVELS[x.level]}</b>${status(x)}</header>
      <p class="dates">Requested ${fmt(x.requested)}${x.returned && x.returned <= ctx.date ? ` · returned ${fmt(x.returned)}` : ""}</p>
      ${x.evidence.filter((e) => e.date <= ctx.date).map((e) => `<div class="ev ${e.who}"><b>${esc(e.name)}</b> <small>${fmt(e.date)}</small><p>${esc(e.text)}</p></div>`).join("")}</section>`).join("") ||
      `<p class="hint">${c.kind === "A" ? "Not started. This one is open whenever it fits." : "No evidence yet."}</p>`}
    ${ctx.living ? `<button class="add">+ Add evidence</button><p class="hint">Prototype: the button would open the platform's evidence form.</p>` : ""}`;
  d.querySelector(".x").onclick = () => { S.open = null; draw(); };
}

/* ---- hover + click, delegated so every view gets them for free ---- */
const tip = $("#tip");
$("#stage").addEventListener("mouseover", (e) => {
  const el = e.target.closest("[data-comp]");
  if (!el) return (tip.hidden = true);
  const c = BY_ID[el.dataset.comp], st = stateAt(rec(), S.date)[c.id], L = +el.dataset.level || 0;
  const p = st.pending && S.mode === "living" ? `<br><span class="${st.pending.status}">${st.pending.status === "raised" ? "Hand raised" : "Back with notes"} for ${LEVELS[st.pending.level]}</span>` : "";
  const what = L ? `${LEVELS[L]}: ${st.level >= L ? "earned" : "not yet"}` : LEVELS[st.level];
  tip.innerHTML = `<b>${esc(c.name)}</b><br>${esc(c.group.short)} · ${c.kind === "F" ? "foundational" : "advanced"}<br>${what}${p}`;
  tip.hidden = false;
});
$("#stage").addEventListener("mousemove", (e) => { tip.style.left = e.clientX + 14 + "px"; tip.style.top = e.clientY + 14 + "px"; });
$("#stage").addEventListener("mouseleave", () => (tip.hidden = true));
$("#stage").addEventListener("click", (e) => { const el = e.target.closest("[data-comp]"); if (el) { S.open = el.dataset.comp; draw(); } });
addEventListener("keydown", (e) => { if (e.key === "Escape" && S.open) { S.open = null; draw(); } });

draw();
