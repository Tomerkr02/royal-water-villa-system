import "server-only";

import crypto from "node:crypto";
import { getTuyaEnv } from "@/lib/server/tuya-env";
import type {
  TuyaDirectAccessResult,
  TuyaDeviceRecord,
  TuyaFunctionDefinition,
  TuyaStatusProperty,
  TuyaUserDeviceSummary,
} from "@/types/models";

interface TokenResponse {
  access_token: string;
  expire_time: number;
}

interface TuyaApiResponse<T> {
  success: boolean;
  result: T;
  msg?: string;
  code?: number | string;
  t?: number;
}

type HttpMethod = "GET" | "POST";

interface TuyaCommandRequestBody {
  commands: Array<{
    code: string;
    value: boolean;
  }>;
}

interface SignedRequestContext {
  isTokenRequest: boolean;
  method: HttpMethod;
  rawPath: string;
  path: string;
  sortedQuery: string;
  signedUrl: string;
  timestamp: string;
  nonce: string;
  bodySha256: string;
  stringToSign: string;
  signInput: string;
  sign: string;
  headersToSign: Record<string, string>;
}

const EMPTY_BODY_SHA256 =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const PENDING_COMMAND_TTL_MS = 8_000;

let cachedToken: { value: string; expiresAt: number } | null = null;
const pendingCommandState = new Map<
  string,
  {
    value: boolean;
    timestamp: number;
  }
>();

function createContentHash(body = "") {
  if (!body) {
    return EMPTY_BODY_SHA256;
  }

  return crypto.createHash("sha256").update(body).digest("hex");
}

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload, "utf8").digest("hex").toUpperCase();
}

function normalizeSignedUrl(rawPath: string) {
  const [path, rawQuery = ""] = rawPath.split("?");
  const sortedEntries = [...new URLSearchParams(rawQuery).entries()].sort(([keyA, valueA], [keyB, valueB]) => {
    if (keyA === keyB) {
      return valueA.localeCompare(valueB);
    }

    return keyA.localeCompare(keyB);
  });
  const sortedQuery = new URLSearchParams(sortedEntries).toString();

  return {
    path,
    sortedQuery,
    signedUrl: sortedQuery ? `${path}?${sortedQuery}` : path,
  };
}

function buildHeadersString(headersToSign: Record<string, string>) {
  const entries = Object.entries(headersToSign).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return entries.map(([key, value]) => `${key}:${value}`).join("\n");
}

function logSigningDebug(context: SignedRequestContext) {
  console.log("[Tuya signing debug]", {
    requestType: context.isTokenRequest ? "token" : "service",
    method: context.method,
    path: context.path,
    sortedQuery: context.sortedQuery,
    bodySha256: context.bodySha256,
    stringToSign: context.stringToSign,
    signInput: context.signInput,
    sign: context.sign,
  });
}

function buildTuyaCommandRequestBody(commandCode: string, value: boolean): TuyaCommandRequestBody {
  return {
    commands: [
      {
        code: commandCode,
        value,
      },
    ],
  };
}

function createPendingCommandKey(deviceId: string, commandCode: string) {
  return `${deviceId}:${commandCode}`;
}

function recordPendingCommandState(deviceId: string, commandCode: string, value: boolean) {
  pendingCommandState.set(createPendingCommandKey(deviceId, commandCode), {
    value,
    timestamp: Date.now(),
  });
}

export function getPendingCommandState(deviceId: string, commandCode: string) {
  const key = createPendingCommandKey(deviceId, commandCode);
  const pendingState = pendingCommandState.get(key);

  if (!pendingState) {
    return null;
  }

  if (pendingState.timestamp + PENDING_COMMAND_TTL_MS < Date.now()) {
    pendingCommandState.delete(key);
    return null;
  }

  return pendingState;
}

export function clearPendingCommandState(deviceId: string, commandCode: string) {
  pendingCommandState.delete(createPendingCommandKey(deviceId, commandCode));
}

