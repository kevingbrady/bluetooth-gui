import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavigationBar from '../components/Navbar';
import * as deviceActions from '../actions/devices';
import * as connectionActions from '../actions/connections';
import * as captureActions from '../actions/capture';

function mapStateToProps(state) {

  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, deviceActions,
                                              connectionActions,
                                              captureActions), dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBar);
