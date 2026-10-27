import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { AppstoreOutlined, ArrowLeftOutlined, ArrowRightOutlined, FileTextOutlined, FolderOpenOutlined, PictureOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { directory } from './directory';
import { folderSearch, parseFolder, readSnapshot, selectionFor } from './selectorState';
import { trackEvent } from '../../utils/analytics';
import useDirectoryMotion from './useDirectoryMotion';
import useWheelSelection from '../../hooks/useWheelSelection';
import type { ContentEntry, SelectorSnapshot } from './types';
import type { CSSProperties, KeyboardEvent } from 'react';

const icons = { catalog: AppstoreOutlined, article: FileTextOutlined, tools: ToolOutlined,
  about: UserOutlined, game: AppstoreOutlined, image: PictureOutlined, form: FileTextOutlined };

export default function ContentSelector() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const folder = parseFolder(location.search);
  const snapshot = readSnapshot(location.state);
  const selection = selectionFor(snapshot, folder);
  const entries = directory[folder].entries;
  const selectedIndex = entries.findIndex((entry) => entry.id === selection.selectedId);
  const listRef = useRef<HTMLUListElement>(null);
  const regionRef = useRef<HTMLElement>(null);
  useDirectoryMotion(listRef, folder, selection.selectedId);
  const rowRefs = useRef(new Map<string, HTMLButtonElement | HTMLAnchorElement>());
  const lastFolder = useRef(folder);
  const mounted = useRef(false);
  const folderMemories = useRef(snapshot.selections);
  folderMemories.current[folder] = selection;

  const stateWith = (next: SelectorSnapshot) => ({ ...location.state, contentSelector: next });
  const saveSelection = (id: string, scrollTop = listRef.current?.scrollTop ?? 0) => {
    if (id === selection.selectedId && scrollTop === selection.scrollTop) return;
    const next = { ...snapshot, selections: { ...snapshot.selections, [folder]: { selectedId: id, scrollTop } } };
    navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, {
      replace: true, state: stateWith(next), preventScrollReset: true,
    });
  };

  const selectEntry = (id: string) => {
    if (id === selection.selectedId) return;
    if (listRef.current?.contains(document.activeElement)) {
      rowRefs.current.get(id)?.focus({ preventScroll: true });
    } else {
      saveSelection(id);
    }
  };

  useWheelSelection(regionRef, (direction) => {
    const next = entries[(selectedIndex + direction + entries.length) % entries.length];
    selectEntry(next.id);
  }, { enabled: entries.length > 1, resetKey: folder });

  useLayoutEffect(() => {
    const changedFolder = lastFolder.current !== folder;
    const restoring = navigationType === 'POP' && Boolean(location.state?.contentSelector);
    if (changedFolder || !mounted.current || navigationType === 'POP') {
      if (listRef.current) listRef.current.scrollTop = selection.scrollTop;
      if (changedFolder || restoring) rowRefs.current.get(selection.selectedId)?.focus({ preventScroll: true });
    }
    mounted.current = true;
    lastFolder.current = folder;
  }, [folder, location.key, navigationType, selection.selectedId, selection.scrollTop, location.state]);

  const enter = (entry: ContentEntry) => {
    if (entry.kind !== 'folder') return;
    const next: SelectorSnapshot = {
      selections: { ...snapshot.selections, ...folderMemories.current, [folder]: { selectedId: entry.id, scrollTop: listRef.current?.scrollTop ?? 0 } },
      enteredFromRoot: true,
    };
    // Replace the parent snapshot before pushing the child; Router retains its own history fields.
    navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, { replace: true, state: stateWith(next), preventScrollReset: true });
    navigate({ pathname: location.pathname, search: folderSearch(location.search, entry.folder), hash: location.hash }, { state: stateWith(next), preventScrollReset: true });
    trackEvent('Navigation', 'Click', entry.id === 'catalog' ? 'Song_Catalog_Home' : entry.id === 'games' ? 'Games_Directory' : 'Tools_Directory');
  };

  const back = () => {
    if (folder === 'root') return;
    if (snapshot.enteredFromRoot) { navigate(-1); return; }
    const next = { ...snapshot, selections: { ...snapshot.selections, root: { selectedId: folder, scrollTop: 0 } } };
    navigate({ pathname: location.pathname, search: folderSearch(location.search, 'root'), hash: location.hash }, { state: stateWith(next), preventScrollReset: true });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!(event.target instanceof HTMLElement) || !event.target.matches('.content-selector__row')) return;
    if (event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowLeft' && folder !== 'root') { event.preventDefault(); back(); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = entries.findIndex((entry) => entry.id === selection.selectedId);
    const next = entries[(index + (event.key === 'ArrowDown' ? 1 : -1) + entries.length) % entries.length];
    if (next) {
      rowRefs.current.get(next.id)?.focus({ preventScroll: true });
      rowRefs.current.get(next.id)?.scrollIntoView?.({ block: 'nearest' });
    }
  };

  return (
    <section ref={regionRef} className="content-selector" aria-label="内容目录">
      <div className="content-selector__heading">
        <h2 aria-live="polite"><span>creatL</span><span aria-hidden="true"> / </span>{folder !== 'root' && directory[folder].title}</h2>
        {folder !== 'root' && <button type="button" className="content-selector__back" onClick={back}><ArrowLeftOutlined aria-hidden="true" /> 返回</button>}
      </div>
      <div className="content-selector__stage">
      <ul className="content-selector__list" ref={listRef} onKeyDown={onKeyDown}
        style={{ '--selector-count': entries.length, '--selector-index': selectedIndex } as CSSProperties}
        onScroll={() => saveSelection(selection.selectedId)} aria-label={folder === 'root' ? '主目录' : directory[folder].title}>
        {entries.map((entry) => {
          const Icon = entry.kind === 'folder' ? FolderOpenOutlined : icons[entry.icon];
          const selected = entry.id === selection.selectedId;
          const props = {
            className: `content-selector__row${selected ? ' is-selected' : ''}`,
            tabIndex: selected ? 0 : -1,
            onMouseEnter: () => selectEntry(entry.id),
            onFocus: () => saveSelection(entry.id),
            'data-selected': selected,
            ref: (node: HTMLButtonElement | HTMLAnchorElement | null) => { if (node) rowRefs.current.set(entry.id, node); else rowRefs.current.delete(entry.id); },
          };
          const content = <><Icon className="content-selector__icon" aria-hidden="true" /><span className="content-selector__title">{entry.title}</span><ArrowRightOutlined className="content-selector__arrow" aria-hidden="true" /></>;
          return <li key={entry.id}>{entry.kind === 'folder'
            ? <button type="button" {...props} onClick={() => enter(entry)}>{content}</button>
            : <Link {...props} to={entry.path} target={entry.external ? '_blank' : undefined}
              rel={entry.external ? 'noopener noreferrer' : undefined}
              onClick={() => { saveSelection(entry.id); trackEvent('Navigation', 'Click', entry.analyticsLabel ?? entry.id); }}>{content}</Link>}</li>;
        })}
      </ul>
      </div>
      {entries.length === 0 && <p>这个目录还没有内容。</p>}
    </section>
  );
}
