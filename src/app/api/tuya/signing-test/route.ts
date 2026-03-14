import { NextResponse } from "next/server";
import { previewTuyaTokenSigning, runTuyaTokenSelfTest } from "@/lib/server/tuya-client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const execute = url.searchParams.get("execute") === "true";

  try {
    if (execute) {
      const payload = await runTuyaTokenSelfTest();
      return NextResponse.json({
        success: true,
        mode: "execute",
        ...payload,
      });
    }

    const preview = await previewTuyaTokenSigning();
    return NextResponse.json({
      success: true,
      mode: "preview",
      preview,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tuya signing self-test failed.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
