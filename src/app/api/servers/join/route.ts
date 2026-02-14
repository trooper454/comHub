// src/app/api/servers/join/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = await lucia.validateSession(sessionId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const code = formData.get("code")?.toString().trim();

  if (!code) {
    return NextResponse.json({ error: "Invite code required" }, { status: 400 });
  }

  try {
    // Find valid invite
    const inviteResult = await db.query(
      `
      SELECT id, server_id, uses, max_uses, expires_at
      FROM server_invites
      WHERE code = $1
      AND (expires_at IS NULL OR expires_at > NOW())
      `,
      [code]
    );

    const invite = inviteResult.rows[0];
    if (!invite) {
      return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
    }

    if (invite.max_uses !== null && invite.uses >= invite.max_uses) {
      return NextResponse.json({ error: "Invite has reached max uses" }, { status: 403 });
    }

    // Check if already member
    const memberCheck = await db.query(
      `SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`,
      [invite.server_id, user.id]
    );

    if (memberCheck.rows.length > 0) {
      return NextResponse.json({ error: "Already a member" }, { status: 409 });
    }

    // Join
    await db.query(
      `
      INSERT INTO server_members (server_id, user_id, joined_at)
      VALUES ($1, $2, NOW())
      `,
      [invite.server_id, user.id]
    );

    // Increment uses
    await db.query(
      `
      UPDATE server_invites
      SET uses = uses + 1, updated_at = NOW()
      WHERE id = $1
      `,
      [invite.id]
    );

    revalidatePath('/dashboard');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Join server error:", err);
    return NextResponse.json({ error: "Failed to join server" }, { status: 500 });
  }
}
