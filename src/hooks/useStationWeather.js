import { useEffect, useMemo, useState } from 'react';
import { generateStationWeather, getStationDateParts } from '../utils/stationWeather';

const getStationDateKey = () => getStationDateParts(new Date()).stationDate;

const useStationWeather = () => {
  const [stationDateKey, setStationDateKey] = useState(getStationDateKey);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextDateKey = getStationDateKey();
      setStationDateKey((currentDateKey) =>
        currentDateKey === nextDateKey ? currentDateKey : nextDateKey
      );
    }, 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  return useMemo(
    () => generateStationWeather(new Date(`${stationDateKey}T12:00:00+08:00`)),
    [stationDateKey]
  );
};

export default useStationWeather;
