import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Devices from '../components/Devices';
import * as deviceActions from '../actions/devices';

function mapStateToProps(state) {
  
  return {
    devices: state.deviceReducer.devices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(deviceActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Devices);
