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

    if(packet_info['src'].hasOwnProperty('_layer_name')){
      let layer_name = packet_info['src']['_layer_name'];
      if(layer_name === 'bluetooth' || layer_name === 'hci_h4'){
        return true;
      }
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
