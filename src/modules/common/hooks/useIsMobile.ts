import { useEffect, useState } from "react";

import { mobileBreakpoint } from "../constants";

function getIsMobile() {
  return window.innerWidth < mobileBreakpoint;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(getIsMobile());
    };

    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  });

  return isMobile;
}

export default useIsMobile;
