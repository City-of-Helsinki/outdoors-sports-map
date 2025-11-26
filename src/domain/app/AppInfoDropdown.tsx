import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import AppAboutModal from "./AppAboutModal";
import AppAccessibilityModal from "./AppAccessibilityModal";
import AppFeedbackModal from "./AppFeedbackModal";
import AppInfoModal from "./AppInfoModal";
import OutboundLink from "../../common/a11y/OutboundLink";
import SMIcon from "../../common/components/SMIcon";

type ModalType = "about" | "feedback" | "accessibility" | "info";
// FIXME: When a modal is open, an escape key press will close the modal and
//        the dropdown.
function AppInfoDropdown() {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const openDialogLinkRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  const [modal, setModal] = useState<
    ModalType | null
  >(null);
  // Manage dropdown state "manually" to force it to remain open when a modal
  // is opened through it, or when the user tabs onwards from the toggle element.
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleOnClose = useCallback(() => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Add short delay before setting modal to null to allow
    // dropdown to process the logic to handle rootClose event
    closeTimeoutRef.current = setTimeout(() => {
      setModal(null);
      closeTimeoutRef.current = null;
    }, 10);
  }, []);

  const createMenuLinkClickHandler = useCallback((modal: ModalType): MouseEventHandler<HTMLElement> => (event) => {
    // Set the element that opened the dialog, so focus can be returned to it
    // when the dialog is closed.
    openDialogLinkRef.current = event.currentTarget;

    // Open the modal
    setModal(modal);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Dropdown
        ref={dropdownRef}
        className="app-info-dropdown"
        role="contentinfo"
        onToggle={(isOpen, { source }) => {
          // Always open the menu
          if (isOpen) {
            return setIsDropdownOpen(isOpen);
          }

          const isRootClose = source === "rootClose";

          // Only close with a rootClose event when a modal is not open.
          // By doing this we ensure that the dropdown is not closed when:
          //
          // 1) The user tabs from the menu toggle. The default behavior is
          //    that a user can't access the content of the menu with a tab
          //    but accessibility auditors often recommend that it is made
          //    possible
          //
          // 2) A modal is opened. When a modal is opened, focus should be moved
          //    to it. When a modal is closed, the focus should be moved back to
          //    the element that was used to toggle open the modal. If the menu
          //    is closed, this can't happen.
          if (isRootClose && modal === null) {
            setIsDropdownOpen(isOpen);
          }
        }}
        show={isDropdownOpen}
      >
        <Dropdown.Toggle>
          <SMIcon icon="info" aria-label={t("APP.ABOUT")} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={createMenuLinkClickHandler("info")}>
            <SMIcon
              icon="info"
              className="app-info-dropdown__icon"
              aria-hidden="true"
            />
            {t("APP.INFO_MENU.SERVICE_INFO")}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setModal("feedback")}>
            <SMIcon
              icon="info"
              className="app-info-dropdown__icon"
              aria-hidden="true"
            />
            {t("APP.INFO_MENU.GIVE_FEEDBACK")}
          </Dropdown.Item>
          <Dropdown.Item onClick={createMenuLinkClickHandler("about")}>
            <SMIcon
              icon="info"
              className="app-info-dropdown__icon"
              aria-hidden="true"
            />
            {t("APP.INFO_MENU.ABOUT_SERVICE")}
          </Dropdown.Item>
          <Dropdown.Item onClick={createMenuLinkClickHandler("accessibility")}>
            <SMIcon
              icon="info"
              className="app-info-dropdown__icon"
              aria-hidden="true"
            />
            {t("APP.INFO_MENU.ACCESSIBILITY")}
          </Dropdown.Item>
          <Dropdown.Item as={OutboundLink} href="http://osm.org/copyright">
            <span className="app-info-dropdown__icon">{"\u00a9"}</span>
            {`${t("APP.MAP_ATTRIBUTION")} `}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <AppAboutModal focusAfterCloseRef={openDialogLinkRef} show={modal === "about"} onClose={handleOnClose} />
      <AppInfoModal focusAfterCloseRef={openDialogLinkRef} show={modal === "info"} onClose={handleOnClose} />
      <AppFeedbackModal show={modal === "feedback"} onClose={handleOnClose} />
      <AppAccessibilityModal
        focusAfterCloseRef={openDialogLinkRef}
        show={modal === "accessibility"}
        onClose={handleOnClose}
      />
    </>
  );
}

export default AppInfoDropdown;
