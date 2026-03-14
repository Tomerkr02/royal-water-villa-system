"use client";

import { FormEvent, useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type {
  TuyaDeviceRecord,
  TuyaDirectAccessResult,
  TuyaMappingEntry,
  TuyaUserDeviceSummary,
} from "@/types/models";

interface DiscoveryPayload {
  success: boolean;
  devices?: TuyaDeviceRecord[];
  mapping?: TuyaMappingEntry[];
  liveControlEnabled?: boolean;
  message?: string;
}

interface DirectAccessPayload {
  success: boolean;
  deviceId?: string;
  result?: TuyaDirectAccessResult;
  message?: string;
}

interface DirectCommandPayload {
  success: boolean;
  message?: string;
  result?: unknown;
}

interface DevicesByUserPayload {
  success: boolean;
  uid?: string;
  rawResult?: unknown;
  devices?: TuyaUserDeviceSummary[];
  message?: string;
}

export default function TuyaDeveloperPage() {
  const [payload, setPayload] = useState<DiscoveryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualDeviceId, setManualDeviceId] = useState("");
  const [manualCommandCode, setManualCommandCode] = useState("");
  const [directAccessLoading, setDirectAccessLoading] = useState(false);
  const [directAccessResult, setDirectAccessResult] = useState<DirectAccessPayload | null>(null);
  const [directCommandLoading, setDirectCommandLoading] = useState(false);
  const [directCommandResult, setDirectCommandResult] = useState<DirectCommandPayload | null>(null);
  const [userUid, setUserUid] = useState("");
  const [devicesByUserLoading, setDevicesByUserLoading] = useState(false);
  const [devicesByUserResult, setDevicesByUserResult] = useState<DevicesByUserPayload | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch("/api/tuya/discovery", { cache: "no-store" });
        const data = (await response.json()) as DiscoveryPayload;
        setPayload(data);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const handleDirectAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!manualDeviceId.trim()) {
      return;
    }

    setDirectAccessLoading(true);
    setDirectCommandResult(null);

    try {
      const response = await fetch(
        `/api/tuya/device-access?deviceId=${encodeURIComponent(manualDeviceId.trim())}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as DirectAccessPayload;
      setDirectAccessResult(data);
    } finally {
      setDirectAccessLoading(false);
    }
  };

  const handleDirectCommand = async (value: boolean) => {
    if (!manualDeviceId.trim() || !manualCommandCode.trim()) {
      return;
    }

    setDirectCommandLoading(true);

    try {
      const response = await fetch("/api/tuya/device-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: manualDeviceId.trim(),
          commandCode: manualCommandCode.trim(),
          value,
        }),
      });

      const data = (await response.json()) as DirectCommandPayload;
      setDirectCommandResult(data);
    } finally {
      setDirectCommandLoading(false);
    }
  };

  const handleDevicesByUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userUid.trim()) {
      return;
    }

    setDevicesByUserLoading(true);

    try {
      const response = await fetch(
        `/api/tuya/devices-by-user?uid=${encodeURIComponent(userUid.trim())}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as DevicesByUserPayload;
      setDevicesByUserResult(data);
    } finally {
      setDevicesByUserLoading(false);
    }
  };

  return (
    <main className="tablet-shell min-h-screen px-4 py-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Tuya Debug"
          title="בדיקת גילוי, גישה ישירה ומיפוי של התקני Tuya"
          description="מסך פיתוח זמני לקריאה בטוחה של התקנים, סטטוסים ופונקציות, וגם לבדיקת גישה ישירה לפי Virtual ID / Device ID של הווילה."
        />

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="glass-panel rounded-[2rem] p-5 text-right">
            <h2 className="font-display text-3xl text-foreground">מצב סביבה</h2>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <p>סטטוס קריאה: {loading ? "טוען..." : payload?.success ? "הצלחה" : "שגיאה"}</p>
              <p>שליטה חיה מופעלת: {payload?.liveControlEnabled ? "כן" : "לא"}</p>
              {payload?.message ? <p>הודעה: {payload.message}</p> : null}
            </div>

            <h3 className="mt-8 text-lg font-semibold text-foreground">מיפוי מקומי ל-Tuya</h3>
            <div className="mt-3 space-y-3">
              {payload?.mapping?.map((entry) => (
                <article key={entry.localDeviceId} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-foreground">{entry.localDeviceId}</p>
                  <p className="mt-1 text-xs text-white/60">Device ID: {entry.tuyaDeviceId || "לא הוגדר"}</p>
                  <p className="mt-1 text-xs text-white/60">Command code: {entry.commandCode}</p>
                  {entry.channelLabel ? (
                    <p className="mt-1 text-xs text-white/60">Channel: {entry.channelLabel}</p>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-gold/12 bg-black/20 p-4">
              <h3 className="text-lg font-semibold text-foreground">בדיקת גישה ישירה לפי Device ID</h3>
              <form className="mt-4 space-y-3" onSubmit={handleDirectAccess}>
                <input
                  value={manualDeviceId}
                  onChange={(event) => setManualDeviceId(event.target.value)}
                  placeholder="הכנס Virtual ID / Device ID"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <input
                  value={manualCommandCode}
                  onChange={(event) => setManualCommandCode(event.target.value)}
                  placeholder="command code לבדיקה, למשל switch_1"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-2xl border border-gold/20 bg-amber-200/10 px-4 py-3 text-sm font-semibold text-foreground"
                    disabled={directAccessLoading}
                  >
                    {directAccessLoading ? "בודק..." : "בדיקת גישה"}
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-50"
                    onClick={() => void handleDirectCommand(true)}
                    disabled={directCommandLoading || !manualDeviceId.trim() || !manualCommandCode.trim()}
                  >
                    {directCommandLoading ? "שולח..." : "שלח ON"}
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-50"
                    onClick={() => void handleDirectCommand(false)}
                    disabled={directCommandLoading || !manualDeviceId.trim() || !manualCommandCode.trim()}
                  >
                    {directCommandLoading ? "שולח..." : "שלח OFF"}
                  </button>
                </div>
              </form>

              {directAccessResult ? (
                <div className="mt-5 rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {directAccessResult.success ? "התקן נגיש ישירות" : "התקן לא נגיש ישירות"}
                  </p>
                  {directAccessResult.message ? (
                    <p className="mt-2 text-sm text-white/65">{directAccessResult.message}</p>
                  ) : null}

                  {directAccessResult.result ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs tracking-[0.2em] text-gold-soft/80">Details</p>
                        <pre className="mt-2 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                          {JSON.stringify(directAccessResult.result.details, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.2em] text-gold-soft/80">Status</p>
                        <pre className="mt-2 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                          {JSON.stringify(directAccessResult.result.status, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.2em] text-gold-soft/80">Functions</p>
                        <pre className="mt-2 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                          {JSON.stringify(directAccessResult.result.functions, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {directCommandResult ? (
                <div className="mt-4 rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {directCommandResult.success ? "פקודת הדיאגנוסטיקה נשלחה" : "פקודת הדיאגנוסטיקה נכשלה"}
                  </p>
                  {directCommandResult.message ? (
                    <p className="mt-2 text-sm text-white/65">{directCommandResult.message}</p>
                  ) : null}
                  {directCommandResult.result ? (
                    <pre className="mt-3 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                      {JSON.stringify(directCommandResult.result, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-sky-300/12 bg-black/20 p-4">
              <h3 className="text-lg font-semibold text-foreground">בדיקת התקנים לפי UID</h3>
              <form className="mt-4 space-y-3" onSubmit={handleDevicesByUser}>
                <input
                  value={userUid}
                  onChange={(event) => setUserUid(event.target.value)}
                  placeholder="הכנס Tuya UID"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="rounded-2xl border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm font-semibold text-foreground"
                  disabled={devicesByUserLoading}
                >
                  {devicesByUserLoading ? "טוען..." : "שלוף התקנים לפי UID"}
                </button>
              </form>

              {devicesByUserResult ? (
                <div className="mt-5 rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {devicesByUserResult.success ? "התקנים נטענו לפי UID" : "שליפת התקנים לפי UID נכשלה"}
                  </p>
                  {devicesByUserResult.message ? (
                    <p className="mt-2 text-sm text-white/65">{devicesByUserResult.message}</p>
                  ) : null}

                  {devicesByUserResult.devices ? (
                    <div className="mt-4 space-y-3">
                      {devicesByUserResult.devices.map((device) => (
                        <article key={device.id} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                          <p className="text-sm font-semibold text-foreground">{device.name}</p>
                          <p className="mt-1 text-xs text-white/60">ID: {device.id}</p>
                          <p className="mt-1 text-xs text-white/60">
                            Product: {device.product_name ?? "לא ידוע"}
                          </p>
                          <p className="mt-1 text-xs text-white/60">
                            Category: {device.category ?? "לא ידוע"}
                          </p>
                          <p className="mt-1 text-xs text-white/60">
                            Online: {typeof device.online === "boolean" ? (device.online ? "כן" : "לא") : "לא ידוע"}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : null}

                  {devicesByUserResult.rawResult ? (
                    <div className="mt-4">
                      <p className="text-xs tracking-[0.2em] text-gold-soft/80">Raw Result</p>
                      <pre className="mt-2 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                        {JSON.stringify(devicesByUserResult.rawResult, null, 2)}
                      </pre>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          <section className="glass-panel rounded-[2rem] p-5 text-right">
            <h2 className="font-display text-3xl text-foreground">התקנים שהתגלו</h2>
            <div className="mt-5 grid gap-4">
              {payload?.devices?.map((device) => (
                <article key={device.id} className="rounded-[1.6rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-lg font-semibold text-foreground">{device.name}</p>
                  <p className="mt-1 text-xs text-white/60">ID: {device.id}</p>
                  <p className="mt-1 text-xs text-white/60">Category: {device.category ?? "לא ידוע"}</p>
                  <div className="mt-4">
                    <p className="text-xs tracking-[0.2em] text-gold-soft/80">Status</p>
                    <pre className="mt-2 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                      {JSON.stringify(device.status, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs tracking-[0.2em] text-gold-soft/80">Functions</p>
                    <pre className="mt-2 overflow-auto rounded-xl bg-black/20 p-3 text-xs text-white/75">
                      {JSON.stringify(device.functions, null, 2)}
                    </pre>
                  </div>
                </article>
              ))}
              {!loading && payload?.devices?.length === 0 ? (
                <p className="text-sm text-white/60">לא נמצאו התקנים ב-discovery הנוכחי.</p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
