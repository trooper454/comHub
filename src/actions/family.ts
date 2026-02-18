'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth' // assuming you have a session helper (Lucia/Clerk)

export async function createFamily(name: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const family = await prisma.families.create({
    data: {
      name,
      owner_id: session.user.id,
    },
  })

  // Auto-add owner as parent
  await prisma.family_members.create({
    data: {
      family_id: family.id,
      user_id: session.user.id,
      role: 'parent',
    },
  })

  revalidatePath('/dashboard')
  return family
}

export async function inviteToFamily(familyId: string, email: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  // TODO: generate magic link or code; for now, just log (replace with email/send invite later)
  console.log(`Invite ${email} to family ${familyId} by ${session.user.id}`)

  // Real version: create invite record or use Clerk magic links
  return { success: true, message: 'Invite sent (placeholder)' }
}

// More actions: approveJoin, setRestrictions, etc. — expand as needed
