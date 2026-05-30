import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = [
  "/dashboard",
  "/goals",
  "/challenges",
  "/habits",
  "/progress",
  "/skills",
  "/health",
  "/finance",
  "/achievements",
  "/ai-assistant",
  "/profile",
  "/settings",
  "/billing",
  "/plan",
  "/onboarding",
  "/tasks",
  "/calendar",
  "/projects",
  "/actions",
  "/ai-coach",
];

const appRoutes = protectedRoutes.filter((route) => route !== "/onboarding");
const legacyRedirects: Record<string, string> = {
  "/actions": "/dashboard",
  "/ai-coach": "/ai-assistant",
  "/calendar": "/dashboard",
  "/projects": "/dashboard",
  "/tasks": "/dashboard",
};

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const legacyTarget = legacyRedirects[pathname];

    if (legacyTarget) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = legacyTarget;
      return NextResponse.redirect(redirectUrl);
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle();

    const onboardingCompleted = Boolean(profile?.onboarding_completed);
    const isAppRoute = appRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isAppRoute && !onboardingCompleted) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/onboarding";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname === "/onboarding" && onboardingCompleted) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if ((pathname === "/login" || pathname === "/register") && user) {
    const redirectUrl = request.nextUrl.clone();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle();
    redirectUrl.pathname = profile?.onboarding_completed ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|api).*)"],
};
