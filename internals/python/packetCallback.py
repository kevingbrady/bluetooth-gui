from pyshark_tools import *
from Connection import BluetoothConnection
from Device import BluetoothDevice
from DeviceClassCodes import *
import copy
# (False, True)[if condition is true]


def getAddress(packet, layer, role):
    address = get_field(packet, layer, 'bd_addr')
    deviceInfo[role].update({'bd_addr': address})

    if address not in advertisingAddresses:
        deviceInfo[role].update({"address_randomized": True})

    else:
        deviceInfo[role].update({"address_randomized": False})

def checkDeviceInfo(packet, role):

    global deviceInfo, advertisingAddresses
    packetInfo = {}

    if is_layer_here(packet, "bthci_cmd"):

        layer = "bthci_cmd"
        command = int(get_field(packet, layer, "opcode"))

        if is_field_here(packet, layer, "bd_addr"):

            if command in (8197, 1029, 1036, 1049, 1067, 1068, 3090):

                #Address in packet refers to controller address
                getAddress(packet, layer, 'controller')

            else:
                #print(packet.frame_info._all_fields['frame.number'], vars(packet.bthci_cmd))
                getAddress(packet, layer, 'host')

        if is_field_here(packet, layer, 'class_of_device_tree'):
            device_class_info = get_device_class_info(packet, layer)
            device_class_info['major'] = MAJOR_DEVICE_CLASSES[device_class_info['major']]
            device_class_info['minor'] = MINOR_DEVICE_CLASSES[device_class_info['major']][device_class_info['minor']]

            device_class = device_class_info['major'] + ': ' + device_class_info['minor']
            deviceInfo[role].update({'device_class': device_class})
            deviceInfo[role].update({'services': device_class_info['services']})

        if is_field_here(packet, layer, "auth_requirements"):
            authentication = get_field(packet, layer, 'auth_requirements')
            deviceInfo[role].update({"authentication": int(authentication, 0)})

        if is_field_here(packet, layer, "io_capability"):
            io_capability = get_field(packet, layer, 'io_capability')
            deviceInfo[role].update({"io_capability": int(io_capability, 0)})

        if is_field_here(packet, layer, 'oob_data_present'):
            oob_data_present = get_field(packet, layer, 'oob_data_present')
            deviceInfo[role].update({"oob_flag": int(oob_data_present, 0)})

    if is_layer_here(packet, "bthci_evt"):

        layer = "bthci_evt"
        event = int(get_field(packet, layer, 'code'))
        command = 0

        if is_field_here(packet, layer, 'opcode'):

            command = int(get_field(packet, layer, "opcode"))

        if is_field_here(packet, layer, "bd_addr"):

            event_address = get_field(packet, layer, "bd_addr")

            if event in (62, 47):

                if event == 62:

                    sub_event = int(get_field(packet, layer, 'le_meta_subevent'), 0)

                    if sub_event != 2:
                        bd_addr = get_field(packet, layer, "bd_addr")
                        getAddress(packet, layer, role)

                    else:
                        advertisingAddresses.append(event_address)

                else:
                    advertisingAddresses.append(event_address)

            else:
                if command == 4105:
                    # Address in packet refers to host address
                    getAddress(packet, layer, 'host')

                else:

                    #print(packet.frame_info._all_fields['frame.number'], vars(packet.bthci_evt))
                    getAddress(packet, layer, 'controller')

        if is_field_here(packet, layer, 'lmp_vers_nr'):
            lmp_version = get_field(packet, layer, 'lmp_vers_nr')
            bluetooth_version = BluetoothDevice.getBluetoothVersion(lmp_version)
            deviceInfo[role].update({"bluetooth_verison": bluetooth_version})

        if is_field_here(packet, layer, "lmp_features.secure_simple_pairing_host"):
            secure_simple_pairing = get_field(packet, layer, "lmp_features.secure_simple_pairing_host")
            deviceInfo[role].update({"secure_simple_pairing": secure_simple_pairing})

        if is_field_here(packet, layer, 'lmp_features.le_supported.host'):
            le_supported = get_field(packet, layer,'lmp_features.le_supported.host')
            deviceInfo[role].update({"le_supported": le_supported})

        if is_field_here(packet, layer, "lmp_features.simultaneous_le_and_br_edr.host"):
            simultaneous_bdr_le = get_field(packet, layer, "lmp_features.simultaneous_le_and_br_edr.host")
            deviceInfo[role].update({"simultaneous_bdr_le": simultaneous_bdr_le})

        if is_field_here(packet, layer, "auth_requirements"):
            auth_requirements = get_field(packet, layer, 'auth_requirements')
            deviceInfo[role].update({"authentication": int(auth_requirements, 0)})

        if is_field_here(packet, layer, "io_capability"):
            io_capability = get_field(packet, layer, 'io_capability')
            deviceInfo[role].update({"io_capability": int(io_capability, 0)})

        if is_field_here(packet, layer, 'oob_data_present'):
            oob_data_present = get_field(packet, layer, 'oob_data_present')
            deviceInfo[role].update({"oob_flag": int(oob_data_present, 0)})


    if is_layer_here(packet, "bthci_acl"):

        layer = "bthci_acl"

        if is_field_here(packet, layer, 'src.bd_addr'):

            src_device_addr = get_field(packet, layer, 'src.bd_addr')
            deviceInfo[role].update({'bd_addr': src_device_addr})

            if src_device_addr not in advertisingAddresses:
                deviceInfo[role].update({"address_randomized": True})

            else:
                deviceInfo[role].update({"address_randomized": False})

        if is_field_here(packet, layer, 'src.name'):
            src_device_name = get_field(packet, layer, 'src.name')
            deviceInfo[role].update({'device_name': src_device_name})

        if is_field_here(packet, layer, 'chandle'):

            handle = get_field(packet, 'bthci_acl', 'chandle')
            deviceInfo[role].update({'handle': handle})

    if is_layer_here(packet, "btsmp"):

        layer = "btsmp"

        #print(vars(packet.btsmp))
        if is_field_here(packet, layer, 'io_capability'):
            io_capability = get_field(packet, layer, 'io_capability')
            deviceInfo[role].update({"io_capability": int(io_capability, 0)})

        if is_field_here(packet, layer, 'oob_data_flags'):
            oob_data_flags = get_field(packet, layer, 'oob_data_flags')
            deviceInfo[role].update({"oob_flag": int(oob_data_flags, 0)})

        if is_field_here(packet, layer, 'authreq'):
            authentication = get_field(packet, layer, 'authreq')
            deviceInfo[role].update({"authentication": int(authentication, 0)})

        if is_field_here(packet, layer, 'authreq_tree'):
            authreq_tree = get_field(packet, layer, 'authreq_tree')
            secure_connection_flag, \
            mitm_flag,\
            bonding_flag = BluetoothDevice.parseAuthenticationTree(authreq_tree)

            deviceInfo[role].update({"secure_connection_flag": secure_connection_flag})
            deviceInfo[role].update({"mitm_flag": mitm_flag})
            deviceInfo[role].update({"bonding_flag": bonding_flag})

        if is_field_here(packet, layer, "cfm_value"):
            cfm_value = get_field(packet, layer, "cfm_value")
            deviceInfo[role].update({"cfm_value": cfm_value})

        if is_field_here(packet, layer, "random_value"):
            random_value = get_field(packet, layer, "random_value")

            if is_field_here(packet, layer, "ediv"):

                ediv = get_field(packet, layer, "ediv")
                deviceInfo[role].update({"master_identification": {"ediv": ediv, "random_value": random_value}})

            else:

                deviceInfo[role].update({"random_value": random_value})

        if is_field_here(packet, layer, "long_term_key"):
            long_term_key = get_field(packet, layer, "long_term_key")
            deviceInfo[role].update({"long_term_key": long_term_key})

        if is_field_here(packet, layer, "id_resolving_key"):
            id_resolving_key = get_field(packet, layer, "id_resolving_key")
            deviceInfo[role].update({"id_resolving_key": id_resolving_key})

        if is_field_here(packet, layer, "signature_key"):
            signature_key = get_field(packet, layer, "signature_key")
            deviceInfo[role].update({"signature_key": signature_key})


