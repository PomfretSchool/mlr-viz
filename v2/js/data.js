/** Pomfret Learning Record — 7 groups × 7 competencies. 3 foundational + 4 advanced. */

export const LEVELS = [
  { id: 0, name: "No evidence yet", short: "Open" },
  { id: 1, name: "Begun", short: "Begun" },
  { id: 2, name: "Likely to complete", short: "Likely" },
  { id: 3, name: "Complete", short: "Complete" },
];

export const TERMS = [
  { id: "3F", form: 3, season: "Fall",   year: "2023", label: "Third Form, Fall",   short: "3 Fall" },
  { id: "3W", form: 3, season: "Winter", year: "2024", label: "Third Form, Winter", short: "3 Winter" },
  { id: "3S", form: 3, season: "Spring", year: "2024", label: "Third Form, Spring", short: "3 Spring" },
  { id: "4F", form: 4, season: "Fall",   year: "2024", label: "Fourth Form, Fall",  short: "4 Fall" },
  { id: "4W", form: 4, season: "Winter", year: "2025", label: "Fourth Form, Winter",short: "4 Winter" },
  { id: "4S", form: 4, season: "Spring", year: "2025", label: "Fourth Form, Spring",short: "4 Spring" },
  { id: "5F", form: 5, season: "Fall",   year: "2025", label: "Fifth Form, Fall",   short: "5 Fall" },
  { id: "5W", form: 5, season: "Winter", year: "2026", label: "Fifth Form, Winter", short: "5 Winter" },
  { id: "5S", form: 5, season: "Spring", year: "2026", label: "Fifth Form, Spring", short: "5 Spring" },
  { id: "6F", form: 6, season: "Fall",   year: "2026", label: "Sixth Form, Fall",   short: "6 Fall" },
  { id: "6W", form: 6, season: "Winter", year: "2027", label: "Sixth Form, Winter", short: "6 Winter" },
];

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

export const COMPS = GROUPS.flatMap((g) =>
  g.comps.map((c, i) => ({ ...c, group: g.id, ink: g.ink, groupName: g.name, groupShort: g.short, index: i }))
);

export const COMP_BY_ID = Object.fromEntries(COMPS.map((c) => [c.id, c]));

export function emptySnapshot() {
  return Object.fromEntries(COMPS.map((c) => [c.id, 0]));
}

export function applyEvents(events, untilTerm = null) {
  const snap = emptySnapshot();
  const evidence = [];
  for (const ev of events) {
    if (untilTerm && TERMS.findIndex((t) => t.id === ev.term) > TERMS.findIndex((t) => t.id === untilTerm)) break;
    snap[ev.comp] = ev.level;
    evidence.push(ev);
  }
  return { snap, evidence };
}

export function counts(snap) {
  let fDone = 0, fOpen = 0, aDone = 0, aAny = 0, inMotion = 0;
  for (const c of COMPS) {
    const v = snap[c.id] || 0;
    if (c.kind === "F") {
      if (v === 3) fDone++;
      else fOpen++;
    } else {
      if (v === 3) aDone++;
      if (v > 0) aAny++;
    }
    if (v === 1 || v === 2) inMotion++;
  }
  return { fDone, fOpen, fTotal: 21, aDone, aAny, aTotal: 28, inMotion };
}

