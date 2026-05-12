import {
  Button,
  Checkbox,
  Dialog,
  TextInput,
  TextArea,
  IconInfoCircle,
  Notification,
} from "hds-react";
import React, { RefObject, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSendFeedbackMutation } from "./state/appSlice";

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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [sendFeedback, { isLoading }] = useSendFeedbackMutation();

  // Resets all form state and closes the dialog.
  // Used by both the X button and the auto-close timer so state is always
  // clean when the modal next opens.
  const handleClose = useCallback(() => {
    setFeedback("");
    setEmail("");
    setEmailInputOpen(false);
    setSubmitStatus("idle");
    onClose();
  }, [onClose]);

  // Auto-close after the success or error notification has been displayed
  useEffect(() => {
    if (submitStatus === "idle") return;
    const timer = setTimeout(handleClose, 5000);
    return () => clearTimeout(timer);
  }, [submitStatus, handleClose]);

  const handleToggleEmailInput = useCallback(() => {
    setEmailInputOpen((prevState) => !prevState);
  }, []);

  const handleOnSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();

      if (!feedback) {
        // eslint-disable-next-line no-console
        console.error(
          `User attempted to send feedback without providing feedback`,
        );
        return;
      }

      try {
        await sendFeedback({ feedback, email }).unwrap();
        setSubmitStatus("success");
      } catch {
        setSubmitStatus("error");
      }
    },
    [sendFeedback, email, feedback],
  );

  return (
    <Dialog
      id="about-dialog"
      aria-labelledby={titleId}
      isOpen={show}
      close={handleClose}
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
          <div role="status" aria-live="polite" aria-atomic="true">
            {submitStatus === "success" && (
              <Notification type="success" label={t("APP.FEEDBACK.SUCCESS")} />
            )}
          </div>
          <div role="alert" aria-live="assertive" aria-atomic="true">
            {submitStatus === "error" && (
              <Notification type="error" label={t("APP.FEEDBACK.ERROR")} />
            )}
          </div>
          {submitStatus === "idle" && (
            <>
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
            </>
          )}
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button
            type="submit"
            disabled={isLoading || submitStatus !== "idle"}
          >
            {t("APP.FEEDBACK.SEND")}
          </Button>
        </Dialog.ActionButtons>
      </form>
    </Dialog>
  );
}

export default AppFeedbackModal;
