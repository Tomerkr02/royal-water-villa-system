import { mockProvider } from "@/services/providers/mock-provider";
import { tuyaProvider } from "@/services/providers/tuya-provider";

export type ProviderName = "mock" | "tuya";

export function getProvider(name?: ProviderName) {
  if (name) {
    return name === "tuya" ? tuyaProvider : mockProvider;
  }

  return process.env.NEXT_PUBLIC_DEVICE_PROVIDER === "tuya"
    ? tuyaProvider
    : mockProvider;
}

export function getProviderName() {
  return process.env.NEXT_PUBLIC_DEVICE_PROVIDER === "tuya" ? "tuya" : "mock";
}
