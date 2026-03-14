import { NextResponse } from "next/server";
import { getTuyaMappingByLocalDeviceId } from "@/config/tuya-device-mapping";
import { sendTuyaCommand } from "@/lib/server/tuya-client";

interface CommandPayload {
  localDeviceId?: string;
  isOn?: boolean;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CommandPayload;

    if (!payload.localDeviceId || typeof payload.isOn !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing localDeviceId or isOn in request body.",
        },
        { status: 400 },
      );
    }

    const mapping = getTuyaMappingByLocalDeviceId(payload.localDeviceId);

    if (!mapping?.tuyaDeviceId) {
      return NextResponse.json(
        {
          success: false,
          message: `No Tuya mapping configured for local device '${payload.localDeviceId}'.`,
        },
        { status: 400 },
      );
    }

    console.log("[Tuya command route] resolved mapping", {
      clickedDeviceId: payload.localDeviceId,
      selectedProvider: process.env.NEXT_PUBLIC_DEVICE_PROVIDER === "tuya" ? "tuya" : "mock",
      resolvedMapping: mapping,
      tuyaDeviceId: mapping.tuyaDeviceId,
      commandCode: mapping.commandCode,
      value: payload.isOn,
    });

    const result = await sendTuyaCommand(mapping.tuyaDeviceId, mapping.commandCode, payload.isOn);

    console.log("[Tuya command route] command result", {
      clickedDeviceId: payload.localDeviceId,
      tuyaDeviceId: mapping.tuyaDeviceId,
      commandCode: mapping.commandCode,
      commandResult: result,
    });

    return NextResponse.json({
      success: true,
      message: payload.isOn ? "הפקודה נשלחה להפעלת הממסר." : "הפקודה נשלחה לכיבוי הממסר.",
      mapping,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send Tuya command.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
