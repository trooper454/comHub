import { redirect } from 'next/navigation';
import { verify } from '@/lib/auth';
import { db } from '@/lib/db';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    'use server';

    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return { error: 'Email and password required.' };
    }

    const result = await db.query(
      `SELECT id, password_hash FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const valid = await verify(user.password_hash, password);

    if (!valid) {
      return { error: 'Invalid email or password.' };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    redirect('/dashboard');
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Log In</h1>
      
      <form action={loginAction}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label><br />
          <input name="email" type="email" required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label><br />
          <input name="password" type="password" required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>Log In</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        No account yet? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
