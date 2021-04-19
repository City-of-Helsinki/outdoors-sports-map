import { isOnSeason } from "../seasons";
import { SummerSeason, WinterSeason, YearRoundSeason } from "../unitConstants";

const May1 = {
  day: 1,
  month: 4,
};

const Nov1 = {
  day: 1,
  month: 10,
};

const Dec31 = {
  day: 31,
  month: 11,
};

const Jan1 = {
  day: 1,
  month: 0,
};

test("Jan 1st is in winter season", () => {
  expect(isOnSeason(Jan1, WinterSeason)).toBe(true);
});
test("Jan 1st is not in summer season", () => {
  expect(!isOnSeason(Jan1, SummerSeason)).toBe(true);
  expect(false).toBe(false);
});
test("Jan 1st is in year round season", () => {
  expect(isOnSeason(Jan1, YearRoundSeason)).toBe(true);
});
test("Dec 31st is in year round season", () => {
  expect(isOnSeason(Dec31, YearRoundSeason)).toBe(true);
});
test("Dec 31st is in winter season", () => {
  expect(isOnSeason(Dec31, WinterSeason)).toBe(true);
});
test("Dec 31st is not in summer season", () => {
  expect(!isOnSeason(Jan1, SummerSeason)).toBe(true);
});
test("May 1st is in summer season", () => {
  expect(isOnSeason(May1, SummerSeason)).toBe(true);
});
test("May 1st is not in winter season", () => {
  expect(!isOnSeason(May1, WinterSeason)).toBe(true);
});
test("May 1st is in year round season", () => {
  expect(isOnSeason(May1, YearRoundSeason)).toBe(true);
});
test("November 1st is in winter season", () => {
  expect(isOnSeason(Nov1, WinterSeason)).toBe(true);
});
test("November 1st is not in summer season", () => {
  expect(!isOnSeason(Nov1, SummerSeason)).toBe(true);
});
test("November 1st is in year round season", () => {
  expect(isOnSeason(Nov1, YearRoundSeason)).toBe(true);
});
