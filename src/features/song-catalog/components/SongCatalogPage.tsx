import type { ActiveFilterTag, CatalogSheet, Game } from '../types';
import type { HistoryEntry } from '../utils/randomSheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import SongSelectionView from './SongSelectionView';
import { getSheetKey } from '../utils/sheetIdentity';
import { expandFilteredSongsToSheets } from '../utils/filterSheets';
import { motion } from '../../../motion/tokens';
import { useCatalogFade, useCatalogResultsMotion } from '../hooks/useCatalogMotion';
import '../styles/song-catalog.css';

const VIEW_MODES = {
  selection: SongSelectionView,
  grid: SongResultGrid,
  detail: SongResultList,
  summary: SongResultSummary,
};

const PAGE_SIZE_OPTIONS = [48, 96, 144];

const SongCatalogPage = ({ game }: { game: Game }) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const { data, loading, error, refetch } = useSongCatalog(game);
  const { history, addEntry, clearAll: clearHistory } = useRandomSheetHistory(
    game.id
  );

  const [view, setView] = useState<keyof typeof VIEW_MODES>('selection');
  const [sortBy, setSortBy] = useState('songNo');
  const [sortDir, setSortDir] = useState('DESC');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [latest, setLatest] = useState<HistoryEntry | null>(null);
  const [detailSheet, setDetailSheet] = useState<CatalogSheet | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const drawTimer = useRef<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(48);
  const statusRef = useRef<HTMLDivElement & HTMLParagraphElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  useCatalogFade(statusRef, loading ? 'loading' : error || 'ready');

  // Reset ephemeral state when the active game changes.
  useEffect(() => {
    setLatest(null);
    setDetailSheet(null);
    setIsDrawing(false);
    setSelectedKey(null);
    setFilterModalOpen(false);
    setPage(1);
  }, [game.id]);

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
  useCatalogResultsMotion(resultsRef, view, !canDraw, !loading && !error && Boolean(data));
  const appliedCount = activeTags.length;
  const stagedCount = tempActiveTags.length;
  const isSummaryView = view === 'summary';
  const isSelectionView = view === 'selection';
  const sheetKeys = useMemo(() => new Set(sortedSheets.map((sheet) => getSheetKey(sheet, game.id))), [sortedSheets, game.id]);
  const validSelectedKey = selectedKey && sheetKeys.has(selectedKey)
    ? selectedKey : sortedSheets[0] ? getSheetKey(sortedSheets[0], game.id) : null;
  useEffect(() => { setSelectedKey(validSelectedKey); }, [validSelectedKey]);
  useEffect(() => {
    if (detailSheet && !sheetKeys.has(getSheetKey(detailSheet, game.id))) setDetailSheet(null);
    // Persisted history details may be outside the current filters; only close
    // an already open dialog when the candidate pool actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetKeys]);

  useEffect(() => {
    setIsDrawing(false);
    return () => {
      if (drawTimer.current !== null) clearTimeout(drawTimer.current);
      drawTimer.current = null;
    };
  }, [game.id, sortedSheets]);
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
    const delay = reducedMotion ? 0 : motion.duration.standard;
    drawTimer.current = window.setTimeout(() => {
      drawTimer.current = null;
      const picked = drawRandomSheet(sortedSheets);
      if (!picked) {
        setIsDrawing(false);
        return;
      }
      const entry = buildHistoryEntry(picked);
      setLatest(entry);
      addEntry(entry);
      setSelectedKey(getSheetKey(picked, game.id));
      setIsDrawing(false);
    }, delay);
  }, [isDrawing, canDraw, sortedSheets, addEntry, reducedMotion, game.id]);

  const handleSelectSheet = useCallback((sheet: CatalogSheet) => {
    setSelectedKey(getSheetKey(sheet, game.id));
    setDetailSheet(sheet);
  }, [game.id]);

  const handleSelectHistoryEntry = useCallback((entry: HistoryEntry) => {
    const song = data?.songs.find((song) => song.songId === entry.songId);
    const current = song && expandFilteredSongsToSheets([song]).find((sheet) =>
      sheet.id === entry.sheetId && sheet.difficulty === entry.difficulty);
    if (current) {
      setDetailSheet(current);
      const key = getSheetKey(current, game.id);
      if (sheetKeys.has(key)) setSelectedKey(key);
      return;
    }
    setDetailSheet({
      ...entry,
      songNo: 0,
      songReleaseDate: '',
      type: entry.songSheets.find((sheet) => sheet.id === entry.sheetId)?.type || entry.songType,
      noteCounts: null,
      notePercents: null,
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
  }, [data, game.id, sheetKeys]);

  const handleCloseDetail = useCallback(() => {
    setDetailSheet(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setLatest(null);
  }, [clearHistory]);

  const handleBack = useCallback(() => {
    navigate('/songs', { state: { catalogGameId: game.id } });
  }, [navigate, game.id]);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(1, nextPage), totalPages));
    },
    [totalPages]
  );

  const clearTag = useCallback(
    (tag: ActiveFilterTag) => {
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

  const ResultComponent = view === 'summary' ? SongResultSummary : view === 'detail' ? SongResultList : SongResultGrid;
  const resultProps = { sheets: visibleSheets, onSelect: handleSelectSheet,
    versionOrder: game.summaryVersionOrder, gameId: game.id };
  const resultKey = useMemo(() => {
    const filterKey = activeTags
      .map((tag) => `${tag.key}:${tag.value}`)
      .join('|');
    return `${view}:${sortBy}:${sortDir}:${sortedSheets.length}:${filterKey}`;
  }, [activeTags, sortBy, sortDir, sortedSheets.length, view]);
  const renderPagination = () => !isSummaryView && !isSelectionView && sortedSheets.length > 0 && (
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
        <header className="song-catalog-page__header" data-motion-section>
          <button
            type="button"
            className="song-catalog-page__back"
            onClick={handleBack}
            aria-label="返回曲库"
          >
            ◀ 曲库
          </button>
          <div className="song-catalog-page__heading">
            <h1 className="song-catalog-page__title">{game.label}</h1>
          </div>
        </header>

        {loading && (
          <p ref={statusRef} className="song-catalog-page__status" data-motion-section>正在加载 {game.label}...</p>
        )}
        {error && (
          <div ref={statusRef} className="song-catalog-page__status song-catalog-page__status--error" data-motion-section>
            <span role="alert">{error}</span>
            <button
              type="button"
              className="song-catalog-page__retry"
              onClick={refetch}
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div data-motion-section>
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
              sortOptions={game.sortOptions}
            />

            {activeTags.length > 0 && (
              <ul className="song-catalog-active" aria-label="已应用筛选">
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
            </div>

            <div className="song-catalog-page__body" data-motion-section>
              <section
                className="song-catalog-page__results"
                aria-label="结果"
              >
                {renderPagination()}
                <div ref={resultsRef} className="song-catalog-view">
                {isSelectionView ? <SongSelectionView
                  sheets={sortedSheets}
                  gameId={game.id}
                  selectedKey={validSelectedKey}
                  onSelect={setSelectedKey}
                  onOpen={handleSelectSheet}
                /> : <ResultComponent
                  key={resultKey}
                  {...resultProps}
                />}
                </div>
                {renderPagination()}
              </section>
              <SongRandomPanel
                history={history}
                latest={latest}
                onDrawAgain={handleDrawRandom}
                canDraw={canDraw}
                isDrawing={isDrawing}
                onClearHistory={handleClearHistory}
                onSelectEntry={handleSelectHistoryEntry}
              />
            </div>
          </>
        )}

        <footer className="song-catalog-page__sources" aria-label="数据来源" data-motion-section>
          <a href={`${game.dataSource}/data.json`} target="_blank" rel="noreferrer">数据：cloudfront CDN (arcade-songs mirror)</a>
          <span>
            {data
              ? `${filteredSongs.length} / ${data.songs.length} 首歌曲`
              : '—'}
          </span>
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
