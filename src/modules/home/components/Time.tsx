import moment from "moment";
import { useTranslation } from "react-i18next";

type FormatTimeOptions = {
  days?: number;
  weeks?: number;
  months?: number;
};

export const formatTime = (time: Date, t: (...args: Array<any>) => any) => {
  const endOfToday = moment().endOf("day");
  let lookup = "TIME.";
  const options: FormatTimeOptions = {};

  if (endOfToday.diff(time, "days") === 0) {
    lookup += "TODAY";
  } else if (endOfToday.diff(time, "days") === 1) {
    lookup += "YESTERDAY";
  } else if (endOfToday.diff(time, "weeks") === 0) {
    lookup += "DAYS_AGO";
    options.days = endOfToday.diff(time, "days");
  } else if (endOfToday.diff(time, "months") === 0) {
    options.weeks = endOfToday.diff(time, "weeks");
    lookup += options.weeks === 1 ? "WEEK_AGO" : "WEEKS_AGO";
  } else if (endOfToday.diff(time, "years") > 1) {
    lookup += "NOT_AVAILABLE";
  } else {
    options.months = endOfToday.diff(time, "months");
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
      {moment().endOf("day").diff(time, "days") < 2 &&
        ` ${time.getHours()}:${`0${time.getMinutes()}`.slice(-2)}`}
    </time>
  );
}

export default Time;
