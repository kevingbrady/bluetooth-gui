import pymongo
from pyshark_tools import *
from Connection import BluetoothConnection
from Device import BluetoothDevice
# (False, True)[if condition is true]

MongoClient = pymongo.MongoClient()
db = MongoClient['bluetooth_data']

# Connection Handle Placeholder
handle = ""
bd_addr = ""

deviceInfo = {}
connectionInfo = {}

advertisingAddresses = []

app_data = {}

def checkDeviceInfo(packet, role):

    global bd_addr
    packetInfo = {}

    if is_layer_here(packet, "bthci_cmd"):

        layer = "bthci_cmd"

        if is_field_here(packet, layer, "bd_addr"):

            command = int(get_field(packet, layer, "opcode"))
            if command == 8197:
                pass

            else:
                #print(packet.frame_info._all_fields['frame.number'], vars(packet.bthci_cmd))
                bd_addr = get_field(packet, layer, 'bd_addr')
                packetInfo.update({'bd_addr': bd_addr})

                if bd_addr not in advertisingAddresses:
                    packetInfo.update({"address_randomized": True})

                else:
                    packetInfo.update({"address_randomized": False})

        if is_field_here(packet, layer, "auth_requirements"):
            authentication = get_field(packet, layer, 'auth_requirements')
            packetInfo.update({"authentication": int(authentication, 0)})

        elif is_field_here(packet, layer, "io_capability"):
            io_capability = get_field(packet, layer, 'io_capability')
            packetInfo.update({"io_capability": int(io_capability, 0)})

        elif is_field_here(packet, layer, 'oob_data_present'):
            oob_data_present = get_field(packet, layer, 'oob_data_present')
            packetInfo.update({"oob_flag": int(oob_data_present, 0)})

    if is_layer_here(packet, "bthci_evt"):

        layer = "bthci_evt"

        if is_field_here(packet, layer, "bd_addr"):

            event = int(get_field(packet, layer, 'code'))
            event_address = get_field(packet, layer, "bd_addr")

            if event in (62, 47):

                if event == 62:

                    sub_event = int(get_field(packet, layer, 'le_meta_subevent'), 0)

                    if sub_event != 2:
                        bd_addr = get_field(packet, layer, "bd_addr")
                        packetInfo.update({'bd_addr': bd_addr})

                    else:
                        advertisingAddresses.append(event_address)

                else:
                    advertisingAddresses.append(event_address)

            else:

                #print(packet.frame_info._all_fields['frame.number'], vars(packet.bthci_evt))
                bd_addr = get_field(packet, layer, "bd_addr")
                packetInfo.update({'bd_addr': bd_addr})

                if bd_addr not in advertisingAddresses:
                    packetInfo.update({"address_randomized": True})

                else:
                    packetInfo.update({"address_randomized": False})

        if is_field_here(packet, layer, 'lmp_vers_nr'):
            lmp_version = get_field(packet, layer, 'lmp_vers_nr')
            bluetooth_version = BluetoothDevice.getBluetoothVersion(lmp_version)
            packetInfo.update({"bluetooth_verison": bluetooth_version})

        if is_field_here(packet, layer, "lmp_features.secure_simple_pairing_host"):
            secure_simple_pairing = get_field(packet, layer, "lmp_features.secure_simple_pairing_host")
            packetInfo.update({"secure_simple_pairing": secure_simple_pairing})

        if is_field_here(packet, layer, 'lmp_features.le_supported.host'):
            le_supported = get_field(packet, layer,'lmp_features.le_supported.host')
            packetInfo.update({"le_supported": le_supported})

        if is_field_here(packet, layer, "lmp_features.simultaneous_le_and_br_edr.host"):
            simultaneous_bdr_le = get_field(packet, layer, "lmp_features.simultaneous_le_and_br_edr.host")
            packetInfo.update({"simultaneous_bdr_le", simultaneous_bdr_le})

        if is_field_here(packet, layer, "auth_requirements"):
            auth_requirements = get_field(packet, layer, 'auth_requirements')
            packetInfo.update({"authentication": int(auth_requirements, 0)})

        if is_field_here(packet, layer, "io_capability"):
            io_capability = get_field(packet, layer, 'io_capability')
            packetInfo.update({"io_capability": int(io_capability, 0)})

        if is_field_here(packet, layer, 'oob_data_present'):
            oob_data_present = get_field(packet, layer, 'oob_data_present')
            packetInfo.update({"oob_flag": int(oob_data_present, 0)})

    if is_layer_here(packet, "bthci_acl"):

        layer = "bthci_acl"

        if is_field_here(packet, layer, 'src.bd_addr'):

            bd_addr = get_field(packet, layer, 'src.bd_addr')
            packetInfo.update({'bd_addr': bd_addr})

            if bd_addr not in advertisingAddresses:
                packetInfo.update({"address_randomized": True})

            else:
                packetInfo.update({"address_randomized": False})

        if is_field_here(packet, layer, 'src.name'):
            src_device_name = get_field(packet, layer, 'src.name')
            packetInfo.update({'device_name': src_device_name})

        if is_field_here(packet, layer, 'chandle'):

            handle = get_field(packet, 'bthci_acl', 'chandle')
            packetInfo.update({'handle': handle})

    if is_layer_here(packet, "btsmp"):

        layer = "btsmp"

        #print(vars(packet.btsmp))
        if is_field_here(packet, layer, 'io_capability'):
            io_capability = get_field(packet, layer, 'io_capability')
            packetInfo.update({"io_capability": int(io_capability, 0)})

        if is_field_here(packet, layer, 'oob_data_flags'):
            oob_data_flags = get_field(packet, layer, 'oob_data_flags')
            packetInfo.update({"oob_flag": int(oob_data_flags, 0)})

        if is_field_here(packet, layer, 'authreq'):
            authentication = get_field(packet, layer, 'authreq')
            packetInfo.update({"authentication": int(authentication, 0)})

        if is_field_here(packet, layer, 'authreq_tree'):
            authreq_tree = get_field(packet, layer, 'authreq_tree')
            secure_connection_flag, \
            mitm_flag,\
            bonding_flag = BluetoothDevice.parseAuthenticationTree(authreq_tree)

            packetInfo.update({"secure_connection_flag": secure_connection_flag})
            packetInfo.update({"mitm_flag": mitm_flag})
            packetInfo.update({"bonding_flag": bonding_flag})

        if is_field_here(packet, layer, "cfm_value"):
            cfm_value = get_field(packet, layer, "cfm_value")
            packetInfo.update({"cfm_value": cfm_value})

        if is_field_here(packet, layer, "random_value"):
            random_value = get_field(packet, layer, "random_value")

            if is_field_here(packet, layer, "ediv"):

                ediv = get_field(packet, layer, "ediv")
                packetInfo.update({"master_identification": {"ediv": ediv, "random_value": random_value}})

            else:

                packetInfo.update({"random_value": random_value})

        if is_field_here(packet, layer, "long_term_key"):
            long_term_key = get_field(packet, layer, "long_term_key")
            packetInfo.update({"long_term_key": long_term_key})

        if is_field_here(packet, layer, "id_resolving_key"):
            id_resolving_key = get_field(packet, layer, "id_resolving_key")
            packetInfo.update({"id_resolving_key": id_resolving_key})

        if is_field_here(packet, layer, "signature_key"):
            signature_key = get_field(packet, layer, "signature_key")
            packetInfo.update({"signature_key": signature_key})

    return packetInfo