export function buildTuyaSignedRequest(options: {
  method: HttpMethod;
  path: string;
  body?: string;
  accessToken?: string;
  headersToSign?: Record<string, string>;
}): SignedRequestContext {
  const env = getTuyaEnv();
  const nonce = crypto.randomUUID();
  const timestamp = Date.now().toString();
  const { path, sortedQuery, signedUrl } = normalizeSignedUrl(options.path);
  const headersToSign = options.headersToSign ?? {};
  const headersString = buildHeadersString(headersToSign);
  const bodySha256 = createContentHash(options.body ?? "");
  const stringToSign = [options.method, bodySha256, headersString, signedUrl].join("\n");
  const isTokenRequest = !options.accessToken;
  const signInput = isTokenRequest
    ? `${env.accessId}${timestamp}${nonce}${stringToSign}`
    : `${env.accessId}${options.accessToken}${timestamp}${nonce}${stringToSign}`;

  const context: SignedRequestContext = {
    isTokenRequest,
    method: options.method,
    rawPath: options.path,
    path,
    sortedQuery,
    signedUrl,
    timestamp,
    nonce,
    bodySha256,
    stringToSign,
    signInput,
    sign: sign(signInput, env.accessSecret),
    headersToSign,
  };

  logSigningDebug(context);

  return context;
}

async function requestTuya<T>(
  rawPath: string,
  method: HttpMethod,
  accessToken?: string,
  body?: unknown,
  prebuiltSignedRequest?: SignedRequestContext,
): Promise<TuyaApiResponse<T>> {
  const env = getTuyaEnv();
  const bodyString = body ? JSON.stringify(body) : "";
  const signedRequest =
    prebuiltSignedRequest ??
    buildTuyaSignedRequest({
      method,
      path: rawPath,
      body: bodyString,
      accessToken,
    });

  const headers: HeadersInit = {
    client_id: env.accessId,
    sign: signedRequest.sign,
    t: signedRequest.timestamp,
    nonce: signedRequest.nonce,
    sign_method: "HMAC-SHA256",
  };

  const signedHeaderNames = Object.keys(signedRequest.headersToSign).sort();
  if (signedHeaderNames.length > 0) {
    headers["Signature-Headers"] = signedHeaderNames.join(":");
  }

  if (accessToken) {
    headers.access_token = accessToken;
  }

  if (bodyString) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${env.baseUrl}${signedRequest.signedUrl}`, {
    method,
    headers,
    body: bodyString || undefined,
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Tuya request failed: ${response.status} ${response.statusText} - ${responseText}`);
  }

  return JSON.parse(responseText) as TuyaApiResponse<T>;
}

export async function previewTuyaTokenSigning() {
  return buildTuyaSignedRequest({
    method: "GET",
    path: "/v1.0/token?grant_type=1",
  });
}

export async function runTuyaTokenSelfTest() {
  const preview = await previewTuyaTokenSigning();
  const response = await requestTuya<TokenResponse>(
    "/v1.0/token?grant_type=1",
    "GET",
    undefined,
    undefined,
    preview,
  );

  return {
    preview,
    response,
  };
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const tokenResponse = await requestTuya<TokenResponse>("/v1.0/token?grant_type=1", "GET");

  if (!tokenResponse.success) {
    throw new Error(tokenResponse.msg ?? "Failed to obtain Tuya access token.");
  }

  cachedToken = {
    value: tokenResponse.result.access_token,
    expiresAt: Date.now() + tokenResponse.result.expire_time * 1000,
  };

  return cachedToken.value;
}

function normalizeStatus(status: unknown): TuyaStatusProperty[] {
  if (!Array.isArray(status)) {
    return [];
  }

  return status
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const statusEntry = entry as { code?: string; value?: boolean | number | string };
      if (!statusEntry.code) {
        return null;
      }

      return {
        code: statusEntry.code,
        value: statusEntry.value ?? "",
      };
    })
    .filter((entry): entry is TuyaStatusProperty => Boolean(entry));
}

function normalizeFunctions(functions: unknown): TuyaFunctionDefinition[] {
  if (!Array.isArray(functions)) {
    return [];
  }

  const mapped = functions.map((entry): TuyaFunctionDefinition | null => {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const fn = entry as TuyaFunctionDefinition;
    if (!fn.code) {
      return null;
    }

    return {
      code: fn.code,
      desc: fn.desc,
      name: fn.name,
      type: fn.type,
      values: fn.values,
    };
  });

  return mapped.filter((entry): entry is TuyaFunctionDefinition => entry !== null);
}

function normalizeDiscoveryList(result: unknown): Array<{ id: string; name?: string; category?: string }> {
  if (Array.isArray(result)) {
    return result as Array<{ id: string; name?: string; category?: string }>;
  }

  if (result && typeof result === "object") {
    const objectResult = result as {
      list?: Array<{ id: string; name?: string; category?: string }>;
      devices?: Array<{ id: string; name?: string; category?: string }>;
    };

    if (Array.isArray(objectResult.list)) {
      return objectResult.list;
    }

    if (Array.isArray(objectResult.devices)) {
      return objectResult.devices;
    }
  }

  return [];
}

