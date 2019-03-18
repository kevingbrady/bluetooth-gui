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
var localhost = '00:00:00:00:00:00';
var saveStateConnections = {}

type Props = {
  connections: object
}


export default class Connections extends Component<Props> {
  props:Props;

  constructor(props){
    super(props)

    this.state = saveStateConnections;
  }

  shouldComponentUpdate(nextProps){
      return(!equal(nextProps.connections, this.props.connections));
  }

  componentDidUpdate(prevProps, prevState){

    if(Object.keys(prevState).length !== prevProps.connections.length){
      for(let key in prevProps.connections){

        let handle = prevProps.connections[key].handle;
        if(handle !== undefined &&
            prevState[handle] === undefined){

           this.setState((state) => ({
             [handle]: false
             }));
          }
      }
    }
  }

  componentWillUnmount(){
    saveStateConnections = this.state;
  }

  shouldCollapse(device_info){

    let field = device_info['name'];
    if(field === '_id'){
          return true;
        }

    return false;
  }

  openCollapsible(connection_handle){
    this.setState((state) => ({
      [connection_handle]: true
      }));
  }

  closeCollapsible(connection_handle){
    this.setState((state) => ({
      [connection_handle]: false
      }));
  }

  showConnectionCodes(connection){

    let connectionDisplay = Object.assign({}, connection);

    if(connection['host_addr'] === localhost){
      connectionDisplay['host_name'] = 'localhost';
    }

    else if(connection['controller_addr'] === localhost){
      connectionDisplay['controller_name'] = 'localhost';
    }

    if(connection['encryption'] !== undefined){
      connectionDisplay['encryption']  = getEncryptionStatus(connection['encryption']);
    }

    if(connection['link_type'] !== undefined){
      connectionDisplay['link_type']  = getLinkType(connection['link_type']);
    }

    if(connection['key_type'] !== undefined){
      connectionDisplay['key_type']  = getKeyType(connection['key_type']);
    }

    return connectionDisplay;
  }

  render() {

    const { connections } = this.props;
    let connectionsDisplay = Object.keys(connections).map((key) => {

        let connection_handle = connections[key]['handle'];
        let controllerName = connections[key].controller_addr === localhost ? 'localhost': connections[key].controller_name;
        let hostName = connections[key].host_addr === localhost ? 'localhost': connections[key].host_name;

        if(controllerName !== undefined && hostName !== undefined){
          return(<Collapsible
                className={styles.Collapsible}
                triggerOpenedClassName={styles.openedTrigger}
                contentOuterClassName={styles.outerContent}
                key ={connections[key]._id}
                trigger={hostName + " <----------------> " + controllerName}
                open={this.state[connection_handle]}
                onOpening={() => this.openCollapsible(connection_handle)}
                onClosing={() => this.closeCollapsible(connection_handle)}
                lazyRender={true}
                >
                  <ReactJson src={this.showConnectionCodes(connections[key])}
                    theme="summerfruit:inverted"
                    iconStyle="triangle"
                    displayDataTypes={false}
                    indentWidth={6}
                    name={connection_handle}
                    shouldCollapse={this.shouldCollapse}/>
              </Collapsible>
              )
          }
    });

    if(connections.length > 0){

      return (
        <div>
          <div className={styles.componentBody}>
            <div className={styles.dataTable} data-tid="dataTable">
              <h2> Connections </h2>
              {connectionsDisplay}
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
