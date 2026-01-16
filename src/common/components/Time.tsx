import { endOfDay, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from "date-fns";
import { useTranslation } from "react-i18next";

type FormatTimeOptions = {
  days?: number;
  weeks?: number;
  months?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatTime = (time: Date, t: (...args: Array<any>) => any) => {
  const endOfToday = endOfDay(new Date());
  let lookup = "TIME.";
  const options: FormatTimeOptions = {};

  const daysDiff = differenceInDays(endOfToday, time);
  const weeksDiff = differenceInWeeks(endOfToday, time);
  const monthsDiff = differenceInMonths(endOfToday, time);
  const yearsDiff = differenceInYears(endOfToday, time);

  if (daysDiff === 0) {
    lookup += "TODAY";
  } else if (daysDiff === 1) {
    lookup += "YESTERDAY";
  } else if (weeksDiff === 0) {
    lookup += "DAYS_AGO";
    options.days = daysDiff;
  } else if (monthsDiff === 0) {
    options.weeks = weeksDiff;
    lookup += options.weeks === 1 ? "WEEK_AGO" : "WEEKS_AGO";
  } else if (yearsDiff > 1) {
    lookup += "NOT_AVAILABLE";
  } else {
    options.months = monthsDiff;
    lookup += options.months === 1 ? "MONTH_AGO" : "MONTHS_AGO";
  }

  return t(lookup, options);
};

type TimeProps = {
  time: Date;
};

function Time({ time }: TimeProps) {
  const { t } = useTranslation();

  return (
    <time dateTime={time.toISOString()}>
      {formatTime(time, t)}
      {differenceInDays(endOfDay(new Date()), time) < 2 &&
        ` ${time.getHours()}:${`0${time.getMinutes()}`.slice(-2)}`}
    </time>
  );
}

export default Time;