def checkConnectionInfo(packet, role):

    global handle
    packetInfo = {}

    if is_layer_here(packet, "bthci_cmd"):

        layer = "bthci_cmd"

        if is_field_here(packet, layer, "connection_handle"):

                handle = get_field(packet, layer, "connection_handle")

        if is_field_here(packet, layer, "encryption_enable"):

            encryption_enable = get_field(packet, layer, "encryption_enable")
            packetInfo.update({"encryption": int(encryption_enable, 0)})

        if is_field_here(packet, layer, "link_key"):
            link_key = get_field(packet, layer, "link_key")
            packetInfo.update({"link_key": link_key})

        if is_field_here(packet, layer, "key_type"):
            key_type = get_field(packet, layer, "key_type")
            packetInfo.update({"key_type": int(key_type, 0)})

    if is_layer_here(packet, "bthci_evt"):

        layer = "bthci_evt"

        if is_field_here(packet, layer, "connection_handle"):

            handle = get_field(packet, layer, "connection_handle")
            packetInfo.update({'handle': handle})

        if is_field_here(packet, layer, "link_type"):

            link_type = get_field(packet, layer, "link_type")
            packetInfo.update({"link_type": int(link_type, 0)})

        if is_field_here(packet, layer, "encryption_mode"):

            encryption_mode = get_field(packet, layer, "encryption_mode")
            packetInfo.update({"encryption": int(encryption_mode, 0)})

        if is_field_here(packet, layer, "code"):
            if is_field_here(packet, layer, "status"):

                code = get_field(packet, layer, "code")
                status = get_field(packet, layer, "status")
                if code == '54' and status == '0':

                    packetInfo.update({"simple_pairing_mode": True})

        if is_field_here(packet, layer, "encryption_enable"):

            encryption_enable = get_field(packet, layer, "encryption_enable")
            packetInfo.update({"encryption": int(encryption_enable, 0)})

        if is_field_here(packet, layer, "link_key"):

            link_key = get_field(packet, layer, "link_key")
            packetInfo.update({"link_key": link_key})

        if is_field_here(packet, layer, "key_type"):

            key_type = get_field(packet, layer, "key_type")
            packetInfo.update({"key_type": int(key_type, 0)})

    if is_layer_here(packet, "bthci_acl"):

        layer = "bthci_acl"

        if role == "host":

            if is_field_here(packet, layer, 'src.name'):
                src_name = get_field(packet, layer, 'src.name')
                packetInfo.update({"host_name": src_name})

            if is_field_here(packet, layer, 'src.bd_addr'):
                src_bd_addr = get_field(packet, layer, 'src.bd_addr')
                packetInfo.update({"host_addr": src_bd_addr})

            if is_field_here(packet, layer, 'dst.name'):
                dst_name = get_field(packet, layer, "dst.name")
                packetInfo.update({"controller_name": dst_name})

            if is_field_here(packet, layer, 'dst.bd_addr'):
                dst_bd_addr = get_field(packet, layer, "dst.bd_addr")
                packetInfo.update({"controller_addr": dst_bd_addr})

        if is_field_here(packet, layer, 'chandle'):
            handle = get_field(packet, layer, "chandle")
            packetInfo.update({'handle': handle})

    return packetInfo


