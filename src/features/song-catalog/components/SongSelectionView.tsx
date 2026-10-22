import type { CSSProperties, KeyboardEvent } from 'react';
import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CatalogSheet } from '../types';
import { getSheetKey, sheetLevelLabel } from '../utils/sheetIdentity';
import SongSheetInfo from './SongSheetInfo';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { motion } from '../../../motion/tokens';
import { playCatalogMotion, useCatalogFade } from '../hooks/useCatalogMotion';
import useWheelSelection from '../../../hooks/useWheelSelection';

export const SELECTION_ROW_HEIGHT = 48;
const OVERSCAN = 4;
interface Props {
  sheets: CatalogSheet[];
  gameId: string;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onOpen: (sheet: CatalogSheet) => void;
}

export default function SongSelectionView({ sheets, gameId, selectedKey, onSelect, onOpen }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const movement = useRef<Animation | null>(null);
  const programmaticTop = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const lastScrolledKey = useRef<string | null>(null);
  const previousSheets = useRef(sheets);
  const [viewport, setViewport] = useState({ height: 432, top: 0 });
  const listId = useId();
  const { keys, indices, songs } = useMemo(() => {
    const keys = sheets.map((sheet) => getSheetKey(sheet, gameId));
    const indices = new Map(keys.map((key, index) => [key, index]));
    const songs = new Map<string, CatalogSheet[]>();
    for (const sheet of sheets) {
      const songKey = JSON.stringify([sheet.songId, sheet.songType, sheet.songVersion]);
      const siblings = songs.get(songKey) || [];
      siblings.push(sheet);
      songs.set(songKey, siblings);
    }
    return { keys, indices, songs };
  }, [sheets, gameId]);
  const selectedIndex = indices.get(selectedKey || '') ?? 0;
  const selected = sheets[selectedIndex];
  const padding = Math.max(0, (viewport.height - SELECTION_ROW_HEIGHT) / 2);
  const center = Math.round(viewport.top / SELECTION_ROW_HEIGHT);
  const radius = Math.ceil(viewport.height / SELECTION_ROW_HEIGHT / 2) + OVERSCAN;
  const windowCenter = Math.abs(selectedIndex - center) > radius ? selectedIndex : center;
  const start = Math.max(0, windowCenter - radius);
  const end = Math.min(sheets.length, windowCenter + radius + 1);
  useCatalogFade(previewRef, keys[selectedIndex], lastScrolledKey.current !== selectedKey);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => setViewport((current) => ({ ...current, height: list.clientHeight || 432 }));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    const windowNode = windowRef.current;
    const transform = windowNode ? getComputedStyle(windowNode).transform : '';
    const matrix = transform.match(/^matrix(3d)?\((.+)\)$/);
    const translation = matrix ? Number(matrix[2].split(',')[matrix[1] ? 13 : 5]) || 0 : 0;
    movement.current?.cancel();
    movement.current = null;
    if (!list) return;
    if (previousSheets.current !== sheets) lastScrolledKey.current = null;
    previousSheets.current = sheets;
    if (lastScrolledKey.current === selectedKey) return;
    const top = selectedIndex * SELECTION_ROW_HEIGHT;
    const distance = Math.max(-SELECTION_ROW_HEIGHT, Math.min(SELECTION_ROW_HEIGHT, top - list.scrollTop + translation));
    if (list.scrollTop !== top) programmaticTop.current = top;
    list.scrollTop = top;
    setViewport((current) => current.top === top ? current : { ...current, top });
    if (!reducedMotion && distance !== 0) {
      movement.current = playCatalogMotion(windowNode,
        [{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }], {
          duration: motion.duration.fast, easing: motion.easing.move,
        });
    }
  }, [selectedKey, selectedIndex, sheets, reducedMotion]);
  useLayoutEffect(() => () => { movement.current?.cancel(); }, []);

  const choose = (index: number) => {
    lastScrolledKey.current = null;
    onSelect(keys[(index + sheets.length) % sheets.length]);
  };
  useWheelSelection(listRef, (direction) => choose(selectedIndex + direction), {
    enabled: sheets.length > 1, resetKey: gameId,
  });
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !selected) return;
    switch (event.key) {
      case 'ArrowUp': event.preventDefault(); choose(selectedIndex - 1); break;
      case 'ArrowDown': event.preventDefault(); choose(selectedIndex + 1); break;
      case 'Home': event.preventDefault(); choose(0); break;
      case 'End': event.preventDefault(); choose(sheets.length - 1); break;
      case 'PageUp': event.preventDefault(); choose(Math.max(0, selectedIndex - 8)); break;
      case 'PageDown': event.preventDefault(); choose(Math.min(sheets.length - 1, selectedIndex + 8)); break;
      case 'Enter': case ' ': event.preventDefault(); onOpen(selected); break;
    }
  };

  if (!selected) return <p className="song-catalog-empty" role="status">无结果，请调整或清空筛选条件。</p>;
  const siblings = songs.get(JSON.stringify([selected.songId, selected.songType, selected.songVersion])) || [];
  const available = new Set(siblings.map((item) => JSON.stringify([item.id, item.type])));
  return (
    <div className="song-selection">
      <div ref={previewRef} className="song-selection__preview">
        <SongSheetInfo sheet={selected} onOpen={() => onOpen(selected)} availableDifficulties={available}
          onChooseDifficulty={(id, type) => {
            const sibling = siblings.find((item) => item.id === id && item.type === type);
            if (sibling) { lastScrolledKey.current = null; onSelect(getSheetKey(sibling, gameId)); }
          }} />
      </div>
      <div className="song-selection__browse">
        <div className="song-selection__position" aria-live="polite">{selectedIndex + 1} / {sheets.length}</div>
        <div ref={listRef} className="song-selection__list" role="listbox" tabIndex={0}
          aria-label="选曲列表" aria-activedescendant={`${listId}-${selectedIndex}`}
          onKeyDown={handleKeyDown}
          onScroll={(event) => {
            const top = event.currentTarget.scrollTop;
            setViewport((current) => ({ ...current, top }));
            if (programmaticTop.current === top) { programmaticTop.current = null; return; }
            programmaticTop.current = null;
            movement.current?.cancel();
            movement.current = null;
            const index = Math.min(sheets.length - 1, Math.max(0, Math.round(top / SELECTION_ROW_HEIGHT)));
            lastScrolledKey.current = keys[index];
            onSelect(keys[index]);
          }}>
          <div ref={windowRef} className="song-selection__window" role="presentation"
            style={{ height: sheets.length * SELECTION_ROW_HEIGHT + padding * 2 } as CSSProperties}>
            {sheets.slice(start, end).map((sheet, offset) => {
              const index = start + offset;
              return (
                <div key={keys[index]} id={`${listId}-${index}`} role="option"
                  aria-selected={index === selectedIndex} aria-setsize={sheets.length} aria-posinset={index + 1}
                  className={`song-selection__slot${index === selectedIndex ? ' is-selected' : ''}`}
                  style={{ top: padding + index * SELECTION_ROW_HEIGHT }}
                  onClick={() => { choose(index); listRef.current?.focus(); onOpen(sheet); }}>
                  <div className="song-selection__row">
                    <span className="song-selection__marker" aria-hidden="true">{index === selectedIndex ? '›' : ''}</span>
                    <span className="song-selection__name" title={sheet.songTitle}>{sheet.songTitle || '未命名曲目'}</span>
                    <span className="song-selection__difficulty">
                      {new Set(sheet.songSheets.map((sibling) => sibling.type)).size > 1 && `${sheet.type.toUpperCase()} `}{sheet.difficulty}
                    </span>
                    <strong className="song-selection__level">{sheetLevelLabel(sheet)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
