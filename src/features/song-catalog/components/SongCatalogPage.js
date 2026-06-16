import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ResponsiveLayout from '../../../components/ResponsiveLayout';
import useReducedMotion from '../../../hooks/useReducedMotion';
import useSongCatalog from '../hooks/useSongCatalog';
import useSongFilters from '../hooks/useSongFilters';
import useRandomSheetHistory from '../hooks/useRandomSheetHistory';

import { drawRandomSheet, buildHistoryEntry } from '../utils/randomSheet';
import SongToolbar from './SongToolbar';
import SongFilterModal from './SongFilterModal';
import SongResultGrid from './SongResultGrid';
import SongResultList from './SongResultList';
import SongResultSummary from './SongResultSummary';
import SongRandomPanel from './SongRandomPanel';
import SongSheetDetail from './SongSheetDetail';
import '../styles/song-catalog.css';

const VIEW_MODES = {
  grid: SongResultGrid,
  detail: SongResultList,
  summary: SongResultSummary,
};

const PAGE_SIZE_OPTIONS = [48, 96, 144];

const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

const SongCatalogPage = ({ game }) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const { data, loading, error, refetch } = useSongCatalog(game);
  const { history, addEntry, clearAll: clearHistory } = useRandomSheetHistory(
    game.id
  );

  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('songNo');
  const [sortDir, setSortDir] = useState('DESC');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [latest, setLatest] = useState(null);
  const [detailSheet, setDetailSheet] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileViewport);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(48);

  // Reset ephemeral state when the active game changes.
  useEffect(() => {
    setLatest(null);
    setDetailSheet(null);
    setIsDrawing(false);
  }, [game.id]);

  // Track mobile breakpoint so the toolbar can switch to a hint variant.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => setIsMobile(isMobileViewport());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const runtimeFilterConfig = useMemo(() => ({
    ...game.filterConfig,
    categoryOrder: (data?.categories || []).map((item) => item.category),
    versionOrder: (data?.versions || []).map((item) => item.version),
    typeOrder: (data?.types || []).map((item) => item.type),
    difficultyOrder: (data?.difficulties || []).map((item) => item.difficulty),
  }), [data, game.filterConfig]);

  const {
    tempFilters,
    setFilterValue,
    setTempFilterValue,
    syncTempFilters,
    applyTempFilters,
    resetFilters,
    resetTempFilters,
    options,
    filteredSongs,
    activeTags,
    tempActiveTags,
    sortSheets,
  } = useSongFilters(data ? data.songs : [], runtimeFilterConfig);

  const sortedSheets = useMemo(
    () => sortSheets(sortBy, sortDir),
    // sortSheets already depends on filteredSheets internally; we only
    // need to re-run when the sort key/direction changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortSheets, sortBy, sortDir]
  );

  const canDraw = sortedSheets.length > 0;
  const appliedCount = activeTags.length;
  const stagedCount = tempActiveTags.length;
  const isSummaryView = view === 'summary';
  const totalPages = Math.max(1, Math.ceil(sortedSheets.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = sortedSheets.length === 0 ? 0 : (safePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, sortedSheets.length);
  const visibleSheets = useMemo(
    () => (isSummaryView ? sortedSheets : sortedSheets.slice(pageStart, pageEnd)),
    [isSummaryView, pageEnd, pageStart, sortedSheets]
  );

  useEffect(() => {
    setPage(1);
  }, [activeTags, sortBy, sortDir, view]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleOpenFilter = useCallback(() => {
    syncTempFilters();
    setFilterModalOpen(true);
  }, [syncTempFilters]);

  const handleCloseFilter = useCallback(() => {
    setFilterModalOpen(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleDrawRandom = useCallback(() => {
    if (isDrawing) return;
    if (!canDraw) return;
    setIsDrawing(true);
    const delay = reducedMotion ? 0 : 280;
    window.setTimeout(() => {
      const picked = drawRandomSheet(sortedSheets);
      if (!picked) {
        setIsDrawing(false);
        return;
      }
      const entry = buildHistoryEntry(picked);
      setLatest(entry);
      addEntry(entry);
      setIsDrawing(false);
    }, delay);
  }, [isDrawing, canDraw, sortedSheets, addEntry, reducedMotion]);

  const handleSelectSheet = useCallback((sheet) => {
    setDetailSheet(sheet);
  }, []);

  const handleSelectHistoryEntry = useCallback((entry) => {
    setDetailSheet({
      ...entry,
      id: entry.sheetId,
      songTitle: entry.title,
      songArtist: entry.artist,
      songVersion: entry.songVersion,
      songType: entry.songType,
      songCategory: entry.songCategory,
      songBpm: entry.bpm,
      songImageUrl: entry.songImageUrl || entry.imageUrl,
      songSheets: entry.songSheets || [],
      level: entry.levelLabel,
      levelValue:
        typeof entry.level === 'number' ? entry.level : null,
      internalLevelValue:
        typeof entry.level === 'number' ? entry.level : null,
    });
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailSheet(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setLatest(null);
  }, [clearHistory]);

  const handleBack = useCallback(() => {
    navigate('/songs');
  }, [navigate]);

  const goToPage = useCallback(
    (nextPage) => {
      setPage(Math.min(Math.max(1, nextPage), totalPages));
    },
    [totalPages]
  );

  const clearTag = useCallback(
    (tag) => {
      if (tag.key === 'levelRange') {
        setFilterValue('levelRange', [...runtimeFilterConfig.levelRange.default]);
      } else if (tag.key === 'bpmRange') {
        setFilterValue('bpmMin', null);
        setFilterValue('bpmMax', null);
      } else if (tag.key === 'searchText') {
        setFilterValue('searchText', '');
      } else if (tag.key === 'artistFilter') {
        setFilterValue('artistFilter', '');
      } else {
        setFilterValue(tag.key, []);
      }
    },
    [runtimeFilterConfig, setFilterValue]
  );

  const ResultComponent = VIEW_MODES[view] || SongResultGrid;
  const resultKey = useMemo(() => {
    const filterKey = activeTags
      .map((tag) => `${tag.key}:${tag.value}`)
      .join('|');
    return `${view}:${sortBy}:${sortDir}:${sortedSheets.length}:${filterKey}`;
  }, [activeTags, sortBy, sortDir, sortedSheets.length, view]);
  const renderPagination = () => !isSummaryView && sortedSheets.length > 0 && (
    <nav className="song-catalog-pagination" aria-label="结果分页">
      <div className="song-catalog-pagination__range" aria-live="polite">
        {pageStart + 1}-{pageEnd} / {sortedSheets.length}
      </div>
      <div className="song-catalog-pagination__controls">
        <button
          type="button"
          className="song-catalog-pagination__button"
          onClick={() => goToPage(1)}
          disabled={safePage === 1}
          aria-label="第一页"
        >
          {'<<'}
        </button>
        <button
          type="button"
          className="song-catalog-pagination__button"
          onClick={() => goToPage(safePage - 1)}
          disabled={safePage === 1}
          aria-label="上一页"
        >
          {'<'}
        </button>
        <span className="song-catalog-pagination__page">
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className="song-catalog-pagination__button"
          onClick={() => goToPage(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label="下一页"
        >
          {'>'}
        </button>
        <button
          type="button"
          className="song-catalog-pagination__button"
          onClick={() => goToPage(totalPages)}
          disabled={safePage === totalPages}
          aria-label="最后一页"
        >
          {'>>'}
        </button>
      </div>
      <label className="song-catalog-pagination__size">
        <span>每页</span>
        <select
          className="song-catalog-pagination__select"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium song-catalog-page">
        <header className="song-catalog-page__header">
          <button
            type="button"
            className="song-catalog-page__back"
            onClick={handleBack}
            aria-label="返回曲库"
          >
            ◀ 曲库
          </button>
          <div className="song-catalog-page__heading">
            <span className="song-catalog-page__eyebrow">
              曲库 / {game.label}
            </span>
            <h1 className="song-catalog-page__title">{game.label}</h1>
            <p className="song-catalog-page__subtitle">
              {game.shortDescription} 数据实时来自{' '}
              <code className="song-catalog-page__code">{game.dataSource}</code>.
            </p>
          </div>
        </header>

        {loading && (
          <p className="song-catalog-page__status">正在加载 {game.label}...</p>
        )}
        {error && (
          <div className="song-catalog-page__status song-catalog-page__status--error">
            <span>! 错误 · {error}</span>
            <button
              type="button"
              className="song-catalog-page__retry"
              onClick={refetch}
            >
              [重试]
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <SongToolbar
              view={view}
              setView={setView}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
              activeFilterCount={appliedCount}
              onOpenFilter={handleOpenFilter}
              onClearFilters={handleClearFilters}
              resultCount={sortedSheets.length}
              isMobile={isMobile}
              sortOptions={game.sortOptions}
            />

            {activeTags.length > 0 && (
              <ul className="song-catalog-active" aria-label="active filters">
                {activeTags.map((tag) => (
                  <li key={tag.key} className="song-catalog-active__tag">
                    <span className="song-catalog-active__label">
                      {tag.label}
                    </span>
                    <span className="song-catalog-active__value">
                      {tag.value}
                    </span>
                    <button
                      type="button"
                      className="song-catalog-active__clear"
                      onClick={() => clearTag(tag)}
                    aria-label={`清除 ${tag.label}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="song-catalog-page__body">
              <section
                className="song-catalog-page__results"
                aria-label="结果"
              >
                {renderPagination()}
                <ResultComponent
                  key={resultKey}
                  sheets={visibleSheets}
                  onSelect={handleSelectSheet}
                  versionOrder={game.summaryVersionOrder}
                />
                {renderPagination()}
              </section>
              <SongRandomPanel
                history={history}
                latest={latest}
                onDrawAgain={handleDrawRandom}
                canDraw={canDraw}
                onClearHistory={handleClearHistory}
                onSelectEntry={handleSelectHistoryEntry}
              />
            </div>
          </>
        )}

        <footer className="song-catalog-page__sources" aria-label="数据来源">
          <span className="song-catalog-page__sources-label">来源</span>
          <span className="song-catalog-page__sources-divider">/</span>
          <span>cloudfront CDN (arcade-songs mirror)</span>
          <span className="song-catalog-page__sources-divider">/</span>
          <span>
            {data
              ? `${filteredSongs.length} / ${data.songs.length} 首歌曲`
              : '—'}
          </span>
          <span className="song-catalog-page__sources-divider">/</span>
          <span>个人 · 非商业</span>
        </footer>
      </div>

      <SongFilterModal
        open={filterModalOpen}
        onClose={handleCloseFilter}
        tempFilters={tempFilters}
        setTempFilterValue={setTempFilterValue}
        resetTempFilters={resetTempFilters}
        applyTempFilters={applyTempFilters}
        options={options}
        config={runtimeFilterConfig}
        activeCount={stagedCount}
      />

      <SongSheetDetail
        sheet={detailSheet}
        onClose={handleCloseDetail}
      />
    </ResponsiveLayout>
  );
};

export default SongCatalogPage;
