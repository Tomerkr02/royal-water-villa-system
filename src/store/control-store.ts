"use client";

import { create } from "zustand";
import { guestInfoSeed } from "@/data/guest-info";
import { getTuyaMappingByLocalDeviceId } from "@/config/tuya-device-mapping";
import { getCurrentUiLanguage, translate } from "@/lib/i18n";
import { deviceService } from "@/services/device-service";
import { getProviderName } from "@/services/provider-registry";
import { sceneService } from "@/services/scene-service";
import type {
  Device,
  GuestInfoItem,
  OperationResult,
  Scene,
  ScreenKey,
} from "@/types/models";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  title: string;
  message: string;
  tone: ToastTone;
}

interface ControlState {
  activeScreen: ScreenKey;
  devices: Device[];
  scenes: Scene[];
  guestInfo: GuestInfoItem[];
  selectedSceneId?: string;
  booting: boolean;
  loading: boolean;
  confirmPowerOffOpen: boolean;
  toasts: Toast[];
  initialize: () => Promise<void>;
  setActiveScreen: (screen: ScreenKey) => void;
  toggleDevice: (deviceId: string) => Promise<void>;
  activateScene: (sceneId: string) => Promise<void>;
  turnOffAll: () => Promise<void>;
  setConfirmPowerOffOpen: (open: boolean) => void;
  dismissToast: (id: number) => void;
}

let toastId = 1;

function createToast(title: string, message: string, tone: ToastTone): Toast {
  return {
    id: toastId++,
    title,
    message,
    tone,
  };
}

function pushResultToast(
  set: (partial: Partial<ControlState> | ((state: ControlState) => Partial<ControlState>)) => void,
  result: OperationResult,
  titleKey: string,
  messageKey: string,
) {
  const language = getCurrentUiLanguage();
  set((state) => ({
    toasts: [
      ...state.toasts,
      createToast(
        translate(language, titleKey),
        result.success ? translate(language, messageKey) : result.message,
        result.success ? "success" : "error",
      ),
    ],
  }));
}

export const useControlStore = create<ControlState>((set, get) => ({
  activeScreen: "home",
  devices: [],
  scenes: [],
  guestInfo: guestInfoSeed,
  selectedSceneId: undefined,
  booting: true,
  loading: false,
  confirmPowerOffOpen: false,
  toasts: [],

  async initialize() {
    try {
      set({ loading: true });
      const [devices, scenes] = await Promise.all([
        deviceService.getDevices(),
        sceneService.getScenes(),
      ]);

      set({
        devices,
        scenes,
        loading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : translate(getCurrentUiLanguage(), "common.loadingErrorMessage");

      set({ loading: false });
      pushResultToast(
        set,
        {
          success: false,
          message,
        },
        "common.loadingErrorTitle",
        "common.loadingErrorMessage",
      );
    }

    setTimeout(() => {
      set({ booting: false });
    }, 1500);
  },

  setActiveScreen(screen) {
    set({ activeScreen: screen });
  },

  async toggleDevice(deviceId) {
    const state = get();
    const device = state.devices.find((entry) => entry.id === deviceId);
    if (!device) {
      return;
    }

    try {
      const mapping = getTuyaMappingByLocalDeviceId(deviceId);

      console.log("[UI toggle] device clicked", {
        clickedDeviceId: deviceId,
        selectedProvider: getProviderName(),
        resolvedMapping: mapping ?? null,
        tuyaDeviceId: mapping?.tuyaDeviceId ?? null,
        commandCode: mapping?.commandCode ?? null,
        currentValue: device.isOn,
        nextValue: !device.isOn,
      });

      set({ loading: true });
      const result = await deviceService.setDeviceState(deviceId, !device.isOn);
      const devices = await deviceService.getDevices();

      console.log("[UI toggle] command result", {
        clickedDeviceId: deviceId,
        selectedProvider: getProviderName(),
        resolvedMapping: mapping ?? null,
        tuyaDeviceId: mapping?.tuyaDeviceId ?? null,
        commandCode: mapping?.commandCode ?? null,
        commandResult: result,
      });

      set({ devices, loading: false });
      pushResultToast(set, result, "common.commandSentTitle", "common.commandSentMessage");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : translate(getCurrentUiLanguage(), "common.commandFailedMessage");
      set({ loading: false });
      pushResultToast(set, { success: false, message }, "common.commandFailedTitle", "common.commandFailedMessage");
    }
  },

  async activateScene(sceneId) {
    try {
      set({ loading: true, selectedSceneId: sceneId });
      const result = await sceneService.activateScene(sceneId);
      const devices = await deviceService.getDevices();

      set({ devices, loading: false });
      pushResultToast(set, result, "common.sceneActivatedTitle", "common.sceneActivatedMessage");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : translate(getCurrentUiLanguage(), "common.sceneErrorMessage");
      set({ loading: false });
      pushResultToast(set, { success: false, message }, "common.sceneErrorTitle", "common.sceneErrorMessage");
    }
  },

  async turnOffAll() {
    try {
      set({ loading: true, confirmPowerOffOpen: false, selectedSceneId: undefined });
      const result = await deviceService.turnOffAll();
      const devices = await deviceService.getDevices();

      set({ devices, loading: false });
      pushResultToast(set, result, "common.allOffTitle", "common.allOffMessage");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : translate(getCurrentUiLanguage(), "common.allOffErrorMessage");
      set({ loading: false });
      pushResultToast(set, { success: false, message }, "common.allOffErrorTitle", "common.allOffErrorMessage");
    }
  },

  setConfirmPowerOffOpen(open) {
    set({ confirmPowerOffOpen: open });
  },

  dismissToast(id) {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
