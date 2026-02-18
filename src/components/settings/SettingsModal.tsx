'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFamily } from '@/actions/family'
import { Settings, User, Users, Bell } from 'lucide-react'

export function SettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'family' | 'notifications'>('family') // default to family for you
  const [familyName, setFamilyName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreateFamily = async () => {
    if (!familyName.trim()) return
    setCreating(true)
    try {
      await createFamily(familyName)
      setFamilyName('')
      // You can add a toast here later
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0 overflow-hidden border-none bg-[#36393f] text-white">
        <div className="flex h-full">
          {/* LEFT SIDEBAR TABS - Discord style */}
          <div className="w-60 bg-[#2f3136] p-4 flex flex-col">
            <div className="flex items-center gap-2 px-2 py-3 text-sm font-semibold text-[#b9bbbe]">
              USER SETTINGS
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1">
              <TabsList className="flex flex-col items-start w-full bg-transparent gap-0.5">
                <TabsTrigger value="profile" className="w-full justify-start px-2 py-2 data-[state=active]:bg-[#40444b]">
                  <User className="mr-3 h-4 w-4" /> My Account
                </TabsTrigger>
                <TabsTrigger value="family" className="w-full justify-start px-2 py-2 data-[state=active]:bg-[#40444b]">
                  <Users className="mr-3 h-4 w-4" /> Family Controls
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start px-2 py-2 data-[state=active]:bg-[#40444b]" disabled>
                  <Bell className="mr-3 h-4 w-4" /> Notifications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 overflow-auto bg-[#36393f] p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-bold tracking-tight">User Settings</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} className="w-full">
              {/* PROFILE TAB */}
              <TabsContent value="profile">
                <div className="max-w-md space-y-6">
                  <h3 className="text-xl font-semibold">My Account</h3>
                  <p className="text-[#b9bbbe]">Avatar, username, status — coming in the next sprint.</p>
                </div>
              </TabsContent>

              {/* FAMILY TAB - Your priority */}
              <TabsContent value="family" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Family Group</h3>
                  <p className="text-[#b9bbbe] mb-6">
                    Manage parental controls, daily voice/gaming limits, and allowed servers for your kids.
                  </p>

                  {/* Create Family Card */}
                  <Card className="bg-[#2f3136] border-[#202225]">
                    <CardHeader>
                      <CardTitle>Create New Family</CardTitle>
                      <CardDescription>One family per parent account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Family Name (e.g. Wolf Pack)"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="bg-[#40444b] border-[#202225]"
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleCreateFamily} 
                        disabled={creating || !familyName.trim()}
                        className="bg-[#5865f2] hover:bg-[#4752c4]"
                      >
                        {creating ? 'Creating...' : 'Create Family'}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Future: Family list + restrictions will go here once we query your families */}
                </div>
              </TabsContent>

              {/* NOTIFICATIONS TAB */}
              <TabsContent value="notifications">
                <p className="text-[#b9bbbe]">Coming soon — push notifications, mention settings, etc.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
