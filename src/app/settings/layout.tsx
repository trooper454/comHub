// src/app/settings/layout.tsx (enhanced version)
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname } from 'next/navigation'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeTab = pathname.includes('/family') ? 'family' : 'profile' // fallback to profile

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs value={activeTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" asChild>
            <Link href="/settings">Profile</Link>
          </TabsTrigger>
          <TabsTrigger value="family" asChild>
            <Link href="/settings/family">Family</Link>
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>Notifications (coming soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {/* Profile content here or redirect to /settings/profile if you add it */}
          <p>Profile settings placeholder – avatar, username, status, etc.</p>
        </TabsContent>

        <TabsContent value="family">
          {children} {/* This renders /settings/family/page.tsx */}
        </TabsContent>

        <TabsContent value="notifications">
          <p>Notifications settings coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
