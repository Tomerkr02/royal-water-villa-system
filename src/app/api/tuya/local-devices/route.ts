import { NextResponse } from "next/server";
import { getTuyaMappingByLocalDeviceId } from "@/config/tuya-device-mapping";
import { deviceSeed } from "@/data/devices";
import {
  clearPendingCommandState,
  getPendingCommandState,
  getTuyaDeviceDirectAccess,
} from "@/lib/server/tuya-client";

function deriveDeviceState(
  statusEntries: Array<{ code: string; value: boolean | number | string }>,
  commandCode: string,
  fallbackPowerCode?: string,
) {
  const status =
    statusEntries.find((entry) => entry.code === commandCode) ??
    (fallbackPowerCode
      ? statusEntries.find((entry) => entry.code === fallbackPowerCode)
      : undefined);

  return status?.value === true || status?.value === 1 || status?.value === "true";
}

function getStatusEntry(
  statusEntries: Array<{ code: string; value: boolean | number | string }>,
  commandCode: string,
  fallbackPowerCode?: string,
) {
  return (
    statusEntries.find((entry) => entry.code === commandCode) ??
    (fallbackPowerCode
      ? statusEntries.find((entry) => entry.code === fallbackPowerCode)
      : undefined)
  );
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function GET() {
  try {
    const stateEntries = await Promise.all(
      deviceSeed.map(async (device) => {
        const mapping = getTuyaMappingByLocalDeviceId(device.id);

        if (!mapping?.tuyaDeviceId) {
          console.log("[Tuya local-devices] missing mapping", {
            localDeviceId: device.id,
          });

          return [device.id, null] as const;
        }

        try {
          let directAccess = await getTuyaDeviceDirectAccess(mapping.tuyaDeviceId);
          let statusEntry = getStatusEntry(
            directAccess.status,
            mapping.commandCode,
            mapping.fallbackPowerCode,
          );
          let resolvedState = deriveDeviceState(
            directAccess.status,
            mapping.commandCode,
            mapping.fallbackPowerCode,
          );
          const pendingState = getPendingCommandState(mapping.tuyaDeviceId, mapping.commandCode);

          console.log("[Tuya local-devices] raw status payload", {
            localDeviceId: device.id,
            resolvedMapping: mapping,
            tuyaDeviceId: mapping.tuyaDeviceId,
            commandCode: mapping.commandCode,
            rawStatusPayload: directAccess.status,
            matchedStatusEntry: statusEntry ?? null,
            derivedState: resolvedState,
            pendingState,
          });

          if (pendingState && resolvedState !== pendingState.value) {
            for (let attempt = 1; attempt <= 3; attempt += 1) {
              await delay(450);
              directAccess = await getTuyaDeviceDirectAccess(mapping.tuyaDeviceId);
              statusEntry = getStatusEntry(
                directAccess.status,
                mapping.commandCode,
                mapping.fallbackPowerCode,
              );
              resolvedState = deriveDeviceState(
                directAccess.status,
                mapping.commandCode,
                mapping.fallbackPowerCode,
              );

              console.log("[Tuya local-devices] propagation retry", {
                localDeviceId: device.id,
                attempt,
                tuyaDeviceId: mapping.tuyaDeviceId,
                commandCode: mapping.commandCode,
                rawStatusPayload: directAccess.status,
                matchedStatusEntry: statusEntry ?? null,
                derivedState: resolvedState,
                expectedPendingState: pendingState.value,
              });

              if (resolvedState === pendingState.value) {
                clearPendingCommandState(mapping.tuyaDeviceId, mapping.commandCode);
                break;
              }
            }
          }

          if (pendingState && resolvedState !== pendingState.value) {
            console.log("[Tuya local-devices] using pending command fallback", {
              localDeviceId: device.id,
              tuyaDeviceId: mapping.tuyaDeviceId,
              commandCode: mapping.commandCode,
              staleDerivedState: resolvedState,
              fallbackState: pendingState.value,
            });

            resolvedState = pendingState.value;
          }

          console.log("[Tuya local-devices] resolved device state", {
            localDeviceId: device.id,
            resolvedMapping: mapping,
            tuyaDeviceId: mapping.tuyaDeviceId,
            commandCode: mapping.commandCode,
            matchedStatusEntry: statusEntry ?? null,
            resolvedState,
          });

          return [device.id, resolvedState] as const;
        } catch (error) {
          console.log("[Tuya local-devices] direct access failed", {
            localDeviceId: device.id,
            resolvedMapping: mapping,
            tuyaDeviceId: mapping.tuyaDeviceId,
            commandCode: mapping.commandCode,
            error: error instanceof Error ? error.message : "Unknown error",
          });

          return [device.id, null] as const;
        }
      }),
    );

    const mappedStates = Object.fromEntries(stateEntries);

    return NextResponse.json({
      success: true,
      deviceStates: mappedStates,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Tuya-backed local devices.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
