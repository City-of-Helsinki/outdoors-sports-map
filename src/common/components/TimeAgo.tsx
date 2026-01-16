import { formatDistanceToNow } from "date-fns";

import { getDateFnsLocale } from "../../domain/i18n/i18n";

type Props = {
  time: Date;
};

function TimeAgo({ time }: Props) {
  return (
    <time dateTime={time.toISOString()}>
      {formatDistanceToNow(time, { addSuffix: true, locale: getDateFnsLocale() })}
    </time>
  );
}

export default TimeAgo;
