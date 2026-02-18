// src/app/settings/layout.tsx (optional wrapper)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* Add more tabs later */}
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
