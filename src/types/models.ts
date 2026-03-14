import type { LucideIcon } from "lucide-react";

export type DeviceCategory = "lighting";
export type DeviceStatus = "on" | "off";
export type ScreenKey = "home" | "lighting" | "scenes" | "guest" | "contact";

export interface Device {
  id: string;
  name: string;
  icon: LucideIcon;
  category: DeviceCategory;
  description: string;
  accent: string;
  isOn: boolean;
  location: string;
}

export interface SceneAction {
  deviceId: string;
  targetState: DeviceStatus;
}

export interface Scene {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  mood: string;
  accent: string;
  actions: SceneAction[];
}

export interface GuestInfoItem {
  id: string;
  title: string;
  value: string;
  description: string;
}

export interface ContactAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface OperationResult {
  success: boolean;
  message: string;
}

export interface TuyaStatusProperty {
  code: string;
  value: boolean | number | string;
}

export interface TuyaFunctionDefinition {
  code: string;
  desc?: string;
  name?: string;
  type?: string;
  values?: string;
}

export interface TuyaDeviceRecord {
  id: string;
  name: string;
  category?: string;
  status: TuyaStatusProperty[];
  functions: TuyaFunctionDefinition[];
}

export interface TuyaDirectAccessResult {
  details: Record<string, unknown> | null;
  status: TuyaStatusProperty[];
  functions: TuyaFunctionDefinition[];
}

export interface TuyaUserDeviceSummary {
  id: string;
  name: string;
  product_name?: string;
  category?: string;
  online?: boolean;
}

export interface TuyaMappingEntry {
  localDeviceId: string;
  tuyaDeviceId: string;
  commandCode: string;
  channelLabel?: string;
  fallbackPowerCode?: string;
}

export interface DeviceProvider {
  getDevices(): Promise<Device[]>;
  setDeviceState(deviceId: string, isOn: boolean): Promise<OperationResult>;
  turnOffAll(): Promise<OperationResult>;
}

export interface SceneProvider {
  getScenes(): Promise<Scene[]>;
  activateScene(sceneId: string): Promise<OperationResult>;
}
