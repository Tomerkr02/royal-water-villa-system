import { NextResponse } from "next/server";
import { tuyaDeviceMapping } from "@/config/tuya-device-mapping";
import { discoverTuyaDevices } from "@/lib/server/tuya-client";

export async function GET() {
  try {
    const devices = await discoverTuyaDevices();

    devices.forEach((device) => {
      console.log("[Tuya discovery]", {
        id: device.id,
        name: device.name,
        category: device.category,
        status: device.status,
        functions: device.functions,
      });
    });

    return NextResponse.json({
      success: true,
      devices,
      mapping: tuyaDeviceMapping,
      liveControlEnabled: process.env.NEXT_PUBLIC_DEVICE_PROVIDER === "tuya",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Tuya discovery error";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
