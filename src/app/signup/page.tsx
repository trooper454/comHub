console.log('Signup page loaded!');

import { redirect } from 'next/navigation';
import { hash } from '@/lib/auth';
import { db } from '@/lib/db';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export default function SignupPage() {
  async function createAccount(formData: FormData) {
    'use server';

    const username = formData.get('username')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!username || !email || !password || password.length < 8) {
      return { error: 'Please fill all fields. Password must be at least 8 characters.' };
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    let userId: string;

    try {
      const result = await db.query(
        `INSERT INTO users (username, email, password_hash, display_name)
         VALUES ($1, $2, $3, $1)
         RETURNING id`,
        [username, email, passwordHash]
      );

      userId = result.rows[0].id;
    } catch (err: any) {
      if (err.code === '23505') { // Postgres unique violation
        return { error: 'Username or email is already taken.' };
      }
      console.error(err);
      return { error: 'Something went wrong. Try again.' };
    }

    // Create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieStore = await cookies()
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    
    console.log('Session cookie set successfully for ID:', session.id);  // debug

    console.log('Cookie set attempted. About to redirect to /dashboard');
    redirect('/dashboard');
    console.error('Redirect was not triggered — action continued');
    return { success: true, message: 'Account created, but redirect failed. Try logging in manually.' };
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Create Account</h1>
      
      <form action={createAccount}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username</label><br />
          <input name="username" required minLength={3} maxLength={32} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label><br />
          <input name="email" type="email" required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label><br />
          <input name="password" type="password" required minLength={8} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>Sign Up</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
