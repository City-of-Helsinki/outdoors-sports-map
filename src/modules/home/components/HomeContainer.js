import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Glyphicon} from 'react-bootstrap';
import {fetchUnits} from '../../unit/actions';
import {getVisibleUnits} from '../../unit/selectors';
//import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {MapView} from '../../unit/components/MapView.js';
import {ListView} from '../../unit/components/ListView.js';
import {locations, views} from '../constants.js';

const Header = translate()(({toggleViewGlyph, toggleView, t}) =>
  <div id="header" className="header">
    <div className="search-container">
      <label htmlFor="search"><Glyphicon glyph="search"/></label>
      <input name="search" id="search" type="text" placeholder={`${t('SEARCH.SEARCH')}...`} />
    </div>
    <button className="toggle-view-button" onClick={toggleView}><Glyphicon glyph={toggleViewGlyph}/></button>
  </div>);
const Footer = ({children}) => <div>{children}</div>;

export class HomeContainer extends Component {
  static propTypes = {
    fetchUnits: PropTypes.func.isRequired,
    position: PropTypes.array.isRequired,
    selectedView: PropTypes.string.isRequired,
    unitData: PropTypes.array
  };

  static defaultProps = {
    unitData: [],
    position: locations.HELSINKI,
    selectedView: views.MAP
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedView: props.selectedView
    };

    this.handleMapMove = this.handleMapMove.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  toggleView() {
    console.log('wgfasdf');
    this.setState({selectedView: this.state['selectedView'] === views.MAP ? views.LIST : views.MAP});
  }

  componentWillMount() {
    // Fetch ice rinks in 10km radius from the passed position
    this.props.fetchUnits();
  }

  handleMapMove(): void {
    //
  }

  render() {
    const {unitData, position} = this.props;
    const {selectedView} = this.state;
    return (
      <div>
        <Header toggleView={this.toggleView} toggleViewGlyph={selectedView === views.LIST ? 'globe' : 'list'} units={unitData}/>
        <ListView selected={selectedView === views.LIST} units={unitData}/>
        <MapView handleMoveend={this.handleMapMove} selected={selectedView === views.MAP} position={position} units={unitData}/>
        <Footer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  unitData: getVisibleUnits(state),
  selectedView: state.selectedView
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({fetchUnits}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(
  HomeContainer
);