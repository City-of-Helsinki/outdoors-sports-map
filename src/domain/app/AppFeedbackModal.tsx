import {
  Button,
  Checkbox,
  Dialog,
  TextInput,
  TextArea,
  IconInfoCircle,
} from "hds-react";
import React, { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSendFeedbackMutation } from "./appSlice";

type Props = {
  focusAfterCloseRef?: RefObject<HTMLElement>;
  onClose: () => void;
  show: boolean;
};

function AppFeedbackModal({ focusAfterCloseRef, onClose, show }: Props) {
  const { t } = useTranslation();
  const titleId = "feedback-dialog-title";
  const [feedback, setFeedback] = useState<string>("");
  const [emailInputOpen, setEmailInputOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [sendFeedback] = useSendFeedbackMutation();

  // Clear values when modal is opened
  React.useEffect(() => {
    if (show) {
      setFeedback("");
      setEmail("");
      setEmailInputOpen(false);
    }
  }, [show]);

  const handleToggleEmailInput = useCallback(() => {
    setEmailInputOpen((prevState) => !prevState);
  }, []);

  const handleOnSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();

      if (feedback) {
        sendFeedback({ feedback, email });
        onClose();
      } else {
        console.error(
          `User attempted to send feedback without providing feedback`,
        );
      }
    },
    [sendFeedback, email, feedback, onClose],
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
            name="feedback"
            label={t("APP.FEEDBACK.FEEDBACK")}
            placeholder={t("APP.FEEDBACK.FEEDBACK")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <Checkbox
            id="want-answer"
            name="want-answer"
            label={t("APP.FEEDBACK.WANT_ANSWER")}
            onChange={handleToggleEmailInput}
            checked={emailInputOpen}
          />
          {emailInputOpen && (
            <TextInput
              id="email"
              name="email"
              label={t("APP.FEEDBACK.EMAIL")}
              placeholder={t("APP.FEEDBACK.EMAIL")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={emailInputOpen}
            />
          )}
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button type="submit">{t("APP.FEEDBACK.SEND")}</Button>
        </Dialog.ActionButtons>
      </form>
    </Dialog>
  );
}

export default AppFeedbackModal;
