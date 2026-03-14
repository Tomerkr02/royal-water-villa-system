import { NextResponse } from "next/server";
import { getTuyaDeviceDirectAccess, sendTuyaCommand } from "@/lib/server/tuya-client";

interface DiagnosticCommandPayload {
  deviceId?: string;
  commandCode?: string;
  value?: boolean;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("deviceId");

  if (!deviceId) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required query parameter: deviceId",
      },
      { status: 400 },
    );
  }

  try {
    const result = await getTuyaDeviceDirectAccess(deviceId);

    return NextResponse.json({
      success: true,
      deviceId,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to access Tuya device directly.";

    return NextResponse.json(
      {
        success: false,
        deviceId,
        message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DiagnosticCommandPayload;

    if (!payload.deviceId || !payload.commandCode || typeof payload.value !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "deviceId, commandCode, and boolean value are required.",
        },
        { status: 400 },
      );
    }

    console.log("[Tuya device-access route] request received", {
      finalTuyaDeviceId: payload.deviceId,
      finalCommandCode: payload.commandCode,
      requestUrl: "/api/tuya/device-access",
      requestBody: payload,
    });

    const result = await sendTuyaCommand(payload.deviceId, payload.commandCode, payload.value);

    console.log("[Tuya device-access route] response sent", {
      finalTuyaDeviceId: payload.deviceId,
      finalCommandCode: payload.commandCode,
      apiResponse: result,
    });

    return NextResponse.json({
      success: true,
      message: payload.value ? "פקודת ON נשלחה להתקן." : "פקודת OFF נשלחה להתקן.",
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send direct Tuya diagnostic command.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
