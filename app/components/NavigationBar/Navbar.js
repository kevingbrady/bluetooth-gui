import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { ButtonToolbar,
         Button,
        } from 'react-bootstrap';
import routes from '../../constants/routes';
import styles from './Navbar.css';
import buildFileSelector from '../../middleware/capture_utils';
import bluetoothLogo from '../../pictures/bluetooth-logo.png';

var equal = require('fast-deep-equal');

type Props = {
    getDevices: () => void,
    getConnections: () => void,
    getRawData: () => void
}

var filePath = '';

export default class NavigationBar extends Component<Props> {
  props: Props;

  constructor(props){

      super(props);

      this.handleFileSelection = this.handleFileSelection.bind(this);
      this.fileSelector = buildFileSelector();
      this.fileSelector.onchange = (event) => {this.handleFileSelection(event)};

      this.state = { isRunningLive: false, isRunningFile: false };
  }

  shouldComponentUpdate(nextProps, nextState){
    return(!equal(nextState, this.state))
  }

  componentDidUpdate(){

    if(this.state.isRunningLive || this.state.isRunningFile){
      this.handleDataFetch()
    }
  }

  handleDataFetch(){

    let interval = setInterval(() => {

      this.props.getDevices();
      this.props.getConnections();
      this.props.getRawData();

      if(this.state.isRunningLive){
        let tbody = document.getElementsByTagName('tbody')[0];
        if(tbody !== undefined){
          tbody.scrollTop = tbody.scrollHeight;
        }
      }

      if(!(this.state.isRunningLive || this.state.isRunningFile)){
        clearInterval(interval);
      }
    }, 1000);
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
          // Stop Live Capture Here
          this.setState(state => {
            return {
              isRunningLive: false
            }
          });
          alert(response['result']);
        },
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
      })

    } else {


      this.setState(state => {
        return {
          isRunningLive: true
        }
      });

        //Start Live Capture Here
        $.ajax({
          type: "POST",
          url: "http://localhost:5000/capture",
          data: JSON.stringify({capture_method: 'start',
                              capture_type: 'live'}),
          dataType: 'json',
          contentType: 'application/json;charset=UTF-8'
        });
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
                  filePath = '';
                  this.setState(state => {
                    return {
                      isRunningFile: false
                    }
                  });
                },
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8'
              });

            } else {

              // Start File Selector Window
                this.fileSelector.click();
              }
            }
  }

  handleFileSelection = (event) => {

    if(event.target.files.length > 0){

      filePath = event.target.files[0].path;
      this.setState(state => {
        return {
          isRunningFile: true
        }
      });

      //Start File Capture Here
      $.ajax({
        type: "POST",
        url: "http://localhost:5000/capture",
        data: JSON.stringify({capture_method: 'start',
                              capture_type: 'file',
                              capture_file: filePath }),
        success: (response) => {

          this.setState(state => {
            return {
              isRunningFile: false
            }
          });
        },
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
      });
    }
  }

  render(){

    const { isRunningLive, isRunningFile } = this.state;

    return (
      <div className={styles.Navbar}>
        <img className={styles.NavLogo} src={bluetoothLogo} />
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
              onClick={() => this.liveCaptureClick()}
              active
              >
              {isRunningLive ?  'Running ...': 'Live Capture'}
              </Button>{' '}
            <Button
              className={isRunningFile ? styles.CaptureRunningButton : styles.CaptureStoppedButton}
              variant="primary"
              onClick={() => this.fileCaptureClick()}
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