def checkConnectionInfo(packet, role):

    global connectionInfo, handle
    if is_layer_here(packet, "bthci_cmd"):

        layer = "bthci_cmd"

        if is_field_here(packet, layer, "connection_handle"):

                handle = get_field(packet, layer, "connection_handle")

        if is_field_here(packet, layer, "encryption_enable"):

            encryption_enable = get_field(packet, layer, "encryption_enable")
            connectionInfo.update({"encryption": int(encryption_enable, 0)})

        if is_field_here(packet, layer, "link_key"):
            link_key = get_field(packet, layer, "link_key")
            connectionInfo.update({"link_key": link_key})

        if is_field_here(packet, layer, "key_type"):
            key_type = get_field(packet, layer, "key_type")
            connectionInfo.update({"key_type": int(key_type, 0)})

    if is_layer_here(packet, "bthci_evt"):

        layer = "bthci_evt"

        if is_field_here(packet, layer, "connection_handle"):

            handle = get_field(packet, layer, "connection_handle")
            connectionInfo.update({'handle': handle})

        if is_field_here(packet, layer, "link_type"):

            link_type = get_field(packet, layer, "link_type")
            connectionInfo.update({"link_type": int(link_type, 0)})

        if is_field_here(packet, layer, "encryption_mode"):

            encryption_mode = get_field(packet, layer, "encryption_mode")
            connectionInfo.update({"encryption": int(encryption_mode, 0)})

        if is_field_here(packet, layer, "enc_key_size"):
            encryption_key_size = get_field(packet, layer, "enc_key_size")
            connectionInfo.update({"encryption_key_size": encryption_key_size})

        if is_field_here(packet, layer, "code"):
            if is_field_here(packet, layer, "status"):

                code = get_field(packet, layer, "code")
                status = get_field(packet, layer, "status")
                if code == '54' and status == '0':

                    connectionInfo.update({"simple_pairing_mode": True})

        if is_field_here(packet, layer, "encryption_enable"):

            encryption_enable = get_field(packet, layer, "encryption_enable")
            connectionInfo.update({"encryption": int(encryption_enable, 0)})

        if is_field_here(packet, layer, "link_key"):

            link_key = get_field(packet, layer, "link_key")
            connectionInfo.update({"link_key": link_key})

        if is_field_here(packet, layer, "key_type"):

            key_type = get_field(packet, layer, "key_type")
            connectionInfo.update({"key_type": int(key_type, 0)})

    if is_layer_here(packet, "bthci_acl"):

        layer = "bthci_acl"

        if role == "host":

            if is_field_here(packet, layer, 'src.name'):
                src_name = get_field(packet, layer, 'src.name')
                connectionInfo.update({"host_name": src_name})

            if is_field_here(packet, layer, 'src.bd_addr'):
                src_bd_addr = get_field(packet, layer, 'src.bd_addr')
                connectionInfo.update({"host_addr": src_bd_addr})

            if is_field_here(packet, layer, 'dst.name'):
                dst_name = get_field(packet, layer, "dst.name")
                connectionInfo.update({"controller_name": dst_name})

            if is_field_here(packet, layer, 'dst.bd_addr'):
                dst_bd_addr = get_field(packet, layer, "dst.bd_addr")
                connectionInfo.update({"controller_addr": dst_bd_addr})

        if is_field_here(packet, layer, 'chandle'):
            handle = get_field(packet, layer, "chandle")
            connectionInfo.update({'handle': handle})



