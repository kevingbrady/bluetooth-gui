import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavigationBar from '../components/Navbar';
import * as deviceActions from '../actions/devices';

function mapStateToProps(state) {

  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(deviceActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBar);
