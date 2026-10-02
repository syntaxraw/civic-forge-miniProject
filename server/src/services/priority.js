// Smart prioritization: severity (category + danger keywords) x momentum (recent upvotes) x corroboration.
const BASE = { roads: 3, water: 3, electricity: 3, waste: 2, sanitation: 3, safety: 4, other: 2 };
const DANGER = ['accident', 'fire', 'flood', 'sparking', 'live wire', 'open manhole', 'sewage', 'overflow', 'collapse', 'injury', 'injured', 'danger', 'urgent', 'contaminated', 'child', 'school', 'hospital', 'blocked'];

export function estimateSeverity(category, text = '') {
  const t = text.toLowerCase();
  const hits = DANGER.filter((k) => t.includes(k)).length;
  return Math.max(1, Math.min(5, (BASE[category] || 2) + Math.min(hits, 2)));
}

export function computePriority(issue, reporterTrust = 50) {
  if (issue.status === 'Completed') return 0;
  const now = Date.now();
  const recent = (issue.upvotes || []).filter((u) => now - new Date(u.at).getTime() < 48 * 3600e3).length;
  const ageDays = (now - new Date(issue.createdAt || now).getTime()) / 864e5;
  const score =
    issue.severity * 18 +
    Math.log2(1 + (issue.upvoteCount || 0)) * 10 +
    recent * 3 + // momentum
    (issue.mergedCount || 0) * 4 + // independent corroboration
    Math.min(ageDays, 30) * 0.6 + // long-pending issues rise
    (reporterTrust - 50) * 0.1;
  return Math.round(score * 10) / 10;
}