/** Each level-up is a piece of evidence with a title a guide would recognize. */
const JORDAN_EVENTS = [
  { term: "3F", comp: "posrel", level: 1, title: "Advisor letter: first weeks" },
  { term: "3F", comp: "process", level: 1, title: "Studio sketchbook, September" },
  { term: "3F", comp: "care", level: 1, title: "Health center check-in plan" },
  { term: "3F", comp: "collab", level: 1, title: "Dorm hall project" },

  { term: "3W", comp: "posrel", level: 2, title: "Winter conference with advisor" },
  { term: "3W", comp: "chapel", level: 1, title: "First chapel reflection" },
  { term: "3W", comp: "process", level: 2, title: "Still-life series" },
  { term: "3W", comp: "tools", level: 1, title: "Intro to the woodshop" },
  { term: "3W", comp: "aware", level: 1, title: "Sleep log, winter term" },

  { term: "3S", comp: "posrel", level: 3, title: "Year-end advisor narrative" },
  { term: "3S", comp: "process", level: 3, title: "Spring critique: process boards" },
  { term: "3S", comp: "tools", level: 2, title: "Small table, joinery" },
  { term: "3S", comp: "art", level: 1, title: "Observational drawing final" },
  { term: "3S", comp: "collab", level: 2, title: "Group installation in the vis arts hall" },

  { term: "4F", comp: "chapel", level: 2, title: "Chapel talk draft, revised" },
  { term: "4F", comp: "tools", level: 3, title: "Chair: full craftsmanship write-up" },
  { term: "4F", comp: "art", level: 2, title: "Color studies, fall show" },
  { term: "4F", comp: "written", level: 1, title: "English 10 personal essay" },
  { term: "4F", comp: "athletics", level: 1, title: "JV soccer, first season" },
  { term: "4F", comp: "listen", level: 1, title: "Peer critique notes" },

  { term: "4W", comp: "chapel", level: 3, title: "Delivered chapel talk" },
  { term: "4W", comp: "art", level: 3, title: "Winter exhibition piece" },
  { term: "4W", comp: "aesthetic", level: 1, title: "Artist statement, first pass" },
  { term: "4W", comp: "written", level: 2, title: "History document paper" },
  { term: "4W", comp: "listen", level: 2, title: "Seminar listening log" },
  { term: "4W", comp: "follow", level: 1, title: "Independent studio hours log" },
  { term: "4W", comp: "resp", level: 1, title: "Dorm job, winter" },

  { term: "4S", comp: "service", level: 1, title: "Saturday service, Pomfret Food Share" },
  { term: "4S", comp: "orig", level: 1, title: "Capstone idea: campus benches" },
  { term: "4S", comp: "aesthetic", level: 2, title: "Material language study" },
  { term: "4S", comp: "oral", level: 1, title: "Studio share-out" },
  { term: "4S", comp: "acad", level: 1, title: "Biology lab talk" },
  { term: "4S", comp: "resp", level: 2, title: "Proctor shadow" },
  { term: "4S", comp: "care", level: 2, title: "Revised sleep / practice plan" },

  { term: "5F", comp: "service", level: 2, title: "Ongoing Food Share lead" },
  { term: "5F", comp: "portfolio", level: 1, title: "Digital portfolio started" },
  { term: "5F", comp: "critique", level: 1, title: "Wrote three peer critiques" },
  { term: "5F", comp: "acad", level: 2, title: "English seminar, sustained" },
  { term: "5F", comp: "sys", level: 1, title: "Physics: systems model" },
  { term: "5F", comp: "collab", level: 3, title: "Fall play, run crew lead" },
  { term: "5F", comp: "athletics", level: 2, title: "Varsity soccer, full season" },
  { term: "5F", comp: "feedback", level: 1, title: "Studio feedback cycle" },

  { term: "5W", comp: "service", level: 3, title: "Service-learning reflection, complete" },
  { term: "5W", comp: "portfolio", level: 2, title: "Portfolio review with vis arts" },
  { term: "5W", comp: "orig", level: 2, title: "Bench prototypes, campus" },
  { term: "5W", comp: "acad", level: 3, title: "Winter research conversation" },
  { term: "5W", comp: "sys", level: 2, title: "History: causes and systems" },
  { term: "5W", comp: "inter", level: 1, title: "Art + ecology short paper" },
  { term: "5W", comp: "resource", level: 1, title: "Asked facilities to mill leftover oak" },
  { term: "5W", comp: "follow", level: 2, title: "Bench timeline, kept" },

  { term: "5S", comp: "promotes", level: 1, title: "Earth Day work day, organized" },
  { term: "5S", comp: "portfolio", level: 3, title: "Year-end portfolio, featured" },
  { term: "5S", comp: "orig", level: 3, title: "Three benches installed" },
  { term: "5S", comp: "aesthetic", level: 3, title: "Final artist statement" },
  { term: "5S", comp: "critique", level: 2, title: "Public critique of the install" },
  { term: "5S", comp: "sys", level: 3, title: "Capstone: material + community system" },
  { term: "5S", comp: "inter", level: 2, title: "Art / ecology / shop, braided" },
  { term: "5S", comp: "fluency", level: 1, title: "Spanish conversation hours" },
  { term: "5S", comp: "cohesion", level: 1, title: "Soccer, locker-room culture note" },
  { term: "5S", comp: "oral", level: 2, title: "Capstone presentation" },

  { term: "6F", comp: "bridges", level: 1, title: "Affinity-space listening circle" },
  { term: "6F", comp: "upstander", level: 1, title: "Intervention write-up, dean" },
  { term: "6F", comp: "inter", level: 3, title: "College essay: making as thinking" },
  { term: "6F", comp: "fluency", level: 2, title: "Spanish community dinner, hosted" },
  { term: "6F", comp: "analysis", level: 1, title: "AP Art History comparison" },
  { term: "6F", comp: "style", level: 1, title: "College essay, second voice" },
  { term: "6F", comp: "own", level: 1, title: "Senior studio: own brief" },
  { term: "6F", comp: "peer", level: 1, title: "Taught third-form shop intro" },
  { term: "6F", comp: "athletics", level: 3, title: "Third varsity season, complete" },
  { term: "6F", comp: "feedback", level: 2, title: "Rewrote artist statement from critique" },
  { term: "6F", comp: "resp", level: 3, title: "Day-student proctor, fall" },
  { term: "6F", comp: "problem", level: 1, title: "Shop bottleneck, defined" },
  { term: "6F", comp: "bounds", level: 1, title: "College-app boundary plan" },
  { term: "6F", comp: "listen", level: 3, title: "Peer mediation, documented" },
  { term: "6F", comp: "written", level: 3, title: "History research paper" },

  { term: "6W", comp: "upstander", level: 2, title: "Second documented stand" },
  { term: "6W", comp: "fluency", level: 3, title: "Spanish orals, complete" },
  { term: "6W", comp: "analysis", level: 2, title: "Winter seminar paper" },
  { term: "6W", comp: "style", level: 2, title: "Op-ed for The Pontefract" },
  { term: "6W", comp: "conv", level: 1, title: "Facilitated senior roundtable" },
  { term: "6W", comp: "problem", level: 2, title: "Redesigned shop sign-up" },
  { term: "6W", comp: "selfk", level: 2, title: "College counselor: strengths map" },
  { term: "6W", comp: "follow", level: 3, title: "Shop sign-up, shipped" },
  { term: "6W", comp: "inspire", level: 1, title: "Third-formers using the benches" },
  { term: "6W", comp: "cohesion", level: 2, title: "Winter captains' letter" },
  { term: "6W", comp: "balance", level: 1, title: "Apps vs studio, written plan" },
  { term: "6W", comp: "oral", level: 3, title: "Senior chapel" },
  { term: "6W", comp: "feedback", level: 3, title: "Applied three rounds of essay notes" },
  { term: "6W", comp: "aware", level: 2, title: "Winter wellbeing check" },
  { term: "6W", comp: "care", level: 3, title: "Sustained self-care, documented" },
  { term: "6W", comp: "posapp", level: 1, title: "Setback in shop, recovered" },
];

