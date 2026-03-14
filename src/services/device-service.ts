import { getTuyaMappingByLocalDeviceId } from "@/config/tuya-device-mapping";
import { getProvider, getProviderName } from "@/services/provider-registry";

export const deviceService = {
  getDevices: () => getProvider().getDevices(),
  setDeviceState: async (deviceId: string, isOn: boolean) => {
    const selectedProvider = getProviderName();
    const mapping = getTuyaMappingByLocalDeviceId(deviceId);

    console.log("[Device service] setDeviceState", {
      clickedDeviceId: deviceId,
      selectedProvider,
      resolvedMapping: mapping ?? null,
      tuyaDeviceId: mapping?.tuyaDeviceId ?? null,
      commandCode: mapping?.commandCode ?? null,
      nextValue: isOn,
    });

    const result = await getProvider().setDeviceState(deviceId, isOn);

    console.log("[Device service] command result", {
      clickedDeviceId: deviceId,
      selectedProvider,
      tuyaDeviceId: mapping?.tuyaDeviceId ?? null,
      commandCode: mapping?.commandCode ?? null,
      commandResult: result,
    });

    return result;
  },
  turnOffAll: () => getProvider().turnOffAll(),
};
