import { directory } from './directory';
import type { FolderId, FolderSelection, SelectorSnapshot } from './types';

export const parseFolder = (search: string): FolderId => {
  const folder = new URLSearchParams(search).get('folder');
  return folder === 'catalog' || folder === 'tools' ? folder : 'root';
};

export const folderSearch = (search: string, folder: FolderId) => {
  const params = new URLSearchParams(search);
  if (folder === 'root') params.delete('folder');
  else params.set('folder', folder);
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const readSnapshot = (state: unknown): SelectorSnapshot => {
  const raw = (state as { contentSelector?: SelectorSnapshot } | null)?.contentSelector;
  const selections: SelectorSnapshot['selections'] = {};
  for (const folder of ['root', 'catalog', 'tools'] as const) {
    const item = raw?.selections?.[folder];
    if (item && typeof item.selectedId === 'string') {
      selections[folder] = {
        selectedId: item.selectedId,
        scrollTop: Number.isFinite(item.scrollTop) ? Math.max(0, item.scrollTop) : 0,
      };
    }
  }
  return { selections, enteredFromRoot: raw?.enteredFromRoot === true };
};

export const selectionFor = (snapshot: SelectorSnapshot, folder: FolderId): FolderSelection => {
  const saved = snapshot.selections[folder];
  return {
    selectedId: directory[folder].entries.some((entry) => entry.id === saved?.selectedId)
      ? saved!.selectedId : directory[folder].entries[0]?.id ?? '',
    scrollTop: saved?.scrollTop ?? 0,
  };
};
