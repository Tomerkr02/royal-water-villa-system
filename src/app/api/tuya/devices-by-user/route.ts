import { NextResponse } from "next/server";
import { getTuyaDevicesByUser } from "@/lib/server/tuya-client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required query parameter: uid",
      },
      { status: 400 },
    );
  }

  try {
    const result = await getTuyaDevicesByUser(uid);

    return NextResponse.json({
      success: true,
      uid,
      rawResult: result.rawResult,
      devices: result.simplified,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Tuya devices by UID.";

    return NextResponse.json(
      {
        success: false,
        uid,
        message,
      },
      { status: 500 },
    );
  }
}
