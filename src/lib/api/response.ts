import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function parseJsonBody(
  request: Request,
): Promise<
  | { data: unknown; ok: true }
  | { ok: false; response: NextResponse<{ error: string }> }
> {
  try {
    return { data: await request.json(), ok: true };
  } catch {
    return {
      ok: false,
      response: jsonError("Некорректный JSON в теле запроса.", 400),
    };
  }
}
