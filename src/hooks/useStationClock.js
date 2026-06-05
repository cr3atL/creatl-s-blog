import { useEffect, useState } from 'react';
import { STATION_TIME_ZONE } from '../utils/stationWeather';

const clockFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: STATION_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const getStationClock = () => clockFormatter.format(new Date());

const useStationClock = () => {
  const [stationClock, setStationClock] = useState(getStationClock);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStationClock(getStationClock());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return stationClock;
};

export default useStationClock;
