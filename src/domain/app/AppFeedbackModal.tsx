import { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/modal";
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
  feedback: string | null | undefined;
  email: string | null | undefined;
};

class AppFeedbackModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      emailInputOpen: false,
      feedback: null,
      email: null,
    };
    this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this);
    this.toggleEmailInput = this.toggleEmailInput.bind(this);
  }

  toggleEmailInput() {
    const { emailInputOpen } = this.state;

    if (emailInputOpen) {
      this.setState({
        emailInputOpen: false,
      });
    } else {
      this.setState({
        emailInputOpen: true,
      });
    }
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
          onSubmit={(e) => {
            const { feedback, email } = this.state;

            this.handleFeedbackSubmit(e, feedback, email);
          }}
        >
          <Modal.Body>
            <Form.Group
              controlId="formControlsTextarea"
              className="feedback-modal__feedback"
            >
              <Form.Control
                as="textarea"
                placeholder={t("APP.FEEDBACK.FEEDBACK")}
                onChange={(e) =>
                  this.setState({
                    feedback: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label={t("APP.FEEDBACK.WANT_ANSWER")}
                className="feedback-modal__checkbox"
                onChange={() => this.toggleEmailInput()}
              />
            </Form.Group>
            {emailInputOpen && (
              <Form.Group>
                <Form.Control
                  className="feedback-modal__email"
                  type="email"
                  placeholder={t("APP.FEEDBACK.EMAIL")}
                  onChange={(e) =>
                    this.setState({
                      email: e.target.value,
                    })
                  }
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
