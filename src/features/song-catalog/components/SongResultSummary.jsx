import React from 'react';

const formatCount = (n) => (n > 0 ? String(n).padStart(2, '0') : '00');

const DIFFICULTY_ORDER = [
  're:master',
  'remaster',
  'master',
  'expert',
  'exp',
  'advanced',
  'adv',
  'basic',
];

const getDifficultyOrder = (difficulty) => {
  const normalized = String(difficulty || '').trim().toLowerCase();
  const index = DIFFICULTY_ORDER.indexOf(normalized);
  return index === -1 ? DIFFICULTY_ORDER.length : index;
};

const buildDifficultyBuckets = (sheets) => {
  const buckets = new Map();
  sheets.forEach((sheet) => {
    const key = sheet.difficulty || 'UNKNOWN';
    const level =
      sheet.internalLevelValue !== null && sheet.internalLevelValue !== undefined
        ? sheet.internalLevelValue
        : sheet.levelValue;
    if (!buckets.has(key)) {
      buckets.set(key, { difficulty: key, count: 0, levelSum: 0, levelCount: 0 });
    }
    const bucket = buckets.get(key);
    bucket.count += 1;
    if (typeof level === 'number' && !Number.isNaN(level)) {
      bucket.levelSum += level;
      bucket.levelCount += 1;
    }
  });
  return [...buckets.values()]
    .map((bucket) => ({
      ...bucket,
      avgLevel: bucket.levelCount > 0 ? bucket.levelSum / bucket.levelCount : null,
    }))
    .sort(
      (a, b) =>
        getDifficultyOrder(a.difficulty) - getDifficultyOrder(b.difficulty) ||
        a.difficulty.localeCompare(b.difficulty)
    );
};

const normalizeVersion = (version) =>
  String(version || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const buildVersionBuckets = (sheets, versionOrder = []) => {
  const buckets = new Map();
  sheets.forEach((sheet) => {
    const key = sheet.songVersion || 'UNKNOWN';
    if (!buckets.has(key)) buckets.set(key, 0);
    buckets.set(key, buckets.get(key) + 1);
  });
  const orderMap = new Map(
    versionOrder.map((version, index) => [normalizeVersion(version), index])
  );
  return [...buckets.entries()]
    .map(([version, count]) => ({ version, count }))
    .sort((a, b) => {
      const aOrder = orderMap.get(normalizeVersion(a.version));
      const bOrder = orderMap.get(normalizeVersion(b.version));
      const aKnown = aOrder !== undefined;
      const bKnown = bOrder !== undefined;
      if (aKnown || bKnown) {
        if (!aKnown) return 1;
        if (!bKnown) return -1;
        if (aOrder !== bOrder) return aOrder - bOrder;
      }
      return b.count - a.count || a.version.localeCompare(b.version);
    });
};

const SongResultSummary = ({ sheets, versionOrder }) => {
  if (!sheets || sheets.length === 0) {
    return (
      <p className="song-catalog-empty">
        ! 无结果 - 请调整或清空筛选条件。
      </p>
    );
  }

  const totalSheets = sheets.length;
  const totalSongs = new Set(sheets.map((sheet) => sheet.songId)).size;
  const difficulties = buildDifficultyBuckets(sheets);
  const versions = buildVersionBuckets(sheets, versionOrder);
  const maxVersionCount = versions.reduce((max, v) => Math.max(max, v.count), 1);

  return (
    <div className="song-catalog-summary">
      <dl className="song-catalog-summary__stats">
        <div>
          <dt>谱面</dt>
          <dd>{formatCount(totalSheets)}</dd>
        </div>
        <div>
          <dt>歌曲</dt>
          <dd>{formatCount(totalSongs)}</dd>
        </div>
        <div>
          <dt>难度</dt>
          <dd>{formatCount(difficulties.length)}</dd>
        </div>
        <div>
          <dt>版本</dt>
          <dd>{formatCount(versions.length)}</dd>
        </div>
      </dl>

      <section className="song-catalog-summary__section">
        <h3 className="song-catalog-summary__heading">版本分布</h3>
        <ul className="song-catalog-summary__list">
          {versions.slice(0, 12).map((bucket) => (
            <li key={bucket.version} className="song-catalog-summary__row">
              <span className="song-catalog-summary__row-label">
                {bucket.version}
              </span>
              <span className="song-catalog-summary__row-bar">
                <span
                  className="song-catalog-summary__row-bar-fill"
                  style={{ width: `${(bucket.count / maxVersionCount) * 100}%` }}
                />
              </span>
              <span className="song-catalog-summary__row-count">
                {formatCount(bucket.count)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="song-catalog-summary__section">
        <h3 className="song-catalog-summary__heading">难度分布</h3>
        <ul className="song-catalog-summary__list">
          {difficulties.map((bucket) => (
            <li key={bucket.difficulty} className="song-catalog-summary__row">
              <span className="song-catalog-summary__row-label">
                {bucket.difficulty}
              </span>
              <span className="song-catalog-summary__row-bar">
                <span
                  className="song-catalog-summary__row-bar-fill"
                  style={{ width: `${(bucket.count / totalSheets) * 100}%` }}
                />
              </span>
              <span className="song-catalog-summary__row-count">
                {formatCount(bucket.count)}
              </span>
              <span className="song-catalog-summary__row-avg">
                平均 {bucket.avgLevel !== null ? bucket.avgLevel.toFixed(1) : '-'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SongResultSummary;
