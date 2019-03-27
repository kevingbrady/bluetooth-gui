// @flow
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import styles from './Devices.css';
import ReactJson from 'react-json-view';
import Collapsible from 'react-collapsible';
import { getAuthentication,
         getIOCapability,
         getOutofBand } from '../../middleware/device_utils';

var equal = require('fast-deep-equal');
var localhost = '00:00:00:00:00:00';
var saveStateDevices = {}

type Props = {
  devices: object
}


export default class Devices extends Component<Props> {
  props:Props;

  constructor(props){
    super(props)

    this.state = saveStateDevices;

  }

  shouldComponentUpdate(nextProps){
      return(!equal(nextProps.devices, this.props.devices));
  }

  componentDidUpdate(prevProps, prevState){

    if(Object.keys(prevState).length !== prevProps.devices.length){
      for(let key in prevProps.devices){

        let bd_addr = prevProps.devices[key].bd_addr;
        if(prevState[bd_addr] === undefined){

          this.setState((state) => ({
             [bd_addr]: false
             }));
           }
        }
    }
  }

  componentWillUnmount(){
    saveStateDevices = this.state;
  }


  shouldCollapse(device_info){

    let field = device_info['name'];
    if(field === '_id'){
          return true;
        }

    return false;
  }

  openCollapsible(device_address){
    this.setState((state) => ({
       [device_address]: true
      }));
  }

  closeCollapsible(device_address){
    this.setState((state) => ({
       [device_address]: false
      }));
  }

  showDeviceCodes(device){

    let deviceDisplay = Object.assign({}, device);

    if(device['bd_addr'] === localhost){
      deviceDisplay['device_name'] = 'localhost';
    }

    if(device['authentication'] !== undefined){
      deviceDisplay['authentication'] = getAuthentication(device['authentication']);
    }

    if(device['io_capability'] !== undefined){
      deviceDisplay['io_capability'] = getIOCapability(device['io_capability'])
    }

    if(device['oob_flag'] !== undefined){
      deviceDisplay['oob_flag'] = getOutofBand(device['oob_flag']);
    }

    return deviceDisplay;

  }
  render() {

    const { devices } = this.props;
    let devicesDisplay = Object.keys(devices).map((key) => {

        let bd_addr = devices[key]['bd_addr'];
        let device_name = bd_addr === localhost ? 'localhost': devices[key].device_name;

        if(device_name !== undefined){

          return(<Collapsible
                className={styles.Collapsible}
                triggerOpenedClassName={styles.openedTrigger}
                contentOuterClassName={styles.outerContent}
                key ={devices[key]._id}
                trigger={device_name}
                open={this.state[bd_addr]}
                onOpening={() => this.openCollapsible(bd_addr)}
                onClosing={() => this.closeCollapsible(bd_addr)}
                lazyRender={true}
                >
                  <ReactJson src={this.showDeviceCodes(devices[key])}
                    theme="summerfruit:inverted"
                    iconStyle="triangle"
                    displayDataTypes={false}
                    indentWidth={6}
                    name={device_name}
                    shouldCollapse={this.shouldCollapse}/>
              </Collapsible>
              )
      }
    })

    if(devices.length > 0){

      return (
        <div>
          <div className={styles.componentBody}>
            <div className={styles.dataTable} data-tid="dataTable">
              <h2> Devices </h2>
              {devicesDisplay}
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
