import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import * as unitActions from "../unit/state/actions";

type Props = {
  sendFeedback: (feedback: string, email?: string | null) => void;
  onClose: () => void;
  t: (arg0: string) => string;
  show: boolean;
};

type State = {
  emailInputOpen: boolean;
};

class AppFeedbackModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      emailInputOpen: false,
    };
    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this);
    this.toggleEmailInput = this.toggleEmailInput.bind(this);
  }

  toggleEmailInput() {
    const { emailInputOpen } = this.state;

    this.setState({
      emailInputOpen: !emailInputOpen,
    });
  }

  handleFeedbackSubmit(
    e: React.SyntheticEvent,
    feedback: string | null | undefined,
    email: string | null | undefined
  ) {
    e.preventDefault();

    const { sendFeedback, onClose } = this.props;

    if (feedback) {
      sendFeedback(feedback, email);
      onClose();
    } else {
      console.error(
        `User attempted to send feedback without providing feedback`
      );
    }
  }

  render() {
    const { onClose, t, show } = this.props;
    const { emailInputOpen } = this.state;

    return (
      <Modal show={show} onHide={onClose} size="lg" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2>{t("APP.INFO_MENU.GIVE_FEEDBACK")}</h2>
          </Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const form = e.target as typeof e.target & {
              feedback: { value: string };
              email: { value: string };
            };
            const feedback = form?.feedback.value;
            const email = form?.email.value;

            this.handleFeedbackSubmit(e, feedback, email);
          }}
        >
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
                onChange={() => this.toggleEmailInput()}
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
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      sendFeedback: unitActions.sendFeedback,
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(AppFeedbackModal));
