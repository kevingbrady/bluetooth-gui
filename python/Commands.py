
class BluetoothCommand:

    HCICommands = {

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

    L2CAPCommands = {}

    @staticmethod
    def showCommandPacket(packet):

        print(packet.frame_info._all_fields['frame.number'], vars(packet.bthci_cmd))