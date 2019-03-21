// @flow
//import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CaptureViewer from '../components/CaptureViewer/CaptureViewer';
import * as captureActions from '../actions/captureViewer';

function mapStateToProps(state) {
  return {
    raw_data: state.captureViewerReducer.raw_data,
    tableData: state.captureViewerReducer.tableData
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(captureActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaptureViewer);
