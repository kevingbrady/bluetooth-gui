import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Connections from '../components/Connections/Connections';
import * as connectionActions from '../actions/connections';

function mapStateToProps(state) {
  return {
    connections: state.connectionReducer.connections
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(connectionActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connections);
