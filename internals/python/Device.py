import pymongo
from pyshark_tools import *

MongoClient = pymongo.MongoClient()
db = MongoClient['bluetooth_data']

class BluetoothDevice:

    _id = ''
    role = ''
    bd_addr = ''
    address_randomized = False
    connections = set()
    security_keys = []
    localhost_device_names = ['Source Device Name: ', 'Destination Device Name: ', None]
    role_switch = 3

    def __init__(self, *args, **kwargs):

        self.collection = db['Devices']
        self.role = kwargs.get('role')
        self.bd_addr = kwargs.get('bd_addr')
        self.address_randomized = kwargs.get('address_randomized')
        self.createDbEntry()

    @staticmethod
    def getBluetoothVersion(lmp_version):

        bluetooth_version = ""
        lmp_version_numbers = {

            0: "1.0b",
            1: "1.1",
            2: "1.2",
            3: "2.0 + EDR",
            4: "2.1 + EDR",
            5: "3.0 + HS",
            6: "4.0",
            7: "4.1",
            8: "4.2",
            9: "5.0",
            10: "5.1"
        }

        bluetooth_version = lmp_version_numbers.get(int(lmp_version, 0))
        return bluetooth_version

    @staticmethod
    def parseAuthenticationTree(authreq_tree):

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

    def inDatabase(self):

        if self._id is '':

            return False

        return True

    def updateField(self, field, value):

        if value not in ('', None):

            entry = self.getDbEntry()

            if entry.get(field) is not None:

                if entry[field] == value:

                    return

            self.collection.update(
                {"_id": self._id},
                {"$set": {
                    field: value
                }
                })

    def deleteField(self, field):

        self.collection.update(
            {"_id": self._id},
            {"$unset": {field: ""}}
        )

    def updateConnections(self, value):

        if value not in ('', None):

            entry = self.getDbEntry()

            if entry.get('connections') is not None:

                if entry['connections'] == self.connections:

                    return

            self.connections.add(value)
            self.collection.update(
                {"_id": self._id},
                {"$set": {
                    'connections': list(self.connections)
                }
                }
            )

    def updateSecurityKeys(self, key, value):

        updateKey = 'security_keys.' + key

        entry = self.getDbEntry()

        if entry.get(updateKey) is not None:

            if entry[updateKey] == value:

                return

        self.collection.update(
          {"_id": self._id},
          {'$set':
            {updateKey: value}
           }
        )


    def createDbEntry(self):

        entry = self.getDbEntry()

        if entry is None:
            self._id = self.collection.insert_one({
                 "role": self.role,
                 "bd_addr": self.bd_addr,
                 "address_randomized": self.address_randomized,
                 "security_keys": {}
            }).inserted_id

    def getDbEntry(self):

        entry = self.collection.find_one({
            "bd_addr": self.bd_addr
        })

        if entry is not None:
            self._id = entry["_id"]

        return entry

    def updateDbEntry(self):

        if self._id is not "":

            self.collection.update_one(
                {"id": self._id},
                {"$set": {
                    "device_name": self.device_name,
                    "bd_addr": self.bd_addr,
                    "role": self.role
                }
            })

    def deleteDbEntry(self):

        self.collection.delete_one({"_id": self._id})

