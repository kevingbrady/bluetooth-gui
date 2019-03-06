// @flow
//import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CaptureViewer from '../components/CaptureViewer';
import * as deviceActions from '../actions/devices';

function mapStateToProps(state) {
  return {
    raw_data: state.captureViewerReducer.raw_data,
    tableData: state.captureViewerReducer.tableData,
    rowSelection: state.captureViewerReducer.rowSelection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(deviceActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaptureViewer);
