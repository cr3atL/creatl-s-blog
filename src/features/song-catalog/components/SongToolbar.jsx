import React from 'react';

const VIEWS = [
  { key: 'grid', label: '网格' },
  { key: 'detail', label: '详情' },
  { key: 'summary', label: '摘要' },
];

const SORT_DIR_LABELS = {
  ASC: '升序',
  DESC: '降序',
};

const SongToolbar = ({
  view,
  setView,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  activeFilterCount,
  onOpenFilter,
  onClearFilters,
  resultCount,
  isMobile,
  sortOptions,
}) => {
  const options = sortOptions && sortOptions.length > 0
    ? sortOptions
    : [{ key: 'internalLevelValue', label: '定数' }];

  return (
    <div className="song-catalog-toolbar">
      <div className="song-catalog-toolbar__row">
        <div
          className="song-catalog-toolbar__views"
          role="group"
          aria-label="视图模式"
        >
          {VIEWS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={view === option.key}
              className={
                view === option.key
                  ? 'song-catalog-toolbar__view is-active'
                  : 'song-catalog-toolbar__view'
              }
              onClick={() => setView(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="song-catalog-toolbar__sort">
          <label
            className="song-catalog-toolbar__sort-label"
            htmlFor="song-catalog-sort"
          >
            排序
          </label>
          <select
            id="song-catalog-sort"
            className="song-catalog-toolbar__select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="song-catalog-toolbar__sort-dir"
            onClick={() => setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC')}
            aria-label={`排序方向，当前为${SORT_DIR_LABELS[sortDir]}，点击切换`}
          >
            {SORT_DIR_LABELS[sortDir]}
          </button>
        </div>
      </div>

      <div className="song-catalog-toolbar__row">
        <button
          type="button"
          className="song-catalog-toolbar__action"
          onClick={onOpenFilter}
        >
          筛选{activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </button>
        <button
          type="button"
          className="song-catalog-toolbar__action"
          onClick={onClearFilters}
          disabled={activeFilterCount === 0}
        >
          清空
        </button>
        <span className="song-catalog-toolbar__count" aria-live="polite">
          {resultCount} 个结果
        </span>
      </div>

      {isMobile && (
        <p className="song-catalog-toolbar__hint">
          提示：点击谱面查看详情；随机面板中可再次抽选。
        </p>
      )}
    </div>
  );
};

export default SongToolbar;
