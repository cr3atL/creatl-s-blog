export type FolderId = 'root' | 'catalog' | 'tools';

export type ContentEntry = {
  id: string;
  title: string;
  icon: 'catalog' | 'article' | 'tools' | 'about' | 'game' | 'image' | 'form';
  analyticsLabel?: string;
} & ({ kind: 'folder'; folder: Exclude<FolderId, 'root'> } | { kind: 'route'; path: string });

export interface FolderSelection {
  selectedId: string;
  scrollTop: number;
}

export interface SelectorSnapshot {
  selections: Partial<Record<FolderId, FolderSelection>>;
  enteredFromRoot?: boolean;
}
