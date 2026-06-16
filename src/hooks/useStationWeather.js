import { useEffect, useMemo, useState } from 'react';
import { generateStationWeather, getStationDateParts } from '../utils/stationWeather';

const refreshMs = 10000;
const getStationDateKey = () => getStationDateParts(new Date()).stationDate;

const useStationWeather = () => {
  const [stationDateKey, setStationDateKey] = useState(getStationDateKey);
  const [eventTick, setEventTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextDateKey = getStationDateKey();
      setStationDateKey((currentDateKey) =>
        currentDateKey === nextDateKey ? currentDateKey : nextDateKey
      );
      setEventTick((currentTick) => currentTick + 1);
    }, refreshMs);

    return () => window.clearInterval(timer);
  }, []);

  return useMemo(
    () => generateStationWeather(new Date(`${stationDateKey}T12:00:00+08:00`), 0, eventTick),
    [eventTick, stationDateKey]
  );
};

export default useStationWeather;
