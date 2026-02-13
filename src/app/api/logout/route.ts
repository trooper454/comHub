// src/app/api/logout/route.ts
import { lucia } from "@/lib/auth"; // your lucia instance
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }
  const blankCookie = lucia.createBlankSessionCookie();
  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);
  redirect("/login");
}
