class BluetoothEvent:

    @staticmethod
    def getEvent(eventCode):

        hciEvents = {

            3: 'Connect Complete',
            5: 'Disconnect Complete',
            6: 'Authentication Complete',
            7: 'Remote Name Request Complete',
            8: 'Encryption Change',
            11: 'Read Remote Supported Features Complete',
            12: 'Read Remote Version Information Complete',
            14: 'Command Complete',
            15: 'Command Status (Disconnect)',
            20: 'Mode Change',
            24: 'Link Key Notification',
            28: 'Read Clock Offset Complete',
            35: 'Read Remote Extended Features Complete',
            50: 'IO Capability Response',
            54: 'Simple Pairing Complete',
            62: 'LE Advertising Report',
        }

        return hciEvents.get(eventCode, None)


    @staticmethod
    def getSubEvent(subEventCode):

        hciSubEvents = {

            4097: 'Read Local Version Information Complete'
        }

        return hciSubEvents.get(subEventCode, None)


    @staticmethod
    def showEventPacket(packet):
        print(packet.frame_info._all_fields['frame.number'], vars(packet.bthci_evt))
