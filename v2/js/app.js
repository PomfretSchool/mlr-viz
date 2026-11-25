import { STUDENTS, TERMS, snapshotFor, counts } from "./data.js";
import { VIZ } from "./viz.js";

const $ = (s) => document.querySelector(s);
const state = {
  viz: "list",
  student: "jordan",
  termIndex: TERMS.length - 1,
  playing: false,
  open: null,
};
let playTimer = null;

function student() {
  return STUDENTS.find((s) => s.id === state.student);
}
function termId() {
  return state.student === "jordan" ? TERMS[state.termIndex].id : student().termId;
}
function spec() {
  return VIZ.find((v) => v.id === state.viz);
}

function closeMenus() {
  state.open = null;
  document.querySelectorAll(".menu-list").forEach((n) => { n.hidden = true; });
  document.querySelectorAll(".crumb[aria-expanded]").forEach((n) => n.setAttribute("aria-expanded", "false"));
}

function toggleMenu(id) {
  const list = $(`#menu-${id}`);
  const on = state.open === id;
  closeMenus();
  if (!on) {
    state.open = id;
    list.hidden = false;
    $(`#crumb-${id}`).setAttribute("aria-expanded", "true");
  }
}

function renderChrome() {
  const st = student();
  const snap = snapshotFor(st, termId()).snap;
  const c = counts(snap);
  const v = spec();

  $("#crumb-student").textContent = st.name;
  $("#crumb-viz").textContent = v.title;
  const termCrumb = $("#crumb-term");
  const termWrap = $("#term-wrap");
  const showTerm = state.viz === "years" || state.student === "jordan";
  termWrap.hidden = !showTerm;
  $("#term-slash").hidden = !showTerm;
  if (showTerm) termCrumb.textContent = TERMS[state.termIndex].label;

  $("#stats").innerHTML = `<b>${c.fDone}</b> of 21 foundational · <b>${c.aDone}</b> advanced`;
  $("#play").textContent = state.playing ? "Pause" : "Play";
  $("#play").hidden = !(state.viz === "years" || state.student === "jordan");

  const sm = $("#menu-student");
  sm.innerHTML = "";
  STUDENTS.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = s.id === state.student ? "is-on" : "";
    b.textContent = `${s.name} · ${s.form}`;
    b.addEventListener("click", () => {
      state.student = s.id;
      if (s.id === "jordan") state.termIndex = TERMS.length - 1;
      else if (state.viz === "years") state.viz = "list";
      stopPlay();
      closeMenus();
      paint();
    });
    sm.appendChild(b);
  });

  const vm = $("#menu-viz");
  vm.innerHTML = "";
  VIZ.forEach((item) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = item.id === state.viz ? "is-on" : "";
    b.textContent = item.title;
    b.addEventListener("click", () => {
      state.viz = item.id;
      if (item.id === "years") state.student = "jordan";
      stopPlay();
      closeMenus();
      paint();
    });
    vm.appendChild(b);
  });

  const tm = $("#menu-term");
  tm.innerHTML = "";
  TERMS.forEach((t, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = i === state.termIndex ? "is-on" : "";
    b.textContent = t.label;
    b.addEventListener("click", () => {
      state.student = "jordan";
      state.termIndex = i;
      stopPlay();
      closeMenus();
      paint();
    });
    tm.appendChild(b);
  });
}

function renderViz() {
  const plate = $("#plate");
  plate.innerHTML = "";
  const st = student();
  const until = state.viz === "years" ? TERMS[state.termIndex].id : termId();
  const who = state.viz === "years" ? STUDENTS.find((s) => s.id === "jordan") : st;
  const { snap, evidence } = snapshotFor(who, until);
  plate.appendChild(spec().render({
    snap,
    evidence,
    student: who,
    termIndex: state.termIndex,
    setTerm(i) {
      state.termIndex = i;
      state.student = "jordan";
      stopPlay();
      paint();
    },
    setTip(html) {
      const tip = $("#tip");
      tip.innerHTML = html;
      tip.hidden = !html;
    },
    moveTip(e) {
      const tip = $("#tip");
      let x = e.clientX + 14, y = e.clientY + 16;
      const r = tip.getBoundingClientRect();
      if (x + r.width > innerWidth - 12) x = e.clientX - r.width - 12;
      if (y + r.height > innerHeight - 12) y = e.clientY - r.height - 12;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    },
  }));
}

function paint() {
  renderChrome();
  renderViz();
}

function stopPlay() {
  state.playing = false;
  if (playTimer) clearInterval(playTimer);
  playTimer = null;
}

function play() {
  if (state.playing) { stopPlay(); paint(); return; }
  state.student = "jordan";
  state.playing = true;
  if (state.termIndex >= TERMS.length - 1) state.termIndex = 0;
  paint();
  const ms = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1400 : 800;
  playTimer = setInterval(() => {
    if (state.termIndex >= TERMS.length - 1) { stopPlay(); paint(); return; }
    state.termIndex += 1;
    paint();
  }, ms);
}

$("#crumb-student").addEventListener("click", () => toggleMenu("student"));
$("#crumb-viz").addEventListener("click", () => toggleMenu("viz"));
$("#crumb-term").addEventListener("click", () => toggleMenu("term"));
$("#play").addEventListener("click", play);
document.addEventListener("click", (e) => {
  if (!e.target.closest(".crumb-menu")) closeMenus();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenus();
  if (e.target.matches("input, textarea, button")) return;
  if (e.key === " ") { e.preventDefault(); play(); }
  if (e.key === "1" || e.key === "2" || e.key === "3") {
    state.student = STUDENTS[+e.key - 1].id;
    stopPlay();
    paint();
  }
});

paint();