# ------- PACKET CALLBACK FUNCTION ------
def captureBluetooth(packet):

    global deviceInfo, connectionInfo, bd_addr, handle

    db['raw_data'].insert_one(toJSON(packet))

    direction = bluetooth_message_direction(packet)
    message_type = bluetooth_message_type(packet)
    role = ('controller', 'host')[direction == 'sent']

    deviceInfo.update(checkDeviceInfo(packet,  role))
    connectionInfo.update(checkConnectionInfo(packet, role))


    if 'bd_addr' in deviceInfo.keys():

        for entry, value in deviceInfo.copy().items():

            if entry == 'bd_addr':
                bd_addr = value

                if bd_addr not in app_data["devices"][role].keys():

                    app_data["devices"][role].update({bd_addr: BluetoothDevice(bd_addr=bd_addr)})

                del deviceInfo[entry]

            else:

                if bd_addr in app_data["devices"][role]:

                    device = app_data["devices"][role][bd_addr].getDbEntry()
                    app_data["devices"][role][bd_addr].updateField('role', role)

                    if entry == 'handle':
                        app_data["devices"][role][bd_addr].updateConnections(value)
                    else:
                        app_data["devices"][role][bd_addr].updateField(entry, value)

                    del deviceInfo[entry]

    if 'handle' in connectionInfo.keys():

        for entry, value in connectionInfo.copy().items():

            if entry == 'handle':

                handle = value

                if handle not in app_data["connections"]:
                    app_data["connections"].update({handle: BluetoothConnection(handle=handle)})

                del connectionInfo[entry]

            else:

                if handle in app_data["connections"]:

                    app_data["connections"][handle].updateField(entry, value)
                    del connectionInfo[entry]

    # Evaluate Pairing Method if data is available

    for handle, conn in app_data["connections"].items():

        connection = conn.getDbEntry()

        if connection is not None:

            host_addr = connection.get('host_addr')
            controller_addr = connection.get('connection_addr')

            if host_addr is not None and controller_addr is not None:

                host = app_data["devices"]['host'].get(connection['host_addr'])
                controller = app_data["devices"]['controller'].get(connection['controller_addr'])

                if host is not None and controller is not None:

                    conn.evaluatePairingMethod(host.getDbEntry(), controller.getDbEntry())
