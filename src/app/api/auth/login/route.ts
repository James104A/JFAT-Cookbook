import { NextRequest, NextResponse } from "next/server";
import { createToken, AUTH_COOKIE, AUTH_STATUS_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const { token, expires } = createToken(password);

  const response = NextResponse.json({ success: true });

  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });

  response.cookies.set(AUTH_STATUS_COOKIE, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });

  return response;
}
