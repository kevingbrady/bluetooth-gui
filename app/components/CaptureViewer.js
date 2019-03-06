// @flow
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import overlayFactory from 'react-bootstrap-table2-overlay';
import ReactJson from 'react-json-view';
import styles from './CaptureViewer.css';

var equal = require('fast-deep-equal');
const { SearchBar } = Search;

type Props = {
  raw_data: object,
  tableData: object,
  rowSelection: number,
  setRowSelection: () => void
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
  }

  shouldComponentUpdate(nextProps, nextState){

    if(!equal(nextProps.tableData, this.props.tableData)){
      return true;
    }

    if(this.props.tableData.length !== this.props.raw_data.length){
      return true;
    }

    if(nextProps.rowSelection !== this.props.rowSelection){
      return true;
    }

    return false;
  }

  getRowOptions(){

    return {
        onClick: (e, row, rowIdx) => {

            var frame_number = parseInt(row['frame_number'], 10);
            this.props.setRowSelection(frame_number);
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
                      remote={{search:true, loading:true}}
                      overlay={overlayFactory()}
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
                <ReactJson
                      src={this.props.raw_data[this.props.rowSelection - 1]}
                      theme="summerfruit:inverted"
                      iconStyle="triangle"
                      displayDataTypes={false}
                      indentWidth={6}
                      name={"Row " + this.props.rowSelection.toString()}
                      shouldCollapse={this.shouldCollapse}/>
            </div>
          </div>
        </div>
      );
  }
}
