// @flow

import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as unitActions from '../actions';
import SMIcon from '../../home/components/SMIcon';

type Props = {
  sendFeedback: (feedback: string) => void,
  closeModal: () => void,
  t: (string) => string,
};

class FeedbackModal extends Component<Props> {
  constructor(props) {
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
      this.setState({ emailInputOpen: false });
    } else {
      this.setState({ emailInputOpen: true });
    }
  }

  handleFeedbackSubmit(e, feedback) {
    e.preventDefault();

    const { sendFeedback, closeModal } = this.props;

    sendFeedback(feedback);
    closeModal();
  }

  render() {
    const { closeModal, t } = this.props;
    const { emailInputOpen } = this.state;

    return (
      <div className="about-modal-backdrop">
        <div className="about-modal-box">
          <div className="about-modal-controls">
            <SMIcon icon="close" onClick={() => closeModal()} />
          </div>
          <div className="about-modal-content">
            <h3>{t('MAP.INFO_MENU.GIVE_FEEDBACK')}</h3>
            <Form
              onSubmit={(e) => {
                const { feedback, email } = this.state;

                this.handleFeedbackSubmit(e, feedback, email);
              }}
            >
              <Form.Group
                controlId="formControlsTextarea"
                className="feedback-modal__feedback"
              >
                <Form.Control
                  as="textarea"
                  placeholder={t('MAP.FEEDBACK.FEEDBACK')}
                  onChange={(e) => this.setState({ feedback: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label={t('MAP.FEEDBACK.WANT_ANSWER')}
                  className="feedback-modal__checkbox"
                  onChange={() => this.toggleEmailInput()}
                />
              </Form.Group>
              {emailInputOpen && (
                <Form.Group>
                  <Form.Control
                    className="feedback-modal__email"
                    type="email"
                    placeholder={t('MAP.FEEDBACK.EMAIL')}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </Form.Group>
              )}
              <Button variant="primary" type="submit">
                {t('MAP.FEEDBACK.SEND')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ sendFeedback: unitActions.sendFeedback }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(FeedbackModal));
