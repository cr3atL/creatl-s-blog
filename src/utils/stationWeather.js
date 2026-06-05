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
    label: 'Clear transmission',
    status: '晴朗信号',
    ascii: '\\  |  /\n .-*-.\n/  |  \\',
  },
  {
    label: 'Drifting static',
    status: '微弱静电',
    ascii: '. . .\n -=+=-\n. . .',
  },
  {
    label: 'Quiet overcast',
    status: '云层缓存',
    ascii: '  .--.\n (____)\n  `--`',
  },
  {
    label: 'Light data rain',
    status: '夜间脉冲',
    ascii: '  *\n /|\\\n / \\',
  },
];
const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const pick = (items, random) => items[Math.floor(random() * items.length)];
const range = (min, max, random) => Math.round(min + random() * (max - min));

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

export const generateStationWeather = (date = new Date(), offsetDays = 0) => {
  const { stationDate, stationHour } = getStationDateParts(date, offsetDays);
  const random = createSeededRandom(`creatl-station:${stationDate}`);
  const condition = pick(conditions, random);
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

  return {
    stationName: 'CreatL Station',
    stationDate,
    stationHour,
    timezone: STATION_TIME_ZONE,
    condition: condition.label,
    status: condition.status,
    ascii: condition.ascii,
    temperature: seasonalBase + range(-4, 4, random) + hourAdjustment,
    wind: range(5, 24, random),
    direction: pick(directions, random),
    humidity: range(42, 84, random),
    signal: range(72, 99, random),
  };
};
