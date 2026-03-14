import "server-only";

export type TuyaDiscoveryStrategy = "project" | "device_ids";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required Tuya environment variable: ${name}`);
  }

  return value;
}

export function getTuyaEnv() {
  return {
    baseUrl: process.env.TUYA_API_BASE_URL ?? "https://openapi.tuyaeu.com",
    accessId: getRequiredEnv("TUYA_ACCESS_ID"),
    accessSecret: getRequiredEnv("TUYA_ACCESS_SECRET"),
    discoveryStrategy: (process.env.TUYA_DISCOVERY_STRATEGY ?? "project") as TuyaDiscoveryStrategy,
    discoveryDeviceIds: (process.env.TUYA_DISCOVERY_DEVICE_IDS ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    discoveryPageSize: Number(process.env.TUYA_DISCOVERY_PAGE_SIZE ?? "75"),
  };
}
