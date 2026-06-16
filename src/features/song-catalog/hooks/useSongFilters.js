import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  applySongFilters,
  buildActiveFilterTags,
  cloneFilters,
  collectFilterOptions,
  createDefaultFilters,
  expandFilteredSongsToSheets,
  sortSheets,
} from '../utils/filterSheets';

const useSongFilters = (songs, config) => {
  const defaultFilters = useMemo(
    () => createDefaultFilters(config),
    [config]
  );

  const [filters, setFilters] = useState(defaultFilters);
  const [tempFilters, setTempFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
    setTempFilters(defaultFilters);
  }, [defaultFilters, config]);

  const options = useMemo(() => collectFilterOptions(songs || [], config), [
    songs,
    config,
  ]);

  const filteredSongs = useMemo(
    () => applySongFilters(songs || [], filters, config),
    [songs, filters, config]
  );

  const filteredSheets = useMemo(
    () => expandFilteredSongsToSheets(filteredSongs),
    [filteredSongs]
  );

  const activeTags = useMemo(() => buildActiveFilterTags(filters, config), [
    filters,
    config,
  ]);

  const tempActiveTags = useMemo(
    () => buildActiveFilterTags(tempFilters, config),
    [tempFilters, config]
  );

  const activeCount = activeTags.length;

  const applyTempFilters = useCallback(() => {
    setFilters(cloneFilters(tempFilters));
  }, [tempFilters]);

  const resetFilters = useCallback(() => {
    const next = cloneFilters(defaultFilters);
    setFilters(next);
    setTempFilters(cloneFilters(next));
  }, [defaultFilters]);

  const resetTempFilters = useCallback(() => {
    setTempFilters(cloneFilters(defaultFilters));
  }, [defaultFilters]);

  const setFilterValue = useCallback((key, value) => {
    const nextValue = Array.isArray(value) ? [...value] : value;
    setFilters((current) => ({
      ...current,
      [key]: nextValue,
    }));
    setTempFilters((current) => ({
      ...current,
      [key]: Array.isArray(value) ? [...value] : value,
    }));
  }, []);

  const setTempFilterValue = useCallback((key, value) => {
    setTempFilters((current) => ({
      ...current,
      [key]: Array.isArray(value) ? [...value] : value,
    }));
  }, []);

  const syncTempFilters = useCallback(() => {
    setTempFilters(cloneFilters(filters));
  }, [filters]);

  return {
    filters,
    tempFilters,
    setFilterValue,
    setTempFilterValue,
    syncTempFilters,
    applyTempFilters,
    resetFilters,
    resetTempFilters,
    options,
    filteredSongs,
    filteredSheets,
    activeTags,
    tempActiveTags,
    activeCount,
    sortSheets: (sortBy, sortDir) =>
      sortSheets(filteredSheets, sortBy, sortDir, config),
  };
};

export default useSongFilters;
