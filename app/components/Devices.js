// @flow
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import styles from './Devices.css';
import ReactJson from 'react-json-view';
import Collapsible from 'react-collapsible';

type Props = {
  devices: object
}


export default class Devices extends Component<Props> {
  props:Props;

  constructor(props){
    super(props)
  }

  shouldComponentUpdate(nextProps){
      return(nextProps.devices.length !== this.props.devices.length);
  }

  shouldCollapse(device_info){

    var field = device_info['name'];
    if(field === '_id'){
          return true;
        }

    return false;
  }

  render() {

    const { devices } = this.props;
    var deviceDisplay = Object.keys(devices).map((key) => {

      if(devices[key].device_name !== ''){
        return(<Collapsible
                className={styles.Collapsible}
                triggerOpenedClassName={styles.openedTrigger}
                contentOuterClassName={styles.outerContent}
                key ={devices[key]._id}
                trigger={devices[key].device_name}>
                  <ReactJson src={devices[key]}
                    theme="summerfruit:inverted"
                    iconStyle="triangle"
                    displayDataTypes={false}
                    indentWidth={6}
                    name={devices[key].device_name}
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
              {deviceDisplay}
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
