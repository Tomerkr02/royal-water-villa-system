import { NextResponse } from "next/server";
import { sendTuyaCommands } from "@/lib/server/tuya-client";

interface ControlRoutePayload {
  deviceId?: string;
  commands?: Array<{
    code?: string;
    value?: boolean | number | string;
  }>;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ControlRoutePayload;

    if (!payload.deviceId || !Array.isArray(payload.commands) || payload.commands.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "deviceId and a non-empty commands array are required.",
        },
        { status: 400 },
      );
    }

    const normalizedCommands: Array<{ code: string; value: boolean | number | string }> = [];

    for (const command of payload.commands) {
      const normalizedCode = command.code?.trim() ?? "";

      if (!normalizedCode || typeof command.value === "undefined") {
        return NextResponse.json(
          {
            success: false,
            message: "Every command must include a valid code and value.",
          },
          { status: 400 },
        );
      }

      normalizedCommands.push({
        code: normalizedCode,
        value: command.value,
      });
    }

    console.log("[Tuya control route] request received", {
      requestUrl: "/api/tuya/control",
      deviceId: payload.deviceId,
      commands: normalizedCommands,
    });

    const result = await sendTuyaCommands(payload.deviceId, normalizedCommands);

    console.log("[Tuya control route] response sent", {
      deviceId: payload.deviceId,
      apiResponse: result,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send Tuya control command.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
