import useStationClock from '../../hooks/useStationClock';
import useStationWeather from '../../hooks/useStationWeather';

const StationWeather = () => {
  const weather = useStationWeather();
  const stationClock = useStationClock();

  return (
    <aside className="station-weather" aria-labelledby="station-weather-title">
      <div className="station-weather__command">weather --station creatl --live</div>
      <div className="station-weather__display">
        <div className="station-weather__rule" />
        <div className="station-weather__head">
          <time dateTime={weather.stationDate}>
            {weather.stationDate.replaceAll('-', '.')}
          </time>
          <span id="station-weather-title">{weather.condition}</span>
        </div>
        <div className="station-weather__rule" />
        <div className="station-weather__body">
          <div className="station-weather__temperature">
            {weather.temperature} C
          </div>
          <dl className="station-weather__details">
            <div>
              <dt>Wind</dt>
              <dd>
                {weather.wind} KM/H {weather.direction}
              </dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{weather.humidity}%</dd>
            </div>
            <div>
              <dt>Signal</dt>
              <dd>{weather.signal}%</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="station-weather__output">
        Forecasting for this personal network
      </p>
      <p className="station-weather__note">
        站内虚构预报，不使用访客定位或真实天气接口。
      </p>
      <div className="station-weather__origin">
        CREATL STATION / GENERATED INTERNAL CLIMATE
      </div>
      <time className="station-weather__time" dateTime={weather.stationDate}>
        {stationClock} / {weather.timezone}
      </time>
    </aside>
  );
};

export default StationWeather;
