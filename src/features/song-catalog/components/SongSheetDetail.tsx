import type { CatalogSheet } from '../types';
import SongSheetInfo from './SongSheetInfo';
import CatalogDialog from './CatalogDialog';

export default function SongSheetDetail({ sheet, onClose }: { sheet: CatalogSheet | null; onClose: () => void }) {
  return (
    <CatalogDialog open={Boolean(sheet)} onClose={onClose} label="谱面详情" className="song-catalog-detail">
      {sheet && <>
        <button type="button" className="song-catalog-detail__close" onClick={onClose} aria-label="关闭详情">×</button>
        <SongSheetInfo sheet={sheet} />
        {sheet.noteCounts && Object.values(sheet.noteCounts).some((value) => value !== null) && <dl className="song-sheet-info__notes">
          {Object.entries(sheet.noteCounts).filter(([, count]) => count !== null).map(([name, count]) => <div key={name}>
            <dt>{name.toUpperCase()}</dt><dd>{count ?? '—'}</dd>
          </div>)}
        </dl>}
      </>}
    </CatalogDialog>
  );
}