# ------- PACKET CALLBACK FUNCTION ------
def captureBluetooth(packet):

    global db, app_data, deviceInfo, connectionInfo, bd_addr, handle

    db['raw_data'].insert_one(toJSON(packet))

    direction = bluetooth_message_direction(packet)
    message_type = bluetooth_message_type(packet)
    role = ('controller', 'host')[direction == 'sent']

    checkDeviceInfo(packet,  role)
    checkConnectionInfo(packet, role)

    #print(packet.number, role, deviceInfo[role])

    for entry, value in deviceInfo[role].copy().items():

        if entry in ('bd_addr', 'address_randomized'):

            if entry == 'bd_addr':
              bd_addr = value

              if bd_addr not in app_data["devices"]['host'].keys():
                if bd_addr not in app_data["devices"]['controller'].keys():

                  newDevice = BluetoothDevice(bd_addr=bd_addr,
                                              role=role,
                                              address_randomized=deviceInfo[role]['address_randomized'])

                  app_data["devices"][role].update({
                        bd_addr: newDevice})

            del deviceInfo[role][entry]

        else:

            for Role, Devices in app_data["devices"].copy().items():
                for Address, Device in Devices.copy().items():

                    if Address == bd_addr:

                        if Role == role:

                            device_entry = Device.getDbEntry()

                            if entry == 'handle':
                                Device.updateConnections(value)

                            elif entry in ('cfm_value',
                                       'random_value',
                                       'master_identification',
                                       'long_term_key',
                                       'id_resolving_key',
                                       'signature_key'):

                                Device.updateSecurityKeys(entry, value)

                            else:

                                Device.updateField(entry, value)

                            if entry in device_entry:
                                del deviceInfo[role][entry]

                if entry not in deviceInfo[role]:
                    break

    for entry, value in connectionInfo.copy().items():

        if entry == 'handle':

            handle = value

            if handle not in app_data["connections"]:
                app_data["connections"].update({handle: BluetoothConnection(handle=handle)})

            del connectionInfo[entry]

        else:

            for Handle, Connection in app_data['connections'].items():

                if Handle == handle:

                    if entry == 'simple_pairing_mode':
                        app_data["connections"][handle].simple_pairing_mode = True

                    # Evaluate Pairing Method if data is available
                    connection_entry = Connection.getDbEntry()

                    host_addr = connection_entry.get('host_addr')
                    controller_addr = connection_entry.get('controller_addr')

                    if host_addr is not None and controller_addr is not None:
                        host = app_data["devices"]['host'].get(host_addr)
                        controller = app_data["devices"]['controller'].get(controller_addr)

                        if host is not None and controller is not None:
                            Connection.evaluatePairingMethod(host.getDbEntry(), controller.getDbEntry())

                    app_data["connections"][handle].updateField(entry, value)
                    del connectionInfo[entry]



