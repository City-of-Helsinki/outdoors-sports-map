import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import getLanguage from '../../../language/selectors';
import changeLanguage from '../../../language/actions';
import i18n, { getCurrentLanguage } from '../../i18n';

class TranslationProvider extends React.Component {
  componentDidMount() {
    const { changeLanguageAction } = this.props;
    const currentLanguage = getCurrentLanguage();
    changeLanguageAction(currentLanguage);
  }

  componentDidUpdate(prevProps) {
    const { language } = this.props;
    const currentLanguage = getCurrentLanguage();

    // This will also run on i18next language change
    if (currentLanguage !== language && prevProps.language !== language) {
      i18n.changeLanguage(language);
    }
  }

  render() {
    const { children } = this.props;

    return (
      <>
        {children}
      </>
    );
  }
}

TranslationProvider.propTypes = {
  changeLanguageAction: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  language: PropTypes.string,
};

TranslationProvider.defaultProps = {
  language: null,
};

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeLanguageAction: changeLanguage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(TranslationProvider));
