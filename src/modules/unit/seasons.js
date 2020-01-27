// @flow
import type {SeasonDelimiter, Season} from './constants';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';

export const isOnSeason = (date: SeasonDelimiter, season: Season) =>
  isBetweenDelimiters(date, season.start, season.end);


export const isBefore = (date: SeasonDelimiter, compare: SeasonDelimiter): boolean =>
  date.month < compare.month || date.month === compare.month && date.day < compare.day;
export const isAfter = (date: SeasonDelimiter, compare: SeasonDelimiter): boolean =>
  date.month > compare.month || date.month === compare.month && date.day > compare.day;
export const isBetweenDelimiters = (date: SeasonDelimiter, start: SeasonDelimiter, end: SeasonDelimiter): boolean => {
  const endBeforeStart = isBefore(end, start);
  const dateBeforeStart = isBefore(date, start);

  // Adjust dates for seasons that last over new year's
  const adjustedDate = Object.assign({}, date, {
    month: endBeforeStart && dateBeforeStart ?  date.month + 12 : date.month,
  });

  const adjustedEnd = Object.assign({}, end, {
    month: endBeforeStart ? end.month + 12 : end.month,
  });

  return !isBefore(adjustedDate, start) && !isAfter(adjustedDate, adjustedEnd);
};

export const getSeasonDelimiter = (date: Date): SeasonDelimiter =>
  ({
    day: getDate(date),
    month: getMonth(date),
  });

export const getToday = (): SeasonDelimiter =>
  getSeasonDelimiter(new Date());