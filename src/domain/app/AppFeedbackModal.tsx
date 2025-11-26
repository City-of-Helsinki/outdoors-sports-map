import {Button, Checkbox, Dialog, TextInput, TextArea, IconInfoCircle} from "hds-react";
import React, { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import * as appActions from "../app/state/actions";

type Props = {
  focusAfterCloseRef?: RefObject<HTMLElement>;
  onClose: () => void;
  show: boolean;
};

function AppFeedbackModal({ focusAfterCloseRef, onClose, show }: Props) {
  const { t } = useTranslation();
  const titleId = "feedback-dialog-title";
  const [emailInputOpen, setEmailInputOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleToggleEmailInput = useCallback(() => {
    setEmailInputOpen((prevState) => !prevState);
  }, []);

  const handleOnSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();

      const form = e.target as typeof e.target & {
        feedback: { value: string };
        email: { value: string };
      };
      const feedback = form?.feedback?.value;
      const email = form?.email?.value;

      if (feedback) {
        dispatch(appActions.sendFeedback(feedback, email));
        onClose();
      } else {
        console.error(
          `User attempted to send feedback without providing feedback`
        );
      }
    },
    [dispatch, onClose]
  );

  return (
      <Dialog
          id="about-dialog"
          aria-labelledby={titleId}
          isOpen={show}
          close={onClose}
          closeButtonLabelText={t("APP.MODAL.CLOSE")}
          focusAfterCloseRef={focusAfterCloseRef}
        >
          <form onSubmit={handleOnSubmit}>
            <Dialog.Header
              id={titleId}  
              title={t("APP.INFO_MENU.GIVE_FEEDBACK")}
              iconStart={<IconInfoCircle />}
            />
            <Dialog.Content className="outdoor-exercise-map-modal-content">
              <TextArea
                id="feedback"
                label={t("APP.FEEDBACK.FEEDBACK")}
                placeholder={t("APP.FEEDBACK.FEEDBACK")}
                required
              />
              <Checkbox
                id="want-answer"
                label={t("APP.FEEDBACK.WANT_ANSWER")}
                onChange={handleToggleEmailInput}
                checked={emailInputOpen}
              />
              {emailInputOpen && (
                <TextInput
                  id="email"
                  label={t("APP.FEEDBACK.EMAIL")}
                  placeholder={t("APP.FEEDBACK.EMAIL")}
                  type="email"
                  required={emailInputOpen}
                />
              )}
            </Dialog.Content>
            <Dialog.ActionButtons>
              <Button type="submit">
                {t("APP.FEEDBACK.SEND")}
              </Button>
            </Dialog.ActionButtons>
          </form>
        </Dialog>
    );
}

export default AppFeedbackModal;
