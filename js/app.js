import { STUDENTS, TERMS, snapshotFor, jordanPlate, counts, GROUPS } from "./data.js";
import { VIZ } from "./viz.js";

const $ = (s) => document.querySelector(s);

const state = {
  viz: "hilltop",
  student: "jordan",
  termIndex: TERMS.length - 1,
  playing: false,
  tip: "",
};

let playTimer = null;

function currentStudent() {
  return STUDENTS.find((s) => s.id === state.student);
}

function currentTermId() {
  if (state.student === "jordan") return TERMS[state.termIndex].id;
  return currentStudent().termId;
}

function renderChrome() {
  const nav = $("#viz-nav");
  nav.innerHTML = "";
  VIZ.forEach((v) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "viz-tab" + (v.id === state.viz ? " is-on" : "");
    b.textContent = v.title;
    b.addEventListener("click", () => {
      state.viz = v.id;
      if (v.id === "years") state.student = "jordan";
      stopPlay();
      paint();
    });
    nav.appendChild(b);
  });

  const people = $("#people");
  people.innerHTML = "";
  STUDENTS.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "person" + (s.id === state.student ? " is-on" : "");
    b.innerHTML = `<span class="person-name">${s.name}</span><span class="person-meta">${s.form} · ${s.klass}</span>`;
    b.addEventListener("click", () => {
      state.student = s.id;
      if (s.id === "jordan") state.termIndex = TERMS.length - 1;
      stopPlay();
      paint();
    });
    people.appendChild(b);
  });

  const spec = VIZ.find((v) => v.id === state.viz);
  $("#rationale").innerHTML = `
    <p class="kicker">${spec.kind}</p>
    <h2>${spec.title}</h2>
    <p>${spec.rationale}</p>
    <p><strong>Good for.</strong> ${spec.good}</p>
    <p><strong>Tufte.</strong> ${spec.tufte}</p>
    <p class="motion">${spec.motion}</p>
  `;

  const st = currentStudent();
  const { snap } = snapshotFor(st, currentTermId());
  const c = counts(snap);
  $("#portrait").innerHTML = `
    <blockquote>${st.statement}</blockquote>
    <p class="pitch">${st.pitch}</p>
    <p class="counts"><b>${c.fDone}</b> of 21 foundational complete · <b>${c.aDone}</b> advanced complete · <b>${c.inMotion}</b> in motion</p>
  `;

  const scrub = $("#scrub");
  const showScrub = state.student === "jordan" || state.viz === "years";
  scrub.hidden = !showScrub;
  if (showScrub) {
    $("#term-label").textContent = TERMS[state.termIndex].label;
    $("#play").textContent = state.playing ? "Pause" : "Play four years";
  }
}

function renderViz() {
  const plate = $("#plate");
  plate.innerHTML = "";
  const spec = VIZ.find((v) => v.id === state.viz);
  const student = currentStudent();
  const termId = state.viz === "years" ? TERMS[state.termIndex].id : currentTermId();
  const { snap, evidence } = snapshotFor(
    state.viz === "years" ? STUDENTS.find((s) => s.id === "jordan") : student,
    termId
  );

  const ctx = {
    snap,
    evidence,
    student: state.viz === "years" ? STUDENTS.find((s) => s.id === "jordan") : student,
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
      const pad = 16;
      let x = e.clientX + 14;
      let y = e.clientY + 16;
      const r = tip.getBoundingClientRect();
      if (x + r.width > innerWidth - pad) x = e.clientX - r.width - 12;
      if (y + r.height > innerHeight - pad) y = e.clientY - r.height - 12;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    },
  };

  plate.appendChild(spec.render(ctx));
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
  if (state.playing) {
    stopPlay();
    paint();
    return;
  }
  state.student = "jordan";
  state.playing = true;
  if (state.termIndex >= TERMS.length - 1) state.termIndex = 0;
  paint();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ms = reduce ? 1400 : 850;
  playTimer = setInterval(() => {
    if (state.termIndex >= TERMS.length - 1) {
      stopPlay();
      paint();
      return;
    }
    state.termIndex += 1;
    paint();
  }, ms);
}

$("#play").addEventListener("click", play);
$("#term-back").addEventListener("click", () => {
  stopPlay();
  state.student = "jordan";
  state.termIndex = Math.max(0, state.termIndex - 1);
  paint();
});
$("#term-fwd").addEventListener("click", () => {
  stopPlay();
  state.student = "jordan";
  state.termIndex = Math.min(TERMS.length - 1, state.termIndex + 1);
  paint();
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  const i = VIZ.findIndex((v) => v.id === state.viz);
  if (e.key === "ArrowRight" && (e.metaKey || e.altKey)) {
    state.viz = VIZ[(i + 1) % VIZ.length].id;
    paint();
  } else if (e.key === "ArrowLeft" && (e.metaKey || e.altKey)) {
    state.viz = VIZ[(i - 1 + VIZ.length) % VIZ.length].id;
    paint();
  } else if (e.key === " ") {
    e.preventDefault();
    play();
  } else if (e.key === "1" || e.key === "2" || e.key === "3") {
    state.student = STUDENTS[+e.key - 1].id;
    stopPlay();
    paint();
  }
});

paint();
