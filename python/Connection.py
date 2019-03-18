import pymongo

MongoClient = pymongo.MongoClient()
db = MongoClient['bluetooth_data']

class BluetoothConnection:
    _id = ''
    handle = ''
    standard_name_responses = ['Source Device Name: ', 'Destination Device Name: ']

    def __init__(self, *args, **kwargs):

        self.collection = db['Connections']
        self.handle = kwargs.get('handle')
        self.createDbEntry()

    def evaluatePairingMethod(self, host, controller):


        Just_Works = "Just Works (Unauthenticated)"
        Passkey_Entry = "Passkey Entry (Authenticated)"
        Numeric_Comparison = "Numeric Comparison (LE Secure Connection)"

        secureConnection = False
        pairing_method = 'Unknown'

        if all(h in host for h in ('secure_connection_flag',
                                   'mitm_flag',
                                   'oob_flag')):

            if all(h in controller for h in ('secure_connection_flag',
                                             'mitm_flag',
                                             'oob_flag')):

                if host['secure_connection_flag'] is 1 and controller['secure_connection_flag'] is 1:
                    secureConnection = True

                if host['oob_flag'] is 1 and controller['oob_flag'] is 1:

                    pairing_method =  "OOB Pairing"

                else:

                    if secureConnection is True:

                        if host['oob_flag'] is 1 or controller['oob_flag'] is 1:
                            pairing_method =  "OOB Pairing"

                    elif host['mitm_flag'] is not 1 and controller['mitm_flag'] is not 1:
                        pass

                    else:

                        pairingMethodTable = {

                            (0, 0): Just_Works,
                            (0, 1): Just_Works,
                            (0, 2): Passkey_Entry,
                            (0, 3): Just_Works,
                            (0, 4): Passkey_Entry,
                            (1, 0): Just_Works,
                            (1, 1): (Just_Works, Numeric_Comparison)[secureConnection is True],
                            (1, 2): Passkey_Entry,
                            (1, 3): Just_Works,
                            (1, 4): (Passkey_Entry, Numeric_Comparison)[secureConnection is True],
                            (2, 0): Passkey_Entry,
                            (2, 1): Passkey_Entry,
                            (2, 2): Passkey_Entry,
                            (2, 3): Just_Works,
                            (2, 4): Passkey_Entry,
                            (3, 0): Just_Works,
                            (3, 1): Just_Works,
                            (3, 2): Just_Works,
                            (3, 3): Just_Works,
                            (3, 4): Just_Works,
                            (4, 0): Passkey_Entry,
                            (4, 1): (Passkey_Entry, Numeric_Comparison)[secureConnection is True],
                            (4, 2): Passkey_Entry,
                            (4, 3): Just_Works,
                            (4, 4): (Passkey_Entry, Numeric_Comparison)[secureConnection is True]

                        }

                        pairing_method = pairingMethodTable.get((controller['io_capability'], host['io_capability']))

        self.updateField("pairing_method", pairing_method)

    def inDatabase(self):

        if self._id is '':
            return False

        return True

    def updateField(self, field, value):

        if value not in ('', None):
            self.collection.update(
                {"_id": self._id},
                {"$set": {
                    field: value
                    }
                }
            )

    def createDbEntry(self):

        entry = self.getDbEntry()
        if entry is None:

            self._id = self.collection.insert_one({
                "handle": self.handle
            }).inserted_id

    def getDbEntry(self):

        entry = self.collection.find_one({
            "handle": self.handle
        })

        if entry is not None:

            self._id = entry["_id"]

        return entry

    def updateDbEntry(self):

        if self._id is not "":
            self.collection.update_one(
                {"id": self._id},
                {"$set": {
                    "handle": self.handle,
                    }
                }
            )


    def deleteDbEntry(self):
        self.collection.delete_one({"_id": self._id})
