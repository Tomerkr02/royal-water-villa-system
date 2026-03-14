import type { TuyaMappingEntry } from "@/types/models";

export const tuyaDeviceMapping: TuyaMappingEntry[] = [
  {
    localDeviceId: "wallLight",
    tuyaDeviceId: "bffcde940e008e6f8bsiaj",
    commandCode: "switch_1",
    channelLabel: "Wall Light",
  },
  {
    localDeviceId: "pergolaLight",
    tuyaDeviceId: "bfa046217ed22cbb88x6mw",
    commandCode: "switch_1",
    channelLabel: "Pergola Light",
  },
  {
    localDeviceId: "livingRoomLedWall",
    tuyaDeviceId: "bfae97a0468699bf6es1mx",
    commandCode: "switch_1",
    channelLabel: "Living Room LED Wall",
  },
  {
    localDeviceId: "livingRoomCeilingSpots",
    tuyaDeviceId: "bfae97a0468699bf6es1mx",
    commandCode: "switch_2",
    channelLabel: "Living Room Ceiling Spots",
  },
  {
    localDeviceId: "barLight",
    tuyaDeviceId: "bf2af07eae210d7a388lkx",
    commandCode: "switch_1",
    channelLabel: "Bar Light",
  },
  {
    localDeviceId: "poolLight",
    tuyaDeviceId: "bf2af07eae210d7a388lkx",
    commandCode: "switch_2",
    channelLabel: "Pool Light",
  },
  {
    localDeviceId: "rearPathLight",
    tuyaDeviceId: "bfb7a879c0ebf0c6e66lc2",
    commandCode: "switch_1",
    channelLabel: "Rear Path Light",
  },
  {
    localDeviceId: "outdoorWallLight",
    tuyaDeviceId: "bfe6a09f4ad1838449xayz",
    commandCode: "switch_1",
    channelLabel: "Exterior Wall Light",
  },
  {
    localDeviceId: "bathroomLight",
    tuyaDeviceId: "bfe6a09f4ad1838449xayz",
    commandCode: "switch_2",
    channelLabel: "Bathroom Light",
  },
  {
    localDeviceId: "ceilingFan",
    tuyaDeviceId: "bfed21a4097abed981lg6y",
    commandCode: "switch",
    channelLabel: "Ceiling Fan",
  },
  {
    localDeviceId: "ceilingFanLight",
    tuyaDeviceId: "bfed21a4097abed981lg6y",
    commandCode: "light",
    channelLabel: "Fan Light",
  },
  {
    localDeviceId: "bathroomHeater",
    tuyaDeviceId: "bfeb1883831883a9225uan",
    commandCode: "switch",
    channelLabel: "Bathroom Heater",
  },
];

export function getTuyaMappingByLocalDeviceId(localDeviceId: string) {
  return tuyaDeviceMapping.find((entry) => entry.localDeviceId === localDeviceId);
}
