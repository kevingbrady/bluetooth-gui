from pyshark_parser import packet_util
import json

def toJSON(pkt):

    json_packet = json.dumps(pkt, default=lambda o: o.__dict__)
    json_packet = json_packet.replace(".", "*")           # Cannot have . as key in JSON
    json_packet = json_packet.replace("length", "size")   # Using 'length' as key confuses front end libraries for display so change to 'size'   
    json_packet = json.loads(json_packet)
    return json_packet


def printFullPacket(packet, *args, **kwargs):
    print(packet.frame_info._all_fields['frame.number'], vars(packet[args[0]]))


def is_layer_here(pkt, layer):

    if pkt.__contains__(layer):

        return True

    return False


def get_field_names(layer):

    return layer.field_names

def print_field_names(layer):                               # gets each of the field names of a specific layer in the packet

    for name in layer.field_names:

        print(name)
    '''
    z = 0
    while z <= len(layer.field_names) - 1:

        print(layer.field_names[z])

        z += 1'''


def is_field_here(pkt, layer, field):

    if is_layer_here(pkt, layer):

        #check format of field name
        if field != pkt[layer]._sanitize_field_name(field):

            field = pkt[layer]._sanitize_field_name(field)

        if field in pkt[layer].field_names:

            return True

    return False


def bluetooth_message_type(packet):

    type = {

        '0x00000001': 'Command',
        '0x00000002': 'ACL',
        '0x00000004': 'Event'

    }

    return type.get(packet.hci_h4.type)


def bluetooth_message_direction(packet):

    direction = {

        '0x00000000': 'sent',
        '0x00000001': 'received'
    }

    return direction.get(packet.hci_h4.direction)


def get_device_class_info(packet, layer):

    device_class = {
      'major': None,
      'minor': None,
      'services': {
        'information': None,
        'telephony': None,
        'audio': None,
        'object_transfer': None,
        'capturing': None,
        'rendering': None,
        'networking': None,
        'positioning': None,
        'limited_discoverable_mode': None,
        'reserved': None
      }
    }

    device_class_tree = packet[layer]._all_fields['btcommon.cod.class_of_device_tree']

    device_class['major'] = int(device_class_tree['btcommon.cod.major_device_class'], 0)
    device_class['minor'] = int(device_class_tree['btcommon.cod.minor_device_class'], 0)

    # Record available services

    device_class['services']['information'] = device_class_tree['btcommon.cod.major_service_classes.information']
    device_class['services']['telephony'] = device_class_tree['btcommon.cod.major_service_classes.telephony']
    device_class['services']['audio'] = device_class_tree['btcommon.cod.major_service_classes.audio']
    device_class['services']['object_transfer'] = device_class_tree['btcommon.cod.major_service_classes.object_transfer']
    device_class['services']['capturing'] = device_class_tree['btcommon.cod.major_service_classes.capturing']
    device_class['services']['rendering'] = device_class_tree['btcommon.cod.major_service_classes.rendering']
    device_class['services']['networking'] = device_class_tree['btcommon.cod.major_service_classes.networking']
    device_class['services']['positioning'] = device_class_tree['btcommon.cod.major_service_classes.positioning']
    device_class['services']['limited_discoverable_mode'] = device_class_tree['btcommon.cod.major_service_classes.limited_discoverable_mode']
    device_class['services']['reserved'] = device_class_tree['btcommon.cod.major_service_classes.reserved']

    return device_class


def get_field(pkt, layer, field):

    if is_field_here(pkt, layer, field):

        full_field_name = str(layer) + "." + str(field)

        return pkt[layer]._all_fields[full_field_name]
        #return packet_util.get_value_from_packet_for_layer_field(pkt, layer, full_field_name)

    return None
