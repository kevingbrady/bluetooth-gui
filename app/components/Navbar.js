import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { ButtonToolbar,
         Button,
        } from 'react-bootstrap';
import routes from '../constants/routes';
import styles from './Navbar.css';
import buildFileSelector from '../middleware/capture_utils';
import sleep from '../middleware/capture_utils';

import { getCollectionCount } from '../utils/mongoFunctions'

type Props = {
    getDevices: () => void,
    getConnections: () => void,
    getRawData: () => void,
    deleteDevices: () => void,
    deleteConnections: ()=> void,
    deleteRawData: ()=> void
}

var filePath = '';

export default class NavigationBar extends Component<Props> {
  props: Props;

  constructor(props){

      super(props);

      this.clearCollections = this.clearCollections.bind(this);
      this.liveCaptureClick = this.liveCaptureClick.bind(this);
      this.fileCaptureClick = this.fileCaptureClick.bind(this);
      this.handleFileSelection = this.handleFileSelection.bind(this);

      this.state = { isRunningLive: false, isRunningFile: false };
      this.fileSelector = buildFileSelector();
      this.fileSelector.onchange = (event) => {this.handleFileSelection(event)}
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.isRunningLive !== this.state.isRunningLive){
      return true;
    }
    if(nextState.isRunningFile !== this.state.isRunningFile){
      return true;
    }
    return false;
  }

  componentDidMount(){
    this.clearCollections();
  }

  clearCollections(){

    const {
      deleteDevices,
      deleteConnections,
      deleteRawData
    } = this.props;

    getCollectionCount('bluetooth_data', 'Devices').then(count => {

      if(count > 0){
        deleteDevices();
      }
    })

    getCollectionCount('bluetooth_data', 'Connections').then(count => {

      if(count > 0){
        deleteConnections();
      }
    })

    getCollectionCount('bluetooth_data', 'raw_data').then(count => {

      if(count > 0){
        deleteRawData();
      }
    })

  }

  handleDataFetch(captureRunning){

      let interval = setInterval(() => {

        this.props.getDevices();
        this.props.getConnections();
        this.props.getRawData();
        if(!captureRunning){
          clearInterval(interval);
        }
      }, 2000);
  }

  liveCaptureClick(){

    if(this.state.isRunningFile){
      alert('File Capture Already Running !!!');
      return
    }

    if(this.state.isRunningLive){

      $.ajax({
        type: "POST",
        url: "http://localhost:5000/capture",
        data: JSON.stringify({capture_method: 'stop',
                              capture_type: 'live'}),
        success: (response) => {
          alert(response['result']);
        },
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
      })

      // Stop Live Capture Here
      this.setState({ isRunningLive: false });

    } else {

      this.clearCollections();

      //Start Live Capture Here
      $.ajax({
        type: "POST",
        url: "http://localhost:5000/capture",
        data: JSON.stringify({capture_method: 'start',
                              capture_type: 'live'}),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
      })

      this.setState({ isRunningLive: true });
      this.handleDataFetch(this.state.isRunningLive)
    }
  }

  fileCaptureClick() {


    if(this.state.isRunningLive){

      alert('Live Capture Already Running !!!')
      return
    } else {

        if(this.state.isRunningFile){

            //Stop File Capture Here
            $.ajax({
                type: "POST",
                url: "http://localhost:5000/capture",
                data: JSON.stringify({capture_method: 'stop',
                                      capture_type: 'file'}),
                success: (response) => {
                  alert(response['result']);
                },
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8'
              })

              filePath = '';
              this.setState({ isRunningFile: false });

            } else {

               this.clearCollections();
              // Start File Selector Window
                this.fileSelector.click();
              }
            }

  }

  handleFileSelection = (event) => {

    filePath = event.target.files[0].path;

    //Start File Capture Here
    $.ajax({
      type: "POST",
      url: "http://localhost:5000/capture",
      data: JSON.stringify({capture_method: 'start',
                            capture_type: 'file',
                            capture_file: filePath }),
      success: (response) => {

        this.handleDataFetch()
        this.setState({ isRunningFile: false })
      },
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8'
    })

    this.setState({ isRunningFile: true });
    this.handleDataFetch(this.state.isRunningFile);


  }

  render(){

    const { isRunningLive, isRunningFile } = this.state;

    return (
      <div className={styles.Navbar}>
        <img className={styles.NavLogo} src="pictures/bluetooth-logo.png" />
        <div className={styles.alignText}>
          <Link className={styles.Link} to={routes.CAPTURE_VIEWER} replace>CaptureViewer</Link>
          <Link className={styles.Link} to={routes.DEVICES} replace>Devices</Link>
          <Link className={styles.Link} to={routes.CONNECTIONS} replace> Connections </Link>
        </div>
        <div className={styles.captureOptions}>
          <ButtonToolbar>
            <Button
              className={isRunningLive ? styles.CaptureRunningButton : styles.CaptureStoppedButton}
              variant="primary"
              onClick={this.liveCaptureClick}
              active
              >
              {isRunningLive ?  'Running ...': 'Live Capture'}
              </Button>{' '}
            <Button
              className={isRunningFile ? styles.CaptureRunningButton : styles.CaptureStoppedButton}
              variant="primary"
              onClick={this.fileCaptureClick}
              active
              >
              {isRunningFile ? 'Running ...':  'File Capture' }
            </Button>
          </ButtonToolbar>
        </div>
      </div>
    )
  }
}
