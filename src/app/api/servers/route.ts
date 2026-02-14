// src/app/api/servers/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
  const name = formData.get("name")?.toString().trim();

  if (!name || name.length < 3 || name.length > 100) {
    return NextResponse.json({ error: "Server name must be 3-100 characters" }, { status: 400 });
  }

  try {
    const serverResult = await db.query(
      `
      INSERT INTO servers (id, name, owner_id, created_at)
      VALUES (uuid_generate_v4(), $1, $2, NOW())
      RETURNING id, name
      `,
      [name, user.id]
    );

    const server = serverResult.rows[0];

    // Add owner as member
    await db.query(
      `
      INSERT INTO server_members (server_id, user_id, joined_at)
      VALUES ($1, $2, NOW())
      `,
      [server.id, user.id]
    );

    revalidatePath('/dashboard');  // Refresh dashboard if needed

    return NextResponse.json({ success: true, server });
  } catch (err: any) {
    console.error("Create server error:", err);
    return NextResponse.json({ error: "Failed to create server" }, { status: 500 });
  }
}
