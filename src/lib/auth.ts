import { Lucia } from 'lucia';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import { hash, verify } from '@node-rs/argon2';  // ← this is the correct import
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

const adapter = new NodePostgresAdapter(pool, {
  user: 'users',
  session: 'user_sessions',
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'gaming_hub_session',
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  },
  getUserAttributes: (attributes) => ({
    id: attributes.id,
    username: attributes.username,
    email: attributes.email,
    display_name: attributes.display_name || attributes.username,
  }),
});

// Export hash/verify for use in signup/login
export { hash, verify };

// Add this at the end of src/lib/auth.ts
export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return null;
  }

  const result = await lucia.validateSession(sessionId);

  // Renew cookie if session is valid
  if (result.session && result.session.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  if (!result.session) {
    const blankCookie = lucia.createBlankSessionCookie();
    cookieStore.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
  }

  return result;
}
