import { Platform } from "react-native";

// Change this in production
export const serverUrl: string = "http://192.168.1.103:5000";

export async function JSONGet(
  url: string,
  options?: RequestInit
): Promise<any> {
  const req = await fetch(`${serverUrl}/api/${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const res = await req.json();
  return res;
}

export async function JSONPost(
  url: string,
  options?: RequestInit
): Promise<any> {
  const req = await fetch(`${serverUrl}/api/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: options?.body,
    ...options,
  });
  const res = await req.json();
  return res;
}

export async function FormPost(
  url: string,
  options?: RequestInit
): Promise<any> {
  const body: any = options?.body;

  // No body presented
  if (!body) {
    return null;
  }

  const data: any = new FormData();
  for (let key in body) {
    // String value (default)
    let val: any = body[key];

    // File value
    if (typeof val != "string") {
      // Terminate if no assets | file presented
      if (!val.assets || val.assets.length < 1) continue;

      // Get file data
      const { fileName, mimeType, uri } = val.assets[0];

      // Terminate if file data is unknown
      if (!fileName || !mimeType || !uri) continue;

      // Set file upload format
      val = {
        name: fileName,
        type: mimeType,
        uri:
          Platform.OS === "android"
            ? // Android is full path
              uri
            : // IOS remove file protocol
              uri.replace("file://", ""),
      };
    }

    data.append(key, val);
  }

  return JSONPost(url, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    body: data,
  });
}
