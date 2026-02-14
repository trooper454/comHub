// src/app/api/servers/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ servers: [] }, { status: 401 });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    return NextResponse.json({ servers: [] }, { status: 401 });
  }

  const result = await db.query(
    `
    SELECT s.id, s.name, s.icon_url, s.owner_id
    FROM servers s
    INNER JOIN server_members sm ON s.id = sm.server_id
    WHERE sm.user_id = $1
    ORDER BY s.name ASC
    `,
    [user.id]
  );

  return NextResponse.json({
    servers: result.rows.map(row => ({
      id: row.id,
      name: row.name,
      iconUrl: row.icon_url,
      isOwner: row.owner_id === user.id,
    })),
  });
}
