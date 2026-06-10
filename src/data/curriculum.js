// ============================================================================
//  CURRICULUM — the ordered list of all 13 sections.
//  Each section lives in its own file under src/sections/ so sections can be
//  edited, reordered, or extended independently.
// ============================================================================

import networking from "../sections/01-networking.js";
import protocols from "../sections/02-protocols.js";
import architecture from "../sections/03-architecture.js";
import web from "../sections/04-web.js";
import scalability from "../sections/05-scalability.js";
import storage from "../sections/06-storage.js";
import performance from "../sections/07-performance.js";
import reliability from "../sections/08-reliability.js";
import security from "../sections/09-security.js";
import blueprint from "../sections/10-blueprint.js";
import urlShortener from "../sections/11-url-shortener.js";
import ticketing from "../sections/12-ticketing.js";
import bonus from "../sections/13-bonus.js";

export const CURRICULUM = [
  networking, protocols, architecture, web, scalability, storage,
  performance, reliability, security, blueprint, urlShortener, ticketing, bonus,
];

// Flatten the curriculum into a single numbered list of lessons, each carrying
// its section name/color and a global 1-based `num`. Used by the nav + viewer.
export function flattenCurriculum() {
  const flat = CURRICULUM.flatMap((s, si) =>
    s.lessons.map((l, li) => ({ ...l, si, li, sec: s.sec, color: s.color, num: 0 }))
  );
  flat.forEach((l, i) => (l.num = i + 1));
  return flat;
}
