import { getSession } from '@/lib/auth'; // we'll create this helper next
import { lucia } from '@/lib/auth';               // ← ADD THIS LINE
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
  const sessionData = await getSession();

  if (!sessionData?.user) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const errorMessage =
    typeof resolvedSearchParams.error === 'string'
      ? resolvedSearchParams.error
      : null;
 
  // In Dashboard component, after getSession check
  const { rows: servers } = await db.query(
    `SELECT 
       s.id, s.name, s.icon_url, s.owner_id,
       json_agg(json_build_object(
         'id', sm.user_id,
         'username', u.username
       )) AS members
     FROM servers s
     JOIN server_members sm ON s.id = sm.server_id
     JOIN users u ON sm.user_id = u.id
     WHERE sm.user_id = $1
     GROUP BY s.id, s.name, s.icon_url, s.owner_id
     ORDER BY s.created_at DESC`,
    [sessionData.user.id]
  );

  const { user } = sessionData;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
  
      {/* Server creation form – add this if you haven't yet */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Create a Server</h2>
        <form action={createServerAction}>
          <input
            name="name"
            placeholder="Server name (e.g. My Friday Night Raid Group)"
            required
            minLength={3}
            maxLength={50}
            style={{ width: '300px', padding: '0.5rem', marginRight: '1rem' }}
          />
          <button type="submit">Create</button>
        </form>
      {/* Optional: show success message if redirected back */}
      {resolvedSearchParams.serverCreated && (
        <p style={{ color: 'green' }}>Server created successfully!</p>
      )}
      </div>


      {/* Your Servers list */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Your Servers</h2>
        {servers.length === 0 ? (
          <p>No servers yet — create one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {servers.map(server => (
            <li key={server.id} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <strong>{server.name}</strong>
              
	      <form action={leaveServerAction}>
                <input type="hidden" name="serverId" value={server.id} />
                <button type="submit" style={{ color: 'red' }}>Leave</button>
              </form>
	    
	      {/* Delete button (if owner) */}
              {server.owner_id === sessionData.user.id && (
                <form action={deleteServerAction} style={{ display: 'inline', marginLeft: '1rem' }}>
                  <input type="hidden" name="serverId" value={server.id} />
                  <button type="submit" style={{ color: 'darkred' }}>Delete</button>
                </form>
              )}

              {/* Transfer ownership form (only if owner and there are other members) */}
              {server.owner_id === sessionData.user.id && server.members?.length > 1 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>Transfer Ownership</h4>
                  <form action={transferOwnershipAction}>
                    <input type="hidden" name="serverId" value={server.id} />
                    <select name="newOwnerId" required style={{ padding: '0.5rem', width: '200px' }}>
                      <option value="">Choose new owner...</option>
                      {server.members
                        .filter(m => m.id !== sessionData.user.id)
                        .map(m => (
                          <option key={m.id} value={m.id}>
                            {m.username}
                          </option>
                        ))}
                    </select>
                    <button type="submit" style={{ marginLeft: '1rem' }}>Transfer</button>
                  </form>
                </div>
              )}

            </li>
	    ))}
          </ul>
        )}
      </div>
      <div style={{ marginTop: '3rem', borderTop: '1px solid #444', paddingTop: '2rem' }}>

      {/*join an exisiting server*/}
      <h2>Join an Existing Server</h2>
      <form action={joinServerAction}>
        <input
          name="inviteCode"
          placeholder="Enter invite code (e.g. abc123)"
          required
          minLength={4}
          maxLength={20}
          style={{ width: '300px', padding: '0.5rem', marginRight: '1rem' }}
        />
        <button type="submit">Join</button>
      </form>
    
      {/* Show join success or error */}
      {resolvedSearchParams.joinSuccess && (
        <p style={{ color: 'green', marginTop: '1rem' }}>
          Successfully joined server!
        </p>
      )}
      {resolvedSearchParams.error && resolvedSearchParams.error.includes('join') && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          {resolvedSearchParams.error}
        </p>
      )}
    </div>
    </div>
  );
}

// Simple logout action
async function logoutAction() {
  'use server';
  
  const sessionData = await getSession();
  
  if (sessionData?.session) {
    await lucia.invalidateSession(sessionData.session.id);
  }
  
  const cookieStore = await cookies();
  const blankCookie = lucia.createBlankSessionCookie();
  
  cookieStore.set(
	  blankCookie.name, 
	  blankCookie.value, 
	  blankCookie.attributes
  );
  
  redirect('/login');
}

