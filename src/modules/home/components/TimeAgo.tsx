import moment from "moment";

type Props = {
  time: Date;
};

function TimeAgo({ time }: Props) {
  return (
    <time dateTime={time.toISOString()}>{moment(time).from(moment())}</time>
  );
}

export default TimeAgo;
