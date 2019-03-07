// @flow
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import overlayFactory from 'react-bootstrap-table2-overlay';
import PacketViewer from './packetViewer'
import styles from './CaptureViewer.css';

var equal = require('fast-deep-equal');
const { SearchBar } = Search;

type Props = {
  raw_data: object,
  tableData: object
};

const noDataIndication = () => (
    <div className = {styles.noDataIndication}>
      <p>Run a Live or File Capture to Collect Table Data</p>
      <ReactLoading type="bars" color='white'/>
    </div>
);


export default class CaptureViewer extends Component<Props> {
  props: Props;

  constructor(props){
    super(props)

    this.state = { rowSelection: 1 }
  }

  shouldComponentUpdate(nextProps, nextState){

    if(!equal(nextProps.tableData, this.props.tableData)){
      return true;
    }

    if(nextState.rowSelection != this.state.rowSelection){
      return true;
    }

    return false;
  }

  getRowOptions(){

    return {
        onClick: (e, row, rowIdx) => {

            var frame_number = parseInt(row['frame_number'], 10);
            this.setState({rowSelection: frame_number});
          }
        }
  }

  columns(){

    return [{
      dataField: 'frame_number',
      text: 'frame',
      headerStyle: this.getHeaderStyle()
    },{
      dataField: 'type',
      text: 'type',
      headerStyle: this.getHeaderStyle()
    }, {
      dataField: 'info',
      text: 'info',
      headerStyle: this.getHeaderStyle()
    }, {
      dataField: 'source',
      text: 'source',
      headerStyle: this.getHeaderStyle()
    }, {
      dataField: 'destination',
      text: 'destination',
      headerStyle: this.getHeaderStyle()
    }]

  }

  getHeaderStyle(){

    return {

      backgroundColor: 'lightslategrey',
      color: 'snow',
      fontWeight: 'bolder',
      height: '8vh',
      textAlign: 'center'
    }
  }

  getRowStyle(row, rowIdx){

    return { backgroundColor: rowIdx % 2 === 0 ? 'white': 'whitesmoke',

              }
  }

  selectRowOptions() {

    return {
      mode: 'radio',
      clickToSelect: true,
      hideSelectColumn: true,
      style: {
        backgroundColor: 'darkblue',
        fontWeight: 'bolder',
        color: 'white'
             }
    }

  }

  render() {

      return (
        <div>
          <div className={styles.componentBody}>
              <ToolkitProvider
                keyField="frame_number"
                data={this.props.tableData}
                columns={this.columns()}
                search
                >{
                  toolkitprops => (
                    <div className={styles.captureTableContainer} data-tid="captureTableConatiner">
                    <BootstrapTable
                      {...toolkitprops.baseProps }
                      classes={styles.captureTable}
                      rowStyle={this.getRowStyle}
                      rowEvents={this.getRowOptions()}
                      selectRow={this.selectRowOptions()}
                      noDataIndication={noDataIndication}
                      />
                      <SearchBar
                        {...toolkitprops.searchProps }
                        className= {styles.searchBar}
                        />
                    </div>
                  )
                }
                </ToolkitProvider>
            <div className={styles.packetViewer} data-tid="packetViewer">
                <PacketViewer packet={this.props.raw_data[this.state.rowSelection - 1]} />
            </div>
          </div>
        </div>
      );
  }
}
