"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Building, Palette } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import axios from 'axios';
import { Loader2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [settings, setSettings] = useState({
    name: "",
    theme: "light",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    fetchOrganization()
  }, [])

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/organization/getName`,{params:{token:token}});

      if (response.status) {
        const data = await response.data
        setSettings({
          name: data.name,
          theme: data.settings?.theme || "light",
        })
      }
    } catch (error) {
      console.error("Failed to fetch organization:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage("")

    try {
      const token = localStorage.getItem("token")
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/organization/updateSettings`, {settings,token})

      if (response.status === 200) {
        setMessage("Settings saved successfully!")
        fetchOrganization()
      } else {
        setMessage("Failed to save settings")
      }
    } catch (error) {
      setMessage("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  const canEditSettings = currentUser?.role === "Admin"

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-500 h-12 w-12"/>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 w-[100%] ${theme === 'dark' ? 'bg-slate-900 text-white' : ''}`}>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Manage your organization settings</p>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Organization Settings */}
          <Card className={theme === 'dark' ? 'bg-slate-800 text-white' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className={`h-5 w-5 text-blue-600`} />
                <span>Organization</span>
              </CardTitle>
              <CardDescription>Basic organization information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  disabled={!canEditSettings}
                />
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                  disabled={!canEditSettings}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {canEditSettings && (
                <Button onClick={saveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* User Preferences */}
          <Card className={theme === 'dark' ? 'bg-slate-800 text-white' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className={`h-5 w-5 text-blue-600`} />
                <span>User Preferences</span>
              </CardTitle>
              <CardDescription>Personal settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All notifications</SelectItem>
                    <SelectItem value="important">Important only</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Task View</Label>
                <Select defaultValue="list">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List view</SelectItem>
                    <SelectItem value="board">Board view</SelectItem>
                    <SelectItem value="calendar">Calendar view</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
