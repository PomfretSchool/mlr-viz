import { renderHilltop, renderStars, renderProfile, renderMatrix, renderRings } from "./viz-a.js";
import { renderYears, renderPath, renderWaffle, renderEvidence, renderDoors } from "./viz-b.js";

export const VIZ = [
  {
    id: "hilltop",
    title: "Hilltop",
    kind: "Snapshot",
    motion: "Hover a brick. Play Jordan’s years to watch towers rise.",
    render: renderHilltop,
    rationale:
      "Foundational work is a plinth every student stands on. Advanced work is height, and height is a signature — not a grade. The sky above an unfinished tower is unused capacity, which is the point of optional depth. This encoding makes ‘Creates’ as a senior strength visible in a second, without turning other groups into failure.",
    good: "Student home screen. Guide conference. College reader who wants a silhouette, not a spreadsheet.",
    tufte: "Small multiples of seven stacks. Direct labels on bricks once they have fill. No 3D, no shadows, no skyline decoration.",
  },
  {
    id: "stars",
    title: "Constellations",
    kind: "Snapshot",
    motion: "Hover a star. Completed stars in a group connect.",
    render: renderStars,
    rationale:
      "Seven asterisms for the Portrait of the Graduate. The inner three are guide stars — how a class navigates. The outer four are where this student wandered. Lines appear only among completed stars, so the map records a journey instead of a grid of absences. Unlit stars stay outlined, like a star chart you have not finished walking.",
    good: "A memorable metaphor for students. A way to talk about exploration without implying a full sky is required.",
    tufte: "Position is categorical, not quantitative. Fill encodes the four states. Connection lines are data (completion), not ornament.",
  },
  {
    id: "profile",
    title: "Profile",
    kind: "Snapshot",
    motion: "Hover the small squares under each bar.",
    render: renderProfile,
    rationale:
      "This is the ‘dashboard of dials,’ done the way Tufte and Few would allow it. Foundational bars have a destination: three of three, marked with a hard tick. Advanced bars have an open end and a count, never a percent of 28. Gauges and donuts waste the same ink on empty pie; a bar against a target does not.",
    good: "Guides who want to scan seven numbers. Conversations about ‘are we on the shared path?’ without shaming unfinished advanced work.",
    tufte: "Bullet-graph family. High data-ink. Target encoded once, as a line, not as a colored zone of shame.",
  },
  {
    id: "years",
    title: "Four years",
    kind: "Timeline",
    motion: "Click a term. Or press Play — fall, winter, spring, through senior winter.",
    render: renderYears,
    rationale:
      "The Learning Record is a document students build from third form on. A single senior snapshot hides the story. Eleven term-end plates, small multiples of the same hilltop, plus two quiet lines: foundational of 21, and an advanced count with no ceiling. Senior winter is the natural last frame — the record as a college portrait, not a June checklist.",
    good: "The pitch to Waseem and Jason. Advisor meetings in 5th and 6th form. Students seeing that their record has a plot.",
    tufte: "Small multiples over time. Same scale, same encoding, changing only the data. The line chart is two series with different meanings; they are labeled as such.",
  },
  {
    id: "matrix",
    title: "Matrix",
    kind: "Snapshot",
    motion: "Hover any cell.",
    render: renderMatrix,
    rationale:
      "The current MLR is this matrix, stretched into a scrolling list. Forty-nine states survive compression. A vertical rule separates the 21 from the 28 so the eye does not treat them as one test. This is the most honest plate: if an encoding cannot beat this at showing gaps and strengths, it is decoration.",
    good: "Power users. Export to print. The control against which every metaphor should be judged.",
    tufte: "Above all else, show the data. One number (level) per cell. Color from the existing group language. No chartjunk.",
  },
  {
    id: "rings",
    title: "Rings",
    kind: "Snapshot",
    motion: "Hover a band.",
    render: renderRings,
    rationale:
      "A growth-ring metaphor without the lie of area. Each competency is the same stroke weight; we are not encoding with πr². Inner three bands are foundational, outer four advanced. Open bands stay as hairlines, so a third former’s plate is a set of faint rings, not a hollow tree.",
    good: "Students who think in ‘growing out.’ A contrast with Mastery’s current circular diagram, which mixes taxonomies and expected-vs-earned rings.",
    tufte: "Equal ink per competency. Partial arcs avoid looking like a pie. Small multiples, one per group.",
  },
  {
    id: "path",
    title: "Path",
    kind: "Snapshot",
    motion: "Hover a stone or a trail marker.",
    render: renderPath,
    rationale:
      "The 21 foundational competencies are a shared loop. Advanced work leaves the path as a trail. A student who builds three benches has a long trail in Creates; that is a walk they chose, not extra credit toward 49. Empty trailheads are places they have not gone, which is allowed.",
    good: "Third- and fourth-form conversations: you are on the path. Fifth-form: look at the trail you are cutting.",
    tufte: "Position encodes kind (loop vs trail). Fill encodes state. The ellipse is structure, not data — a rare, justified frame.",
  },
  {
    id: "waffle",
    title: "Forty-nine",
    kind: "Snapshot",
    motion: "Hover a square.",
    render: renderWaffle,
    rationale:
      "Isotype / waffle: countable units, two questions side by side. Left: asked of everyone. Right: a signature, if they choose. Splitting the questions is the design. A single 7×7 can make advanced emptiness feel like the same kind of hole as a missing foundational. It is not.",
    good: "Family weekends. A slide in a faculty meeting. Anyone who still thinks advanced is ‘the rest of the test.’",
    tufte: "Unit charts. One mark, one competency. No area distortion. Number at the bottom is a count.",
  },
  {
    id: "evidence",
    title: "Evidence",
    kind: "Timeline",
    motion: "Hover a mark for the artifact.",
    render: renderEvidence,
    rationale:
      "The record is not 49 boxes. It is a pile of artifacts with dates. Lanes are the seven groups; x is term-end; each mark is a submission. This is how Canvas assignments should feel once they land here — a stream of work, not a hunt through a list. Density is effort. It is not a GPA.",
    good: "The Canvas conversation. Showing Waseem that imported assignments have a place to live visually.",
    tufte: "Dot plot over time. Stacking at a term avoids jitter. Direct hover instead of a legend of 49 names.",
  },
  {
    id: "doors",
    title: "Doors ajar",
    kind: "Action",
    motion: "Static invitation. The verb is add evidence.",
    render: renderDoors,
    rationale:
      "A visualization that does not ask ‘what is missing?’ It asks ‘where is the nearest door?’ In-motion competencies first (begun, likely). Then the next foundational on a path already walked. Then, if there is a signature group, an advanced to tag later stronger work. Empty wellbeing is not on this plate unless it is the nearest real step.",
    good: "Student home, after they have looked at the hilltop. The thing that should sit next to Canvas import.",
    tufte: "Highlighting as a sentence, not a dashboard. Three claims, each with a verb.",
  },
];
