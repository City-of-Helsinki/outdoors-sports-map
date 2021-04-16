import { useTranslation } from "react-i18next";

import { MAIN_CONTENT_ID } from "./Page";

function JumpLink() {
  const { t } = useTranslation();

  return (
    <a href={`#${MAIN_CONTENT_ID}`} className="jump-link">
      {t("JUMP_LINK.LABEL")}
    </a>
  );
}

export default JumpLink;
