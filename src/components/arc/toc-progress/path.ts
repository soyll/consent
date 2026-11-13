/** Geometry helpers for the TocProgress SVG trajectory. */

export type LanePoint = {
  x: number;
  y: number;
  level: 1 | 2 | 3;
};

const LANE_BASE = 5;
const LANE_STEP = 12;
const SVG_WIDTH = 40;
const CURVE_SPAN = 14;
const CURVE_SAMPLES = 14;

export function laneX(level: 1 | 2 | 3): number {
  return LANE_BASE + (Math.min(3, Math.max(1, level)) - 1) * LANE_STEP;
}

export function svgWidth(): number {
  return SVG_WIDTH;
}

/** Cubic bezier point with vertical end tangents (S-curve between lanes). */
function cubicPoint(
  t: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): { x: number; y: number } {
  const dy = y1 - y0;
  const p0x = x0;
  const p0y = y0;
  const p1x = x0;
  const p1y = y0 + dy / 3;
  const p2x = x1;
  const p2y = y1 - dy / 3;
  const p3x = x1;
  const p3y = y1;
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  const x = uu * u * p0x + 3 * uu * t * p1x + 3 * u * tt * p2x + tt * t * p3x;
  const y = uu * u * p0y + 3 * uu * t * p1y + 3 * u * tt * p2y + tt * t * p3y;
  return { x, y };
}

function pushPoint(points: Array<{ x: number; y: number }>, x: number, y: number) {
  const last = points[points.length - 1];
  if (last && Math.abs(last.x - x) < 0.01 && Math.abs(last.y - y) < 0.01) return;
  points.push({ x, y });
}

/**
 * Build a polyline that runs through each TOC row center, with smooth
 * S-curves when the heading level (lane) changes.
 */
export function buildPathPoints(
  centers: LanePoint[],
  endY: number,
): Array<{ x: number; y: number }> {
  if (centers.length === 0) return [];

  const points: Array<{ x: number; y: number }> = [];
  pushPoint(points, centers[0].x, centers[0].y);

  for (let i = 1; i < centers.length; i++) {
    const prev = centers[i - 1];
    const next = centers[i];
    const gap = next.y - prev.y;

    if (prev.level === next.level || gap < 1) {
      pushPoint(points, next.x, next.y);
      continue;
    }

    const curve = Math.min(CURVE_SPAN, Math.max(4, gap * 0.5));
    const lead = (gap - curve) / 2;
    const yStart = prev.y + lead;
    const yEnd = yStart + curve;

    pushPoint(points, prev.x, yStart);

    for (let s = 1; s <= CURVE_SAMPLES; s++) {
      const t = s / CURVE_SAMPLES;
      const p = cubicPoint(t, prev.x, yStart, next.x, yEnd);
      pushPoint(points, p.x, p.y);
    }

    pushPoint(points, next.x, next.y);
  }

  if (endY > centers[centers.length - 1].y) {
    pushPoint(points, centers[centers.length - 1].x, endY);
  }

  return points;
}

export function pointsToPathD(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => {
      const x = p.x.toFixed(2);
      const y = p.y.toFixed(2);
      return i === 0 ? `M${x} ${y}` : `L${x} ${y}`;
    })
    .join("");
}

/** Binary-search arc length so getPointAtLength ≈ target Y (monotone path). */
export function lengthAtY(
  path: SVGPathElement,
  y: number,
  totalLength: number,
): number {
  if (!Number.isFinite(totalLength) || totalLength <= 0) return 0;
  let lo = 0;
  let hi = totalLength;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < y) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function pointAtLength(
  path: SVGPathElement,
  length: number,
): { x: number; y: number } {
  const total = path.getTotalLength();
  if (!Number.isFinite(total) || total <= 0) {
    return { x: 0, y: 0 };
  }
  const p = path.getPointAtLength(Math.max(0, Math.min(length, total)));
  return { x: p.x, y: p.y };
}
