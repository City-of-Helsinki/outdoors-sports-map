import React, { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import * as appActions from "../app/state/actions";

type Props = {
  onClose: () => void;
  show: boolean;
};

function AppFeedbackModal({ onClose, show }: Props) {
  const { t } = useTranslation();
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
    <Modal show={show} onHide={onClose} size="lg" animation={false}>
      <Modal.Header closeButton closeLabel={t("APP.MODAL.CLOSE")}>
        <Modal.Title>
          <h2>{t("APP.INFO_MENU.GIVE_FEEDBACK")}</h2>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group
            controlId="formControlsTextarea"
            className="feedback-modal__feedback"
          >
            <Form.Control
              name="feedback"
              as="textarea"
              placeholder={t("APP.FEEDBACK.FEEDBACK")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label={t("APP.FEEDBACK.WANT_ANSWER")}
              className="feedback-modal__checkbox"
              onChange={handleToggleEmailInput}
              checked={emailInputOpen}
            />
          </Form.Group>
          {emailInputOpen && (
            <Form.Group>
              <Form.Control
                name="email"
                className="feedback-modal__email"
                type="email"
                placeholder={t("APP.FEEDBACK.EMAIL")}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            {t("APP.FEEDBACK.SEND")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AppFeedbackModal;
