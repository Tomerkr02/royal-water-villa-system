import { deviceSeed } from "@/data/devices";
import { sceneSeed } from "@/data/scenes";
import { delay } from "@/lib/utils";
import type {
  Device,
  DeviceProvider,
  OperationResult,
  Scene,
  SceneProvider,
} from "@/types/models";

function cloneDevices(source: Device[]) {
  return source.map((device) => ({ ...device }));
}

function cloneScenes(source: Scene[]) {
  return source.map((scene) => ({
    ...scene,
    actions: scene.actions.map((action) => ({ ...action })),
  }));
}

let devices: Device[] = cloneDevices(deviceSeed);

function result(message: string, success = true): OperationResult {
  return { success, message };
}

export const mockProvider: DeviceProvider & SceneProvider = {
  async getDevices() {
    await delay(180);
    return cloneDevices(devices);
  },

  async setDeviceState(deviceId, isOn) {
    await delay(260);
    devices = devices.map((device) =>
      device.id === deviceId ? { ...device, isOn } : device,
    );

    return result(isOn ? "התאורה הופעלה בהצלחה." : "התאורה כובתה בהצלחה.");
  },

  async turnOffAll() {
    await delay(420);
    devices = devices.map((device) => ({ ...device, isOn: false }));
    return result("כל התאורות כובו.");
  },

  async getScenes(): Promise<Scene[]> {
    await delay(150);
    return cloneScenes(sceneSeed);
  },

  async activateScene(sceneId) {
    await delay(520);
    const scene = sceneSeed.find((entry) => entry.id === sceneId);

    if (!scene) {
      return result("המצב שנבחר לא נמצא.", false);
    }

    devices = devices.map((device) => {
      const action = scene.actions.find((entry) => entry.deviceId === device.id);
      if (!action) {
        return device;
      }

      return { ...device, isOn: action.targetState === "on" };
    });

    return result(`${scene.name} הופעל בהצלחה.`);
  },
};
