/** Pomfret Learning Record — 7 areas × 7 competencies (3 foundational + 4 advanced). */
export const GROUPS = [
  {
    id: "learns",
    name: "Learns with Curiosity and Integrity",
    short: "Learns",
    ink: "#4F8BD0",
    blurb: "Authentic intellectual curiosity. A self-directed seeker of knowledge.",
    comps: [
      { id: "sys", name: "Systems & Connections", kind: "F" },
      { id: "acad", name: "Academic Conversancy", kind: "F" },
      { id: "inter", name: "Interdisciplinary Thinking", kind: "F" },
      { id: "foster", name: "Fostering Community in Learning", kind: "A" },
      { id: "extend", name: "Extended Scholarship", kind: "A" },
      { id: "trans", name: "Transformational Learning", kind: "A" },
      { id: "prof", name: "Professional Engagement", kind: "A" },
    ],
  },
  {
    id: "engages",
    name: "Engages Inclusively with the Community",
    short: "Engages",
    ink: "#6AA32E",
    blurb: "Relationship-oriented. Seeks out different perspectives as a way to learn.",
    comps: [
      { id: "posrel", name: "Positive Relationships with Adults", kind: "F" },
      { id: "chapel", name: "Chapel Program", kind: "F" },
      { id: "service", name: "Service to Others", kind: "F" },
      { id: "promotes", name: "Promotes Community Values", kind: "A" },
      { id: "bridges", name: "Building Bridges Across Differences", kind: "A" },
      { id: "hilltop", name: "Service Learning Beyond the Hilltop", kind: "A" },
      { id: "upstander", name: "Upstander", kind: "A" },
    ],
  },
  {
    id: "comms",
    name: "Communicates Purposefully",
    short: "Communicates",
    ink: "#E0A01A",
    blurb: "Exemplary speaker, writer, and presenter. Nuanced awareness of audience.",
    comps: [
      { id: "listen", name: "Active Listening", kind: "F" },
      { id: "written", name: "Written Expression", kind: "F" },
      { id: "oral", name: "Oral Presentation", kind: "F" },
      { id: "conv", name: "Conversational Leadership", kind: "A" },
      { id: "style", name: "Written Style and Substance", kind: "A" },
      { id: "analysis", name: "Analysis", kind: "A" },
      { id: "fluency", name: "Fluency in Multiple Languages", kind: "A" },
    ],
  },
  {
    id: "nav",
    name: "Navigates Challenges Strategically",
    short: "Navigates",
    ink: "#E0703C",
    blurb: "Persistence and ingenuity. Balances autonomy with resourcefulness.",
    comps: [
      { id: "problem", name: "Problem Definition", kind: "F" },
      { id: "selfk", name: "Self-Knowledge", kind: "F" },
      { id: "follow", name: "Follow-Through", kind: "F" },
      { id: "rely", name: "Self-Reliance", kind: "A" },
      { id: "resource", name: "Resourcefulness", kind: "A" },
      { id: "own", name: "Ownership", kind: "A" },
      { id: "posapp", name: "Positive Approach", kind: "A" },
    ],
  },
  {
    id: "creates",
    name: "Creates Authentically",
    short: "Creates",
    ink: "#2F9A6E",
    blurb: "Technical skill to bring an original vision to life.",
    comps: [
      { id: "tools", name: "Command of Tools / Craftsmanship", kind: "F" },
      { id: "art", name: "Artistic Expression and Design", kind: "F" },
      { id: "process", name: "Creative Process", kind: "F" },
      { id: "aesthetic", name: "Aesthetic Language", kind: "A" },
      { id: "critique", name: "Reflection and Critique", kind: "A" },
      { id: "orig", name: "Originality", kind: "A" },
      { id: "portfolio", name: "Creative Portfolio", kind: "A" },
    ],
  },
  {
    id: "leads",
    name: "Leads and Collaborates with Humility",
    short: "Leads",
    ink: "#6B82B0",
    blurb: "Reliable. High social awareness. Leadership in service of a goal.",
    comps: [
      { id: "resp", name: "Responsibility", kind: "F" },
      { id: "feedback", name: "Applying Feedback", kind: "F" },
      { id: "collab", name: "Effective Collaboration", kind: "F" },
      { id: "peer", name: "Peer Teaching", kind: "A" },
      { id: "inspire", name: "Inspiring Leadership", kind: "A" },
      { id: "cpsolve", name: "Community Problem Solving", kind: "A" },
      { id: "cohesion", name: "Team Cohesion", kind: "A" },
    ],
  },
  {
    id: "well",
    name: "Cultivates Habits of Wellbeing",
    short: "Wellbeing",
    ink: "#3A9FBE",
    blurb: "Self-compassion, balance, and resilience. Healthy choices.",
    comps: [
      { id: "aware", name: "Awareness of Wellbeing", kind: "F" },
      { id: "care", name: "Self-Care", kind: "F" },
      { id: "bounds", name: "Respecting Boundaries", kind: "F" },
      { id: "balance", name: "Balanced Priorities", kind: "A" },
      { id: "locus", name: "Internal Locus of Control", kind: "A" },
      { id: "athletics", name: "Sustained Engagement in Athletics", kind: "A" },
      { id: "adjust", name: "Adjust Habits for Wellbeing", kind: "A" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Data contract (what the platform would send)

   record = {
     student: { id, name, cls, entryYear, statement },
     comps: {
       <compId>: [                       // one entry per level the student has asked for, in order
         { level: 1|2|3,
           requested: "YYYY-MM-DD",       // student raised a hand
           returned:  "YYYY-MM-DD"|null,  // guide sent it back ("not approved yet")
           earned:    "YYYY-MM-DD"|null,  // guide approved
           evidence: [ { who: "student"|"guide", name, date, text } ] }
       ]
     }
   }
   Everything a view draws comes from stateAt(record, date). Nothing else.
--------------------------------------------------------------------------- */

export const COMPS = GROUPS.flatMap((g, gi) => g.comps.map((c, i) => ({ ...c, group: g, gi, i })));
export const BY_ID = Object.fromEntries(COMPS.map((c) => [c.id, c]));
export const LEVELS = ["Not started", "Begun", "Likely to complete", "Complete"];
export const TODAY = "2026-11-23";

const D = (iso) => Date.parse(iso + "T12:00:00Z");
export const addDays = (iso, n) => new Date(D(iso) + n * 864e5).toISOString().slice(0, 10);
export const daysBetween = (a, b) => Math.round((D(b) - D(a)) / 864e5);
export const fmt = (iso) => new Date(D(iso)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const fmtMonth = (iso) => new Date(D(iso)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function termsFor(entryYear) {
  const forms = ["Third", "Fourth", "Fifth", "Sixth"];
  const out = [];
  for (let k = 0; k < 4; k++) {
    const y = entryYear + k;
    out.push({ label: `${forms[k]} Form · Fall`, start: `${y}-09-08`, end: `${y}-11-25` });
    out.push({ label: `${forms[k]} Form · Winter`, start: `${y}-12-01`, end: `${y + 1}-02-28` });
    out.push({ label: `${forms[k]} Form · Spring`, start: `${y + 1}-03-12`, end: `${y + 1}-06-01` });
  }
  return out;
}

/** The state of every competency on a given day. */
export function stateAt(rec, date) {
  const out = {};
  for (const c of COMPS) {
    let level = 0, pending = null, first = null, last = null;
    for (const x of rec.comps[c.id] || []) {
      if (x.requested > date) break;
      first ??= x.requested;
      if (x.earned && x.earned <= date) { level = x.level; last = x.earned; continue; }
      const back = x.returned && x.returned <= date;
      pending = { level: x.level, status: back ? "returned" : "raised", since: back ? x.returned : x.requested };
      break;
    }
    out[c.id] = { level, pending, first, last };
  }
  return out;
}

export function counts(st) {
  const k = { fDone: 0, fLevels: 0, aStarted: 0, aDone: 0, aLevels: 0, raised: 0, returned: 0, byGroup: {} };
  for (const c of COMPS) {
    const s = st[c.id], g = (k.byGroup[c.group.id] ??= { fDone: 0, aStarted: 0, aDone: 0 });
    if (c.kind === "F") { k.fLevels += s.level; if (s.level === 3) { k.fDone++; g.fDone++; } }
    else { k.aLevels += s.level; if (s.level) { k.aStarted++; g.aStarted++; } if (s.level === 3) { k.aDone++; g.aDone++; } }
    if (s.pending) k[s.pending.status]++;
  }
  return k;
}

/* ---------------------------------------------------------------------------
   SYNTHETIC students. Every name, date, and line of evidence below is invented.
--------------------------------------------------------------------------- */

const PERSONAS = [
  { id: "avery", name: "Avery Lin", cls: 2027, seed: 7, adv: 14,
    likes: { creates: 5, engages: 3, leads: 2, nav: 1.5, well: 1, learns: 1, comms: 0.6 },
    statement: "I learn by building things that other people end up using." },
  { id: "riley", name: "Riley Okafor", cls: 2027, seed: 23, adv: 12,
    likes: { learns: 5, comms: 4, well: 2.5, nav: 1.2, leads: 1, engages: 0.8, creates: 0.3 },
    statement: "I want to understand how ideas connect, and say so clearly." },
  { id: "jules", name: "Jules Bennett", cls: 2028, seed: 13, adv: 9,
    likes: { leads: 4, nav: 3, engages: 2.5, well: 1.5, comms: 1, learns: 1, creates: 0.5 },
    statement: "Teams work best when everyone knows why they are there." },
  { id: "sam", name: "Sam Marquez", cls: 2029, seed: 5, adv: 6,
    likes: { well: 4, engages: 2, creates: 2, learns: 1, comms: 1, nav: 1, leads: 1 },
    statement: "Still figuring it out, and that is the fun part." },
];

const WORK = {
  learns: ["Lab write-up: pendulum systems", "History seminar: causes map", "Science fair poster", "Reading journal, term", "Independent study proposal", "Research interview with a professor"],
  engages: ["Advisor conference notes", "Chapel reflection", "Food Share Saturday log", "Affinity-space listening circle", "Town clean-up, organized", "Letter from community partner"],
  comms: ["Personal essay, revised", "Seminar listening log", "Spanish oral exam", "Op-ed for the school paper", "Capstone talk recording", "Debate round notes"],
  nav: ["Problem statement draft", "Study plan, revised mid-term", "Project timeline, kept", "Asked facilities for materials", "Reflection: a setback", "Senior project brief"],
  creates: ["Studio sketchbook", "Woodshop: joinery table", "Winter exhibition piece", "Artist statement", "Portfolio review notes", "Installed campus benches"],
  leads: ["Dorm job, winter", "Group project reflection", "Taught a shop intro", "Team captain notes", "Proctor log", "Peer tutoring sessions"],
  well: ["Sleep and practice log", "Health center check-in plan", "Season with the team", "Boundary plan for apps season", "Reflection on balance", "Mindfulness elective journal"],
};
const PRAISE = ["Looks great.", "Strong evidence, approved.", "Clear connection to the rubric.", "Nice work, this shows growth.", "Approved, thanks for the reflection."];
const NOTES = ["Close. Add a sentence on what you would change next time.", "Can you connect this to the rubric language for this level?", "Add one more piece from outside class.", "Good start; attach the actual work, not just the summary."];
const GUIDES = ["Ms. Ortiz", "Mr. Hale", "Dr. Ames"];

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generate(p) {
  const r = rng(p.seed), int = (n) => Math.floor(r() * n), any = (a) => a[int(a.length)];
  const entryYear = p.cls - 4, terms = termsFor(entryYear), first = p.name.split(" ")[0];
  const inTerm = (i) => { const t = terms[Math.min(i, terms.length - 1)]; return addDays(t.start, int(daysBetween(t.start, t.end))); };

  function build(c, term) {
    const levels = [];
    let prev = null;
    for (let L = 1; L <= 3; L++) {
      let earned = inTerm(term);
      if (prev && earned <= prev) earned = addDays(prev, 10 + int(30));
      let requested = addDays(earned, -1 - int(9));
      if (prev && requested < prev) requested = prev;
      let returned = null;
      if (r() < 0.22) { returned = addDays(requested, 4 + int(8)); earned = addDays(returned, 10 + int(25)); }
      if (requested > TODAY) break;
      const guide = any(GUIDES), title = any(WORK[c.group.id]);
      const x = { level: L, requested, returned: returned && returned <= TODAY ? returned : null, earned: earned <= TODAY ? earned : null, evidence: [] };
      x.evidence.push({ who: "student", name: first, date: requested, text: title });
      if (x.returned) {
        x.evidence.push({ who: "guide", name: guide, date: x.returned, text: any(NOTES) });
        const again = addDays(x.returned, 3 + int(6));
        if (again <= TODAY && (!x.earned || again <= x.earned)) x.evidence.push({ who: "student", name: first, date: again, text: "Revised: " + title });
      }
      if (x.earned) x.evidence.push({ who: "guide", name: guide, date: x.earned, text: any(PRAISE) });
      levels.push(x);
      if (!x.earned) break;
      prev = x.earned;
      term += 1 + (r() < 0.45) + (r() < 0.15);
    }
    return levels;
  }

  const comps = {};
  for (const c of COMPS.filter((c) => c.kind === "F")) comps[c.id] = build(c, Math.floor(r() ** 1.6 * 6));
  // advanced: the student's own choices, weighted by what they like
  let pool = COMPS.filter((c) => c.kind === "A");
  for (let n = 0; n < p.adv && pool.length; n++) {
    const w = pool.map((c) => p.likes[c.group.id] ?? 1), tot = w.reduce((a, b) => a + b);
    let pick = r() * tot, i = 0;
    while ((pick -= w[i]) > 0) i++;
    const c = pool.splice(i, 1)[0];
    comps[c.id] = build(c, 3 + int(6));
  }
  // make sure a live record shows the review states at least once
  const live = COMPS.filter((c) => { const l = comps[c.id] || []; return l.length && l.length < 3 && l.at(-1).earned; });
  const open = Object.values(comps).flatMap((l) => l.filter((x) => !x.earned)).length;
  for (const [i, c] of live.slice(0, Math.max(0, 3 - open)).entries()) {
    const L = comps[c.id].length + 1, requested = addDays(TODAY, -2 - i * 6), title = any(WORK[c.group.id]);
    const x = { level: L, requested, returned: null, earned: null, evidence: [{ who: "student", name: first, date: requested, text: title }] };
    if (i === 1) { x.returned = addDays(requested, 4); x.evidence.push({ who: "guide", name: any(GUIDES), date: x.returned, text: any(NOTES) }); }
    comps[c.id].push(x);
  }
  return { student: { id: p.id, name: p.name, cls: p.cls, entryYear, statement: p.statement, synthetic: true }, comps, terms };
}

export const STUDENTS = PERSONAS.map(generate);
