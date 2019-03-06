// @flow
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import styles from './Connections.css';
import ReactJson from 'react-json-view';
import Collapsible from 'react-collapsible';
import { getEncryptionStatus,
         getLinkType,
         getKeyType } from '../middleware/connection_utils';

var equal = require('fast-deep-equal');

type Props = {
  connections: object
}


export default class Connections extends Component<Props> {
  props:Props;

  constructor(props){
    super(props)
  }

  shouldComponentUpdate(nextProps){
      return(!equal(nextProps.connections, this.props.connections));
  }

  shouldCollapse(device_info){

    let field = device_info['name'];
    if(field === '_id'){
          return true;
        }

    return false;
  }

  render() {

    const { connections } = this.props;
    let connectionDisplay = Object.keys(connections).map((key) => {

      if(connections[key]['encryption'] !== undefined){
        connections[key]['encryption']  = getEncryptionStatus(connections[key]['encryption']);
      }

      if(connections[key]['link_type'] !== undefined){
        connections[key]['link_type']  = getLinkType(connections[key]['link_type']);
      }

      if(connections[key]['key_type'] !== undefined){
        connections[key]['key_type']  = getKeyType(connections[key]['key_type']);
      }

      return(<Collapsible
                className={styles.Collapsible}
                triggerOpenedClassName={styles.openedTrigger}
                contentOuterClassName={styles.outerContent}
                key ={connections[key]._id}
                trigger={connections[key].host_name + " <----------------> " + connections[key].controller_name}>
                  <ReactJson src={connections[key]}
                    theme="summerfruit:inverted"
                    iconStyle="triangle"
                    displayDataTypes={false}
                    indentWidth={6}
                    name={connections[key].handle}
                    shouldCollapse={this.shouldCollapse}/>
              </Collapsible>
              )
    });

    if(connections.length > 0){

      return (
        <div>
          <div className={styles.componentBody}>
            <div className={styles.dataTable} data-tid="dataTable">
              <h2> Connections </h2>
              {connectionDisplay}
            </div>
          </div>
        </div>
    )
    } else {
        return (
          <div>
            <div className={styles.componentBody}>
              <div className={styles.loading} data-tid="loading">
                <ReactLoading type="bars" color='white'/>
              </div>
            </div>
          </div>
          )
        }
    }
}
