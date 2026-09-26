export const FREE_TIER_AI_PHOTO_PER_DAY = 3;
export const FREE_TIER_COACH_PER_WEEK = 5;

export function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function utcIsoWeekKey(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    (((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