// Simple create server action
async function createServerAction(formData: FormData) {
  'use server';

  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }

  const name = formData.get('name')?.toString().trim();
  if (!name || name.length < 3 || name.length > 50) {
    return { error: 'Server name must be 3–50 characters.' };
  }

  try {
    // Create server
    const { rows: [server] } = await db.query(
      `INSERT INTO servers (name, owner_id)
       VALUES ($1, $2)
       RETURNING id`,
      [name, session.user.id]
    );

    // Auto-join creator as member
    await db.query(
      `INSERT INTO server_members (server_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [server.id, session.user.id]
    );
    
    revalidatePath('/dashboard');

    redirect(`/dashboard`);  // or to a server-specific page later
  } catch (err) {
    console.error('Create server failed:', err);
    return { error: 'Failed to create server. Try again.' };
  }
  
}

// Server action for leaving
async function leaveServerAction(formData: FormData) {
  'use server';

  const session = await getSession();
  if (!session?.user) redirect('/login');

  const serverId = formData.get('serverId')?.toString();
  if (!serverId) return { error: 'Invalid server' };

  try {
     const { rows: [server] } = await db.query(
       `SELECT owner_id FROM servers WHERE id = $1`,
       [serverId]
      );

      if (!server) return { error: 'Server not found' };

      if (server.owner_id === session.user.id) {
      	throw new Error('You cannot leave a server you own. Transfer ownership first or delete it.');
      }

      // Not owner → safe to leave
      await db.query(
      `DELETE FROM server_members
       WHERE server_id = $1 AND user_id = $2`,
      [serverId, session.user.id]
    );

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    const msg = err.message || 'Failed to leave server';
    console.error('Leave failed:', err);
    redirect(`/dashboard?error=${encodeURIComponent(msg)}`);
  }
}

// sever action to delete server (owner only)
async function deleteServerAction(formData: FormData) {
  'use server';

  const session = await getSession();
  if (!session?.user) redirect('/login');

  const serverId = formData.get('serverId')?.toString();
  if (!serverId) return { error: 'Invalid server' };

  // Check ownership first
  const { rows } = await db.query(
    `SELECT owner_id FROM servers WHERE id = $1`,
    [serverId]
  );

  if (rows[0]?.owner_id !== session.user.id) {
    return { error: 'Not owner' };
  }

  try {
    await db.query(`DELETE FROM servers WHERE id = $1`, [serverId]);
    // Cascades to server_members, channels, etc. via ON DELETE CASCADE

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete failed:', err);
    return { error: 'Failed to delete' };
  }
}

// transfer server ownership action
async function transferOwnershipAction(formData: FormData) {
  'use server';

  const session = await getSession();
  if (!session?.user) redirect('/login');

  const serverId = formData.get('serverId')?.toString();
  const newOwnerId = formData.get('newOwnerId')?.toString();

  if (!serverId || !newOwnerId) return { error: 'Missing fields' };

  try {
    // Verify current owner
    const { rows: [server] } = await db.query(
      `SELECT owner_id FROM servers WHERE id = $1`,
      [serverId]
    );

    if (!server || server.owner_id !== session.user.id) {
      return { error: 'Not authorized' };
    }

    // Verify new owner is a member
    const { rowCount } = await db.query(
      `SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`,
      [serverId, newOwnerId]
    );

    if (rowCount === 0) {
      return { error: 'Selected user is not a member' };
    }

    // Transfer
    await db.query(
      `UPDATE servers SET owner_id = $1 WHERE id = $2`,
      [newOwnerId, serverId]
    );

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Transfer failed:', err);
    return { error: 'Failed to transfer ownership' };
  }
}

// join an existing server
async function joinServerAction(formData: FormData) {
  'use server';

  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }

  const inviteCode = formData.get('inviteCode')?.toString()?.trim();
  if (!inviteCode || inviteCode.length < 4) {
    throw new Error('Invalid invite code');
  }

  try {
    // Find the invite
    const { rows: [invite] } = await db.query(
      `SELECT 
         si.id, si.server_id, si.uses, si.max_uses, si.expires_at,
         s.name AS server_name
       FROM server_invites si
       JOIN servers s ON si.server_id = s.id
       WHERE si.code = $1`,
      [inviteCode]
    );

    if (!invite) {
      throw new Error('Invalid or expired invite code');
    }

    // Check expiration
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      throw new Error('This invite has expired');
    }

    // Check usage limit
    if (invite.max_uses !== null && invite.uses >= invite.max_uses) {
      throw new Error('This invite has reached its usage limit');
    }

    // Check if already a member
    const { rowCount: existingMember } = await db.query(
      `SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`,
      [invite.server_id, session.user.id]
    );

    if (existingMember > 0) {
      throw new Error('You are already a member of this server');
    }

    // Join!
    await db.query(
      `INSERT INTO server_members (server_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [invite.server_id, session.user.id]
    );

    // Increment uses
    await db.query(
      `UPDATE server_invites 
       SET uses = uses + 1, updated_at = NOW()
       WHERE id = $1`,
      [invite.id]
    );

    revalidatePath('/dashboard');

    // Success
  } catch (err: any) {
    const msg = err.message || 'Failed to join server. Try again.';
    console.error('Join server failed:', err);
    redirect(`/dashboard?error=${encodeURIComponent(msg)}`);
  }

  redirect(`/dashboard?joinSuccess=true`);
}
