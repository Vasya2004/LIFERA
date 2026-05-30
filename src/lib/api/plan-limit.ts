import { NextResponse } from "next/server";

export const PLAN_LIMIT_CODE = "PLAN_LIMIT" as const;
export const PLAN_UPGRADE_HREF = "/plan" as const;

export type PlanLimitPayload = {
  code: typeof PLAN_LIMIT_CODE;
  error: string;
  upgradeHref: typeof PLAN_UPGRADE_HREF;
};

export function jsonPlanLimitError(message: string) {
  return NextResponse.json(
    {
      code: PLAN_LIMIT_CODE,
      error: message,
      upgradeHref: PLAN_UPGRADE_HREF,
    } satisfies PlanLimitPayload,
    { status: 403 },
  );
}

export function isPlanLimitPayload(
  payload: unknown,
): payload is PlanLimitPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "code" in payload &&
    payload.code === PLAN_LIMIT_CODE
  );
}
