// src/app/api/user/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia } from "@/lib/auth";  // This should work if lucia is exported from lib/auth.ts

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Return minimal user data (add more fields as needed: email, avatarUrl, etc.)
  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name || user.username,  // fallback
      avatarUrl: user.avatarUrl || null, // if your User model has this
      // add any other fields your sidebar uses
    },
  });
}
