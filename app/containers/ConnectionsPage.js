import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Connections from '../components/Connections';
import * as deviceActions from '../actions/devices';

function mapStateToProps(state) {
  return {
    connections: state.connectionReducer.connections
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(deviceActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connections);