export async function discoverTuyaDevices(): Promise<TuyaDeviceRecord[]> {
  const token = await getAccessToken();
  const env = getTuyaEnv();

  let discovered: Array<{ id: string; name?: string; category?: string }> = [];

  if (env.discoveryStrategy === "device_ids") {
    discovered = env.discoveryDeviceIds.map((id) => ({ id }));
  } else {
    const response = await requestTuya<unknown>(
      `/v1.0/iot-03/devices?page_size=${env.discoveryPageSize}&page_no=1`,
      "GET",
      token,
    );

    if (!response.success) {
      throw new Error(response.msg ?? "Failed to discover Tuya devices.");
    }

    discovered = normalizeDiscoveryList(response.result);
  }

  const detailPromises = discovered.map(async (device) => {
    const [detailResponse, functionsResponse] = await Promise.all([
      requestTuya<Record<string, unknown>>(`/v1.0/devices/${device.id}`, "GET", token),
      requestTuya<unknown>(`/v1.0/devices/${device.id}/functions`, "GET", token),
    ]);

    if (!detailResponse.success) {
      throw new Error(detailResponse.msg ?? `Failed to fetch Tuya device ${device.id}`);
    }

    const detail = detailResponse.result;

    return {
      id: String(detail.id ?? device.id),
      name: String(detail.name ?? device.name ?? "Unnamed device"),
      category: typeof detail.category === "string" ? detail.category : device.category,
      status: normalizeStatus(detail.status),
      functions: functionsResponse.success ? normalizeFunctions(functionsResponse.result) : [],
    } satisfies TuyaDeviceRecord;
  });

  return Promise.all(detailPromises);
}

export async function getTuyaDeviceDirectAccess(deviceId: string): Promise<TuyaDirectAccessResult> {
  const token = await getAccessToken();

  const [detailResponse, functionsResponse] = await Promise.all([
    requestTuya<Record<string, unknown>>(`/v1.0/devices/${deviceId}`, "GET", token),
    requestTuya<unknown>(`/v1.0/devices/${deviceId}/functions`, "GET", token),
  ]);

  if (!detailResponse.success) {
    throw new Error(
      detailResponse.msg ??
        `Tuya reported that device '${deviceId}' is not accessible to the current project/account.`,
    );
  }

  return {
    details: detailResponse.result,
    status: normalizeStatus(detailResponse.result.status),
    functions: functionsResponse.success ? normalizeFunctions(functionsResponse.result) : [],
  };
}

export async function sendTuyaCommand(deviceId: string, commandCode: string, value: boolean) {
  const token = await getAccessToken();
  const commandBody = buildTuyaCommandRequestBody(commandCode, value);

  console.log("[Tuya command dispatch]", {
    deviceId,
    endpoint: `/v1.0/devices/${deviceId}/commands`,
    body: commandBody,
    valueType: typeof value,
  });

  const response = await requestTuya<{ success: boolean }>(
    `/v1.0/devices/${deviceId}/commands`,
    "POST",
    token,
    commandBody,
  );

  if (!response.success) {
    throw new Error(response.msg ?? `Failed to send Tuya command to ${deviceId}`);
  }

  recordPendingCommandState(deviceId, commandCode, value);

  return response.result;
}

export async function getTuyaDevicesByUser(uid: string) {
  const token = await getAccessToken();
  const response = await requestTuya<unknown>(`/v1.0/users/${uid}/devices`, "GET", token);

  if (!response.success) {
    throw new Error(response.msg ?? `Failed to fetch Tuya devices for UID '${uid}'.`);
  }

  const rawResult = response.result;
  const list = Array.isArray(rawResult)
    ? rawResult
    : rawResult && typeof rawResult === "object" && Array.isArray((rawResult as { devices?: unknown[] }).devices)
      ? (rawResult as { devices: unknown[] }).devices
      : [];

  const mapped = list.map((entry): TuyaUserDeviceSummary | null => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const device = entry as Record<string, unknown>;

      return {
        id: String(device.id ?? ""),
        name: String(device.name ?? ""),
        product_name:
          typeof device.product_name === "string" ? device.product_name : undefined,
        category: typeof device.category === "string" ? device.category : undefined,
        online: typeof device.online === "boolean" ? device.online : undefined,
      } satisfies TuyaUserDeviceSummary;
    });

  const simplified: TuyaUserDeviceSummary[] = mapped.filter(
    (entry): entry is TuyaUserDeviceSummary => Boolean(entry?.id),
  );

  return {
    rawResult,
    simplified,
  };
}
