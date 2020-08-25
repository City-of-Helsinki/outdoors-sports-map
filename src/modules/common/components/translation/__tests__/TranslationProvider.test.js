import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import getLanguage from '../../../../language/selectors';
import changeLanguage from '../../../../language/actions';
import { mount } from '../../../enzymeHelpers';
import TranslationProvider from '../TranslationProvider';

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeLanguage,
}, dispatch);

const ChangeLanguageButtons = connect(mapStateToProps, mapDispatchToProps)(
  (props) => (
    <div>
      <button type="button" onClick={() => props.changeLanguage('en')}>English</button>
      <button type="button" onClick={() => props.changeLanguage('sv')}>Swedish</button>
    </div>
  ),
);

const getWrapper = () => mount(
  <TranslationProvider>
    <ChangeLanguageButtons />
  </TranslationProvider>,
);

describe('', () => {
  it('should have ensure that moment locale and language are in sync', async () => {
    const wrapper = await getWrapper();

    expect(wrapper.find('TranslationProvider').at(0).prop('language')).toEqual(moment.locale());
  });

  it('should change moment language when language changes', async () => {
    expect(moment.locale()).toEqual('fi');

    const wrapper = await getWrapper();

    wrapper.find('button').at(1).simulate('click');

    expect(moment.locale()).toEqual('sv');
  });
});
