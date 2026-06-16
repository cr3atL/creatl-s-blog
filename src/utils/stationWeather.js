import { createSeededRandom } from './seededRandom';

export const STATION_TIME_ZONE = 'Asia/Shanghai';

const dayMs = 24 * 60 * 60 * 1000;
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: STATION_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hourCycle: 'h23',
});

const conditions = [
  {
    label: 'Clear signal',
    status: 'clear',
    event: 'soft light over the terminal garden',
    tempOffset: 3,
    wind: [3, 8],
    humidity: [35, 52],
    asciiFrames: [
      '\\  |  /\n .-*-.\n/  |  \\',
      '   |   \n .-*-.\n   |   ',
      '\\  .  /\n .-*-.\n/  .  \\',
      ' . | . \n .-*-.\n . | . ',
      '\\     /\n .-*-.\n/     \\',
    ],
  },
  {
    label: 'Drifting static',
    status: 'static',
    event: 'low static passing through the archive rail',
    tempOffset: 0,
    wind: [6, 14],
    humidity: [48, 68],
    asciiFrames: [
      '. . .\n -=+=-\n. . .',
      ' . . \n=+-+-=\n . . ',
      '.   .\n -=+=-\n  .  ',
      '  . .\n-=-+=\n. .  ',
      '. .  \n+=-=-\n  . .',
    ],
  },
  {
    label: 'Quiet overcast',
    status: 'overcast',
    event: 'cloud cache holding above the station',
    tempOffset: -2,
    wind: [4, 10],
    humidity: [58, 76],
    asciiFrames: [
      '  .--.\n (____)\n  `--`',
      ' .---.\n(_____)\n `---`',
      '  .--.\n(_____) \n  `--`',
      ' .--. \n(____)\n `--` ',
      '  .---\n (____)\n  ---`',
    ],
  },
  {
    label: 'Light data rain',
    status: 'rain',
    event: 'small packets falling along the signal line',
    tempOffset: -4,
    wind: [8, 16],
    humidity: [70, 88],
    asciiFrames: [
      '  .-.\n (___)\n / /',
      ' .-.\n(___)\n  / /',
      '  .-.\n (___)\n/ / ',
      ' .-. \n(___)\n /  /',
      '  .-.\n(___) \n  //',
    ],
  },
  {
    label: 'Warm boot breeze',
    status: 'breeze',
    event: 'warm boot air moving across the tools shelf',
    tempOffset: 4,
    wind: [7, 18],
    humidity: [38, 58],
    asciiFrames: [
      ' ~ ~\n  /)\n ~ ~',
      '~ ~ \n (/ \n~ ~ ',
      '  ~~\n  /)\n~~  ',
      '~   ~\n  /)\n ~  ~',
      ' ~~ \n (/ \n ~~ ',
    ],
  },
  {
    label: 'Midnight refresh',
    status: 'refresh',
    event: 'background refresh sweeping old dust away',
    tempOffset: -1,
    wind: [5, 12],
    humidity: [44, 64],
    asciiFrames: [
      '<-+\n  |\n+- >',
      ' <-\n+-+\n ->',
      '+->\n |\n<-+',
      '<--\n + \n-->',
      ' -+\n<-|->\n+- ',
    ],
  },
  {
    label: 'Low fog buffer',
    status: 'fog',
    event: 'thin fog buffering around the index cards',
    tempOffset: -3,
    wind: [2, 6],
    humidity: [72, 90],
    asciiFrames: [
      '____\n_  _\n____',
      '___ \n __ \n ___',
      ' ____\n__  _\n____ ',
      '__ __\n ____\n__ __',
      ' ___\n___ \n ___',
    ],
  },
  {
    label: 'Cold cache mist',
    status: 'mist',
    event: 'cold cache mist resting near the lower panels',
    tempOffset: -6,
    wind: [2, 7],
    humidity: [66, 86],
    asciiFrames: [
      '..__\n __.\n..__',
      '.__.\n_.._\n.__.',
      '__..\n.__ \n__..',
      ' .__\n__..\n .__',
      '__  \n .._\n__  ',
    ],
  },
  {
    label: 'Dry terminal heat',
    status: 'heat',
    event: 'dry terminal heat humming behind the screen',
    tempOffset: 7,
    wind: [3, 9],
    humidity: [28, 44],
    asciiFrames: [
      '  ^  \n / \\ \n  ^  ',
      ' ^ ^ \n  |  \n ^ ^ ',
      '  ^^\n /  \\\n^^  ',
      '^   ^\n  |  \n^   ^',
      ' ^^ \n  /\\\n ^^ ',
    ],
  },
  {
    label: 'Soft signal snow',
    status: 'snow',
    event: 'soft signal snow crossing the idle queue',
    tempOffset: -8,
    wind: [3, 10],
    humidity: [54, 74],
    asciiFrames: [
      '* . *\n .*. \n* . *',
      ' . * \n* . *\n . * ',
      '*   .\n .*. \n.   *',
      '  *  \n* . *\n  *  ',
      '. * .\n  *  \n. * .',
    ],
  },
];

const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const pick = (items, random) => items[Math.floor(random() * items.length)];
const range = (min, max, random) => Math.round(min + random() * (max - min));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);

export const getStationDateParts = (date = new Date(), offsetDays = 0) => {
  const shiftedDate = new Date(date.getTime() + offsetDays * dayMs);
  const parts = formatter.formatToParts(shiftedDate).reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});

  return {
    stationDate: `${parts.year}-${parts.month}-${parts.day}`,
    stationHour: Number(parts.hour),
  };
};

export const generateStationWeather = (date = new Date(), offsetDays = 0, eventTick = 0) => {
  const { stationDate, stationHour } = getStationDateParts(date, offsetDays);
  const stableRandom = createSeededRandom(`creatl-station:${stationDate}:${stationHour}`);
  const driftRandom = createSeededRandom(
    `creatl-station-drift:${stationDate}:${stationHour}:${eventTick}`
  );
  const condition = pick(conditions, stableRandom);
  const month = Number(stationDate.slice(5, 7));
  const seasonalBase = month >= 5 && month <= 9 ? 25 : month >= 11 || month <= 2 ? 12 : 19;
  const hourAdjustment =
    stationHour >= 6 && stationHour <= 10
      ? -1
      : stationHour >= 13 && stationHour <= 17
        ? 2
        : stationHour >= 22 || stationHour <= 4
          ? -2
          : 0;
  const baseCelsius =
    seasonalBase + condition.tempOffset + range(-2, 2, stableRandom) + hourAdjustment;
  const driftCelsius = range(-1, 1, driftRandom);
  const [windMin, windMax] = condition.wind;
  const [humidityMin, humidityMax] = condition.humidity;
  const windBase = range(windMin, windMax, stableRandom);
  const humidityBase = range(humidityMin, humidityMax, stableRandom);
  const frameIndex = Math.abs(eventTick) % condition.asciiFrames.length;

  return {
    stationName: 'CreatL Station',
    stationDate,
    stationHour,
    timezone: STATION_TIME_ZONE,
    condition: condition.label,
    status: condition.status,
    event: condition.event,
    ascii: condition.asciiFrames[frameIndex],
    temperature: celsiusToFahrenheit(baseCelsius + driftCelsius),
    wind: clamp(windBase + range(-2, 2, driftRandom), 2, 24),
    direction: pick(directions, stableRandom),
    humidity: clamp(humidityBase + range(-4, 4, driftRandom), 30, 92),
    signal: range(82, 99, stableRandom),
    pulse: (Math.abs(eventTick) % 9) + 1,
  };
};
