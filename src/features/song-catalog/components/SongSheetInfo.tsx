import type { CatalogSheet } from '../types';
import { metadataLabel, sheetLevelLabel } from '../utils/sheetIdentity';
import SongCover from './SongCover';

interface Props {
  sheet: CatalogSheet;
  onOpen?: () => void;
  onChooseDifficulty?: (id: string, type: string) => void;
  availableDifficulties?: Set<string>;
}

export default function SongSheetInfo({ sheet, onOpen, onChooseDifficulty, availableDifficulties }: Props) {
  const showType = new Set(sheet.songSheets.map((sibling) => sibling.type)).size > 1;
  return (
    <article className="song-sheet-info" aria-label="当前谱面">
      <SongCover src={sheet.imageUrl || sheet.songImageUrl} />
      <div className="song-sheet-info__heading">
        <h2>{sheet.songTitle || '未命名曲目'}</h2>
        <p>{sheet.songArtist || '艺术家未知'}</p>
      </div>
      <div className="song-sheet-info__picked">
        <strong>{sheet.difficulty}</strong><span>Lv. {sheetLevelLabel(sheet)}</span>
        {sheet.internalLevelValue != null && <span>定数 {sheet.internalLevelValue.toFixed(1)}</span>}
      </div>
      {sheet.songSheets.length > 1 && (
        <div className="song-sheet-info__difficulties" role="group" aria-label="歌曲谱面">
          {sheet.songSheets.map((sibling) => {
            const identity = JSON.stringify([sibling.id, sibling.type]);
            const active = sibling.id === sheet.id && sibling.type === sheet.type;
            return onChooseDifficulty ? (
              <button key={identity} type="button" aria-pressed={active}
                disabled={!availableDifficulties?.has(identity)}
                onClick={() => onChooseDifficulty(sibling.id, sibling.type)}>
                {showType && `${sibling.type.toUpperCase()} `}{sibling.difficulty} {sheetLevelLabel(sibling)}
              </button>
            ) : <span key={identity} className={active ? 'is-active' : ''}>
              {showType && `${sibling.type.toUpperCase()} `}{sibling.difficulty} {sheetLevelLabel(sibling)}
            </span>;
          })}
        </div>
      )}
      <dl className="song-sheet-info__meta">
        <div><dt>版本</dt><dd>{metadataLabel(sheet.songVersion)}</dd></div>
        <div><dt>BPM</dt><dd>{sheet.songBpm ?? '—'}</dd></div>
        <div><dt>类型</dt><dd>{metadataLabel(sheet.type || sheet.songType)}</dd></div>
        <div><dt>分类</dt><dd>{metadataLabel(sheet.songCategory)}</dd></div>
        <div><dt>谱师</dt><dd>{metadataLabel(sheet.noteDesigner)}</dd></div>
        <div><dt>物量</dt><dd>{sheet.notes ?? sheet.noteCounts?.total ?? '—'}</dd></div>
      </dl>
      {onOpen && <button type="button" className="song-sheet-info__open" onClick={onOpen}>查看详情</button>}
    </article>
  );
}
