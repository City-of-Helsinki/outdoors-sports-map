/*
   eslint-disable
   react/destructuring-assignment,
   react/prop-types,
*/

import React, { Component } from 'react';
import {
  Button, FormGroup, FormControl, Checkbox,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendFeedback } from '../actions';
import SMIcon from '../../home/components/SMIcon';

class FeedbackModal extends Component {
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
    if (this.state.emailInputOpen) {
      this.setState({ emailInputOpen: false });
    } else {
      this.setState({ emailInputOpen: true });
    }
  }

  handleFeedbackSubmit(e, feedback) {
    e.preventDefault();
    this.props.sendFeedback(feedback);
    this.props.closeModal();
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
            <form onSubmit={(e) => this.handleFeedbackSubmit(e, this.state.feedback, this.state.email)}>
              <FormGroup controlId="formControlsTextarea" className="feedback-modal__feedback">
                <FormControl componentClass="textarea" placeholder={t('MAP.FEEDBACK.FEEDBACK')} onChange={(e) => this.setState({ feedback: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Checkbox inline className="feedback-modal__checkbox" onChange={() => this.toggleEmailInput()}>
                  {t('MAP.FEEDBACK.WANT_ANSWER')}
                </Checkbox>
              </FormGroup>
              {emailInputOpen && <FormGroup><FormControl className="feedback-modal__email" type="email" placeholder={t('MAP.FEEDBACK.EMAIL')} onChange={(e) => this.setState({ email: e.target.value })} /></FormGroup>}
              <Button bsStyle="primary" type="submit">{t('MAP.FEEDBACK.SEND')}</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ sendFeedback }, dispatch);

export default connect(null, mapDispatchToProps)(withTranslation()(FeedbackModal));