const TERM_NOTES = {
  "3F": "Arrives. Studio, a dorm project, and an adult who already knows their name.",
  "3W": "The sketchbook thickens. First chapel reflection. Woodshop.",
  "3S": "Creative process complete. Relationships with adults complete. A maker is visible.",
  "4F": "Craftsmanship complete — a chair. Soccer begins. Writing is just opening.",
  "4W": "Chapel talk delivered. Winter exhibition. The foundation of Creates is done.",
  "4S": "A capstone idea appears: benches for campus. Service starts. Responsibility grows.",
  "5F": "Play run-crew. Varsity soccer. Portfolio started. Collaboration complete.",
  "5W": "Service complete. Academic conversancy complete. The benches are real prototypes.",
  "5S": "Signature winter-into-spring: originality, portfolio, aesthetic language. Three benches in the ground.",
  "6F": "Senior fall. Proctor. Peer teaching in the shop. Foundational writing and listening close.",
  "6W": "Senior winter. The record is a portrait: a maker who learned to speak, serve, and stay.",
};

function snapshotsByTerm(events) {
  return TERMS.map((t) => {
    const { snap, evidence } = applyEvents(events, t.id);
    const earnedThis = events.filter((e) => e.term === t.id);
    return { ...t, snap, evidence, earnedThis, note: TERM_NOTES[t.id] };
  });
}

const JORDAN_TERMS = snapshotsByTerm(JORDAN_EVENTS);

