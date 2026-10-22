import games from './config/games';
import { applySongFilters, createDefaultFilters } from './utils/filterSheets';
import { normalizeSongData } from './utils/normalizeSongData';

test.each(games)('$id search matches mixed case titles and artists', (game) => {
  const songs = normalizeSongData({ songs: [{ title: 'Aleph-0', artist: 'Camellia', sheets: [] }] }, game.dataSource).songs;
  for (const searchText of ['ALEPH', 'aLePh', 'CAMELLIA', 'cAmElLiA']) {
    expect(applySongFilters(songs, { ...createDefaultFilters(game.filterConfig), searchText }, game.filterConfig)).toHaveLength(1);
  }
});
