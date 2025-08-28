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