const SAM_EVENTS = [
  { term: "3F", comp: "posrel", level: 1, title: "First advisor meeting" },
  { term: "3F", comp: "chapel", level: 1, title: "Attended, one reflection" },
  { term: "3F", comp: "acad", level: 1, title: "History Harkness, first month" },
  { term: "3F", comp: "written", level: 1, title: "English 9 paragraph set" },
  { term: "3F", comp: "care", level: 1, title: "Trainer: ankle tape plan" },
  { term: "3F", comp: "collab", level: 1, title: "Lab group, chemistry" },
  { term: "3F", comp: "process", level: 1, title: "Arts rotation, clay" },
];

const ALEX_EVENTS = [
  { term: "3F", comp: "posrel", level: 1, title: "Advisor" },
  { term: "3S", comp: "posrel", level: 3, title: "Advisor narrative, year 1" },
  { term: "3S", comp: "chapel", level: 2, title: "Chapel reflections" },
  { term: "3S", comp: "fluency", level: 1, title: "Home language, documented" },
  { term: "4F", comp: "fluency", level: 3, title: "Bilingual chapel reading" },
  { term: "4F", comp: "listen", level: 2, title: "Seminar" },
  { term: "4W", comp: "written", level: 2, title: "English 10" },
  { term: "4S", comp: "acad", level: 2, title: "History conversations" },
  { term: "4S", comp: "sys", level: 1, title: "Biology systems" },
  { term: "4S", comp: "inter", level: 1, title: "Science + ethics" },
  { term: "4S", comp: "tools", level: 2, title: "Ceramics" },
  { term: "4S", comp: "art", level: 2, title: "Ceramics show" },
  { term: "4S", comp: "process", level: 2, title: "Kiln logs" },
  { term: "5F", comp: "tools", level: 3, title: "Wheel throwing, craft" },
  { term: "5F", comp: "art", level: 3, title: "Fall ceramics wall" },
  { term: "5F", comp: "process", level: 3, title: "Process boards" },
  { term: "5F", comp: "aesthetic", level: 1, title: "Glaze language" },
  { term: "5F", comp: "collab", level: 2, title: "Group critique, leading" },
  { term: "5F", comp: "resp", level: 1, title: "Studio monitor" },
  { term: "5F", comp: "chapel", level: 2, title: "Ongoing" },
  { term: "5F", comp: "service", level: 1, title: "Weekend tutoring" },
  { term: "5F", comp: "oral", level: 1, title: "Class presentation" },
  { term: "5F", comp: "athletics", level: 2, title: "Winter running" },
  { term: "5F", comp: "aware", level: 2, title: "Wellbeing journal" },
  { term: "5F", comp: "care", level: 1, title: "Practice recovery" },
  { term: "5W", comp: "follow", level: 1, title: "Independent glaze tests" },
  { term: "5W", comp: "problem", level: 1, title: "Kiln schedule conflict" },
];

export const STUDENTS = [
  {
    id: "sam",
    name: "Sam Okonkwo",
    form: "Third Form",
    klass: "2030",
    pronouns: "they/them",
    statement:
      "I like knowing how things work. I am still finding the rooms on this campus where I can stay a while.",
    events: SAM_EVENTS,
    termId: "3F",
    pitch: "A third former six weeks in. Most of the map is open. A few doors are already ajar.",
  },
  {
    id: "alex",
    name: "Alex Rivera",
    form: "Fifth Form",
    klass: "2028",
    pronouns: "she/her",
    statement:
      "Clay taught me patience. Spanish is the language of my grandparents. I want both to show.",
    events: ALEX_EVENTS,
    termId: "5W",
    pitch: "A fifth former with a clear studio signature and a completed language competency. Foundational work is underway, not finished.",
  },
  {
    id: "jordan",
    name: "Jordan Hale",
    form: "Sixth Form",
    klass: "2027",
    pronouns: "he/him",
    statement:
      "I make things people can sit on. The rest of school has been learning how to talk about that, and who it is for.",
    events: JORDAN_EVENTS,
    termId: "6W",
    pitch: "A senior in winter. Creates is a full tower. Other groups are a path, not a score. This is the four-year story.",
  },
];

export const STUDENT_BY_ID = Object.fromEntries(STUDENTS.map((s) => [s.id, s]));

export function snapshotFor(student, termId) {
  const until = termId || student.termId;
  return applyEvents(student.events, until);
}

export function jordanPlate() {
  return JORDAN_TERMS;
}

export const PAPER = "#F4F6F3";
export const INK = "#1F2A3A";
export const MUTE = "#5C6B7A";
export const RULE = "#C5CDC8";
export const NAVY = "#1E3A5F";
export const GOLD = "#A67C2A";
