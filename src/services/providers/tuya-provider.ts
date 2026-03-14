"use client";

import { getTuyaMappingByLocalDeviceId } from "@/config/tuya-device-mapping";
import { deviceSeed } from "@/data/devices";
import { sceneSeed } from "@/data/scenes";
import type {
  Device,
  DeviceProvider,
  OperationResult,
  Scene,
  SceneProvider,
} from "@/types/models";

async function getJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as T & { success?: boolean; message?: string };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? "Tuya request failed.");
  }

  return payload;
}

export const tuyaProvider: DeviceProvider & SceneProvider = {
  async getDevices(): Promise<Device[]> {
    console.log("[Tuya provider] API route called", {
      route: "/api/tuya/local-devices",
      method: "GET",
    });

    const payload = await getJson<{
      success: true;
      deviceStates: Record<string, boolean | null>;
    }>("/api/tuya/local-devices", {
      method: "GET",
      cache: "no-store",
    });

    console.log("[Tuya provider] API response", {
      route: "/api/tuya/local-devices",
      response: payload,
    });

    return deviceSeed.map((device) => {
      const currentState = payload.deviceStates[device.id];

      return {
        ...device,
        isOn: typeof currentState === "boolean" ? currentState : device.isOn,
      };
    });
  },

  async setDeviceState(deviceId: string, isOn: boolean): Promise<OperationResult> {
    const mapping = getTuyaMappingByLocalDeviceId(deviceId);

    if (!mapping?.tuyaDeviceId) {
      throw new Error(`No Tuya mapping configured for local device '${deviceId}'.`);
    }

    const requestUrl = "/api/tuya/device-access";
    const requestBody = {
      deviceId: mapping.tuyaDeviceId,
      commandCode: mapping.commandCode,
      value: isOn,
    };

    console.log("[Tuya provider] API route called", {
      route: requestUrl,
      method: "POST",
      clickedDeviceId: deviceId,
      resolvedMapping: mapping,
      tuyaDeviceId: mapping.tuyaDeviceId,
      commandCode: mapping.commandCode,
      requestBody,
    });

    const payload = await getJson<{ success: true; message: string; result?: unknown }>(requestUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    console.log("[Tuya provider] API response", {
      route: requestUrl,
      clickedDeviceId: deviceId,
      tuyaDeviceId: mapping.tuyaDeviceId,
      commandCode: mapping.commandCode,
      response: payload,
    });

    return {
      success: true,
      message: payload.message,
    };
  },

  async turnOffAll(): Promise<OperationResult> {
    const devices = await this.getDevices();
    const activeDevices = devices.filter((device) => device.isOn);

    await Promise.all(activeDevices.map((device) => this.setDeviceState(device.id, false)));

    return {
      success: true,
      message: "כל הממסרים הממופים כובו דרך Tuya.",
    };
  },

  async getScenes(): Promise<Scene[]> {
    return sceneSeed;
  },

  async activateScene(sceneId: string): Promise<OperationResult> {
    const scene = sceneSeed.find((entry) => entry.id === sceneId);

    if (!scene) {
      return {
        success: false,
        message: "המצב שנבחר לא נמצא.",
      };
    }

    await Promise.all(
      scene.actions.map((action) =>
        this.setDeviceState(action.deviceId, action.targetState === "on"),
      ),
    );

    return {
      success: true,
      message: `${scene.name} הופעל דרך Tuya.`,
    };
  },
};
