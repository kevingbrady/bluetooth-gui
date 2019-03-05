var Commands = {

  1025: 'Sent Inquiry',
  1026: 'Sent Inquiry Cancel',
  1029: 'Create Connection',
  1030: 'Disconnect',
  1035: 'Link Key Request Reply',
  1036: 'Link Key Request Negative Reply',
  1039: 'Change Connection Packet Type',
  1041: 'Authentication Requested',
  1043: 'Set Connection Encryption',
  1049: 'Remote Name Request',
  1050: 'Remote Name Request Cancel',
  1051: 'Read Remote Supported Features',
  1052: 'Read Remote Extended Features',
  1053: 'Read Remote Version Information',
  1064: 'Setup Synchronous Connection',
  1067: 'IO Capability Request Reply',
  1068: 'User Confirmation Request Reply',
  2051: 'Sniff Mode',
  2052: 'Exit Sniff Mode',
  2061: 'Write Link Policy Settings',
  2063: 'Write Default Link Policy Settings',
  2065: 'Sniff Subrating',
  3073: 'Set Event Mask',
  3075: 'Reset',
  3077: 'Set Event Filter',
  3090: 'Delete Stored Link Key',
  3091: 'Change Local Name',
  3092: 'Read Local Name',
  3096: 'Write Page Timeout',
  3098: 'Write Scan Enable',
  3102: 'Write Inquiry Scan Activity',
  3108: 'Write Class of Device',
  3110: 'Write Voice Setting',
  3123: 'Host Buffer Size',
  3127: 'Write Link Supervision Timeout',
  3130: 'Write Current IAC LAP',
  3139: 'Write Inquiry Scan Type',
  3141: 'Write Inquiry Mode',
  3143: 'Write Page Scan Type',
  3154: 'Write Extended Inquiry Response',
  3158: 'Write Simple Pairing Mode',
  3181: 'Write LE Host Supported',
  4097: 'Read Local Version Information',
  4098: 'Read Local Supported Commands',
  4100: 'Read Local Extended Features',
  4101: 'Read Buffer Size',
  4105: 'Read BD ADDR',
  5128: 'Read Encryption Key Size',
  8194: 'LE Read Buffer Size',
  8195: 'LE Read Local Supported Features',
  8197: 'LE Set Random Address',
  8200: 'LE Set Advertising Data',
  8203: 'LE Set Scan Parameters',
  8204: 'LE Set Scan Enable',
  8205: 'LE Create Connection',
  8207: 'LE Read Whitelist Size',
  8214: 'LE Read Remote Used Features'
}

var Events = {

  1: 'Inquiry Complete',
  2: 'Inquiry Result',
  3: 'Connection Complete',
  4: 'Connection Request',
  5: 'Disconnect Complete',
  6: 'Authentication Complete',
  7: 'Remote Name Request Complete',
  8: 'Encryption Change',
  9: 'Change Connection Link Key Complete',
  10: 'Master Link Key Complete',
  11: 'Read Remote Supported Features Complete',
  12: 'Read Remote Version Information Complete',
  13: 'QoS Setup Complete',
  14: 'Command Complete',
  15: 'Command Status',
  16: 'Hardware Error',
  17: 'Flush Occurred',
  18: 'Role Change',
  19: 'Number of Completed Packets',
  20: 'Mode Change',
  21: 'Return Link Keys',
  22: 'PIN Code Request',
  23: 'Link Key Request',
  24: 'Link Key Notification',
  25: 'Loopback Command',
  26: 'Data Buffer Overflow',
  27: 'Max Slots Change',
  28: 'Read Clock Offset Complete',
  29: 'Connection Packet Type Changed',
  30: 'Qos Violation',
  31: 'Page Scan Mode Change',
  32: 'Page Scan Repitition Mode Change',
  33: 'HCI Flow Specification Complete',
  34: 'Inquiry Result with RSSI',
  35: 'Read Remote Extended Features Complete',
  44: 'Synchronous Connection Complete',
  47: 'Extended Inquiry Result',
  49: 'IO Capability Request',
  50: 'IO Capability Response',
  51: 'User Confirmation Request',
  54: 'Simple Pairing Complete',
  62: 'LE Advertising Report',
}

export default function getPacketOverview(packet){

  var packetInfo = {

    frame_number: "",
    type: "",
    info: "",
    source: "",
    destination: ""
  };

  var info = getPacketInfo(packet["layers"]);
  packetInfo['type'] = info[0];
  packetInfo['info'] = info[1];
  packetInfo['frame_number'] = packet["number"];
  packetInfo['source'] = info[2];
  packetInfo['destination'] = info[3];
  return packetInfo;
}

function getPacketInfo(layers) {

      var packetType = '';
      var packetInfo = '';
      var direction = [];
      //console.log(layers);
      //Object.keys(layers).map((key) => {

      for(let key in layers){

        if(layers[key]['_full_name'] === 'hci_h4'){

          direction = getDirection(layers[key]['_all_fields']['hci_h4_direction'])

        }
        else if(layers[key]['_full_name'] === 'bthci_cmd'){
            packetType = "Command";
            packetInfo = getCommand(layers[key]['_all_fields']['bthci_cmd_opcode'])

          }
        else if(layers[key]['_full_name'] === 'bthci_evt'){
            packetType = "Event";
            packetInfo = getEvent(layers[key]['_all_fields']['bthci_evt_code'])
          }
        else if(layers[key]['_full_name'] === 'bthci_acl'){
            packetType = "ACL Data";
          }
        else if(layers[key]['_full_name'] === 'bthci_sco'){
            if(packetType === ""){
              packetType = "SCO Data";
            }
        }
      }

      if(packetType === ''){
        console.log(layers);
      }

      return [packetType, packetInfo, direction[0], direction[1]];
}

function getDirection(direction){

    if(direction === '0x00000000'){
      return ['Host', 'Controller']
    }

    return ['Controller', 'Host']
}

function getEvent(eventCode){

  if(Events[eventCode] === undefined){
    console.log("Event: ", eventCode);
  }
  return Events[eventCode];
}

function getCommand(commandCode){


  if(Commands[commandCode] === undefined){
    console.log("Command: ", commandCode);
  }
  return Commands[commandCode];
}
