import { useCallback, useMemo, useState } from 'react';
import {
  applySongFilters,
  countActiveSongFilters,
  createDefaultSongFilters,
  createSongFilterOptions,
  getActiveSongFilterTags,
} from '../utils/genericSongFilters';

const cloneFilters = (filters) => ({
  ...filters,
  difficultyFilter: [...filters.difficultyFilter],
  versionFilter: [...filters.versionFilter],
  typeFilter: [...filters.typeFilter],
  levelRange: [...filters.levelRange],
});

const clearValueForKey = (key, config) => {
  if (key === 'searchText') {
    return '';
  }

  if (key === 'levelRange') {
    return [...config.levelRange.default];
  }

  return [];
};

const useSongFilters = (songs, config) => {
  const defaultFilters = useMemo(() => createDefaultSongFilters(config), [config]);
  const [filters, setFilters] = useState(defaultFilters);
  const [tempFilters, setTempFilters] = useState(defaultFilters);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const options = useMemo(
    () => createSongFilterOptions(songs, config),
    [songs, config]
  );

  const filteredSongs = useMemo(
    () => applySongFilters(songs, filters, config),
    [songs, filters, config]
  );

  const activeFilterCount = useMemo(
    () => countActiveSongFilters(filters, config),
    [filters, config]
  );

  const activeTags = useMemo(
    () => getActiveSongFilterTags(filters, config),
    [filters, config]
  );

  const tempActiveTags = useMemo(
    () => getActiveSongFilterTags(tempFilters, config),
    [tempFilters, config]
  );

  const openFilterModal = useCallback(() => {
    setTempFilters(cloneFilters(filters));
    setFilterModalVisible(true);
  }, [filters]);

  const closeFilterModal = useCallback(() => {
    setFilterModalVisible(false);
  }, []);

  const applyTempFilters = useCallback(() => {
    setFilters(cloneFilters(tempFilters));
    setFilterModalVisible(false);
  }, [tempFilters]);

  const resetTempFilters = useCallback(() => {
    setTempFilters(cloneFilters(defaultFilters));
  }, [defaultFilters]);

  const setTempFilter = useCallback((key, value) => {
    setTempFilters((current) => ({
      ...current,
      [key]: Array.isArray(value) ? [...value] : value,
    }));
  }, []);

  const setFilter = useCallback((key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: Array.isArray(value) ? [...value] : value,
    }));
  }, []);

  const clearFilter = useCallback(
    (key) => {
      setFilter(key, clearValueForKey(key, config));
    },
    [config, setFilter]
  );

  const clearTempFilter = useCallback(
    (key) => {
      setTempFilter(key, clearValueForKey(key, config));
    },
    [config, setTempFilter]
  );

  return {
    filters,
    tempFilters,
    options,
    filteredSongs,
    activeFilterCount,
    activeTags,
    tempActiveTags,
    filterModalVisible,
    openFilterModal,
    closeFilterModal,
    applyTempFilters,
    resetTempFilters,
    setFilter,
    setTempFilter,
    clearFilter,
    clearTempFilter,
  };
};

export default useSongFilters;
