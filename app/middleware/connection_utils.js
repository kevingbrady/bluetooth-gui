
export function getEncryptionStatus(statusCode){

  let encryptionStatuses = {
    0: 'Link Level Encryption Disabled',
    1: 'Link Level Encryption Enabled'
  }

  return encryptionStatuses[statusCode]
}

export function getLinkType(typeCode){

  let linkTypes = {
    1: 'ACL Connection (Data Channels)'
  }

  return linkTypes[typeCode]
}

export function getKeyType(typeCode){

  let keyTypes = {
    4: 'Unauthenticated Combination Key (0x04)',
    5: 'Authenticated Combination Key (0x05)'
  }

  return keyTypes[typeCode]
}
