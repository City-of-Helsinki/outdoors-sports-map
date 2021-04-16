import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import OutboundLink from "../../common/components/OutboundLink";

type Props = {
  attributionLink: string;
};

function Disclaimer({ attributionLink }: Props) {
  const { t } = useTranslation();

  return (
    <div className="disclaimer">
      <div className="disclaimer__content">
        <Link to="#">{t("APP.ABOUT")}</Link>
        <OutboundLink href={attributionLink}>
          {`${t("MAP.ATTRIBUTION")} `}
        </OutboundLink>
      </div>
    </div>
  );
}

export default Disclaimer;
