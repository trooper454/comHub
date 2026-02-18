'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFamily } from '@/actions/family'
// import { useQuery } from '@tanstack/react-query' or SWR for fetching user's family later

export default function FamilySettings() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  // Later: const { data: family } = useQuery(...) to check if user has family

  // Placeholder: assume no family yet
  const hasFamily = false // replace with real query

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await createFamily(name)
      // toast success, refresh, redirect or show family UI
      setName('')
    } catch (err) {
      console.error(err)
      // toast error
    } finally {
      setLoading(false)
    }
  }

  if (!hasFamily) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Create Your Family Group</CardTitle>
          <CardDescription>
            Set up parental controls, daily time limits, allowed servers, and default voice muting for your kids.
            Perfect for keeping gaming safe and coordinated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Family Name (e.g., Wolf Raiders)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading ? 'Creating...' : 'Create Family'}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Later: show family members table, restrictions editor, invite button, etc.
  return <div>Family dashboard coming soon...</div>
}
