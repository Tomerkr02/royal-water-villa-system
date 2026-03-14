"use client";

import { create } from "zustand";
import { contactActionsSeed } from "@/data/contact-actions";
import { guestInfoSeed } from "@/data/guest-info";
import { getTuyaMappingByLocalDeviceId } from "@/config/tuya-device-mapping";
import { deviceService } from "@/services/device-service";
import { getProviderName } from "@/services/provider-registry";
import { sceneService } from "@/services/scene-service";
import type {
  ContactAction,
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
  contactActions: ContactAction[];
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
  successTitle: string,
) {
  set((state) => ({
    toasts: [
      ...state.toasts,
      createToast(successTitle, result.message, result.success ? "success" : "error"),
    ],
  }));
}

export const useControlStore = create<ControlState>((set, get) => ({
  activeScreen: "home",
  devices: [],
  scenes: [],
  guestInfo: guestInfoSeed,
  contactActions: contactActionsSeed,
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
        error instanceof Error ? error.message : "לא ניתן היה לטעון את מצב המערכת.";

      set({ loading: false });
      pushResultToast(
        set,
        {
          success: false,
          message,
        },
        "שגיאת טעינה",
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
      pushResultToast(set, result, "הפקודה נשלחה");
    } catch (error) {
      const message = error instanceof Error ? error.message : "נכשלה שליחת הפקודה להתקן.";
      set({ loading: false });
      pushResultToast(set, { success: false, message }, "הפקודה נכשלה");
    }
  },

  async activateScene(sceneId) {
    try {
      set({ loading: true, selectedSceneId: sceneId });
      const result = await sceneService.activateScene(sceneId);
      const devices = await deviceService.getDevices();

      set({ devices, loading: false });
      pushResultToast(set, result, "המצב הופעל");
    } catch (error) {
      const message = error instanceof Error ? error.message : "נכשלה הפעלת המצב.";
      set({ loading: false });
      pushResultToast(set, { success: false, message }, "שגיאת מצב");
    }
  },

  async turnOffAll() {
    try {
      set({ loading: true, confirmPowerOffOpen: false, selectedSceneId: undefined });
      const result = await deviceService.turnOffAll();
      const devices = await deviceService.getDevices();

      set({ devices, loading: false });
      pushResultToast(set, result, "כל התאורות כובו");
    } catch (error) {
      const message = error instanceof Error ? error.message : "נכשל כיבוי כלל התאורות.";
      set({ loading: false });
      pushResultToast(set, { success: false, message }, "שגיאת כיבוי");
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
