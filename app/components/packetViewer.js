import React, { Component } from 'react';
import ReactJson from 'react-json-view';

var equal = require('fast-deep-equal');

type Props = {
  packet: object
};

export default class PacketViewer extends Component<Props> {
  props: Props;

  shouldCollapse(packet_info){

    let field = packet_info['name'];
    if(field === '_id'
        || field === 'frame_info'
        || field === '_wrapped_fields'){
          return true;
        }

    return false;
  }

  render() {

    return(
      <ReactJson
          src={this.props.packet}
          theme="summerfruit:inverted"
          iconStyle="triangle"
          displayDataTypes={false}
          indentWidth={6}
          name={"Row " + (this.props.packet === undefined ? '1': this.props.packet['number'].toString())}
          shouldCollapse={this.shouldCollapse} />
        )
  }
}
