import useStationClock from '../../hooks/useStationClock';
import useStationWeather from '../../hooks/useStationWeather';

const StationWeather = () => {
  const weather = useStationWeather();
  const stationClock = useStationClock();

  return (
    <aside className="station-weather" aria-labelledby="station-weather-title">
      <div className="station-weather__command">weather --station creatl --live</div>
      <div className="station-weather__display" data-weather={weather.status}>
        <div className="station-weather__rule" />
        <div className="station-weather__head">
          <time dateTime={weather.stationDate}>
            {weather.stationDate.replaceAll('-', '.')}
          </time>
          <span id="station-weather-title">{weather.condition}</span>
        </div>
        <div className="station-weather__rule" />
        <div className="station-weather__body">
          <div className="station-weather__primary">
            <div className="station-weather__temperature">
              {weather.temperature} °F
            </div>
            <pre className="station-weather__ascii" aria-hidden="true">
              {weather.ascii}
            </pre>
          </div>
          <dl className="station-weather__details">
            <div>
              <dt>Wind</dt>
              <dd>
                {weather.wind} mph {weather.direction}
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
            <div>
              <dt>Pulse</dt>
              <dd>{weather.pulse}/9</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="station-weather__output">
        Event: {weather.event}
      </p>
      <p className="station-weather__note">
        站内虚构天气，随时间缓慢变化。不使用真实定位。
      </p>
      <div className="station-weather__origin">
        CREATL STATION / GENERATED INTERNAL CLIMATE
      </div>
      <time className="station-weather__time" dateTime={weather.stationDate}>
        {stationClock}
      </time>
    </aside>
  );
};

export default StationWeather;
