
export function getAuthentication(authCode){

  let authentication = {
    1: 'Bonding Flags: Bonding',
    2: 'MITM Protection Not Required - Dedicated Bonding, Numeric Comparison, Automatic Accept Allowed, No Secure Connection',
    3: 'MITM Protection Required - Dedicated Bonding, Use IO Capability to Determine Procedure, No Secure Connection',
    5: 'MITM flag, Bonding Flags: Bonding'
  }

  return authentication[authCode]
}

export function getIOCapability(ioCode){

  let ioCapabilities = {
    0: 'Display Only (0)',
    1: 'Display Yes/No (1)',
    2: 'Keyboard Only (2)',
    3: 'No Input, No Output (3)',
    4: 'Keyboard Display (4)',
    5: 'Reserved (5)'
  }

  return ioCapabilities[ioCode]
}

export function getOutofBand(oobCode){

  let outOfBand = {
    0: 'OOB Authentication Data not Present',
    1: 'OOB Authentication Data from Remote Device Present'
  }

  return outOfBand[oobCode]
}
