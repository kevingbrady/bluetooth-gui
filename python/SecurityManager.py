class BluetoothSecurityManager:

    key_distribution = {
        'cfm_value': "",
        'random_value': "",
        'long_term_key': "",
        'id_resolving_key': "",
        'signature_key': "",
        'ediv': ""
        }

    def __getitem__(self, item):

        return self.key_distribution[item]


    @staticmethod
    def getOpcode(opcode):

        converted_opcode = int(str(opcode), 0)
        opcodes = {

            1: 'Pairing Request',
            2: 'Pairing Response',
            3: 'Pairing Confirm',
            4: 'Pairing Random',
            5: '',
            6: 'Encryption Information',
            7: 'Master Identification',
            8: 'Identity Information',
            9: 'Identity Address Information',
            10: 'Signing Information',
            11: 'Security Request'

        }

        return opcodes.get(converted_opcode)

    def parseAuthReqTree(self, authreq_tree):

        sc = 0
        mitm = 0
        bonding = 0

        for key, value in authreq_tree.items():

            if key == 'btsmp.sc_flag':

                sc = int(str(value), 0)

            elif key == 'btsmp.mitm_flag':

                mitm = int(str(value), 0)

            elif key == 'btsmp.bonding_flags':

                bonding = int(str(value), 0)

        return sc, mitm, bonding


