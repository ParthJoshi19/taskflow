import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Mail, UserX, Copy, Check,Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import axios from "axios"

interface User {
  _id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Member"
  createdAt: string
}

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [inviteCode, setInviteCode] = useState("")
  const [copied, setCopied] = useState(false)

  const [inviteData, setInviteData] = useState({
    email: "",
    role: "Member",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    fetchUsers()
    fetchInviteCode()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getInfo`, {params:{token:token}});

      if (response.status) {
        const data = await response.data
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInviteCode = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/invite-code`,{params:{token:token}})

      if (response.status) {
        const data = await response.data
        setInviteCode(data.inviteCode)
      }
    } catch (error) {
      console.error("Failed to fetch invite code:", error)
    }
  }

  const sendInvite = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/organization/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteData),
      })

      if (response.ok) {
        setShowInviteDialog(false)
        setInviteData({ email: "", role: "Member" })
        // Show success message
      }
    } catch (error) {
      console.error("Failed to send invite:", error)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to update user role:", error)
    }
  }

  const removeUser = async (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchUsers()
        }
      } catch (error) {
        console.error("Failed to remove user:", error)
      }
    }
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800"
      case "Manager":
        return "bg-blue-100 text-blue-800"
      case "Member":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canManageUsers = currentUser?.role === "Admin"
  const canInviteUsers = currentUser?.role === "Admin" || currentUser?.role === "Manager"

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
      <div className="space-y-6 w-[100%]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-gray-600">Manage your organization's team members</p>
          </div>
          {canInviteUsers && (
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Send an invitation to join your organization</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={inviteData.role}
                      onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        {currentUser?.role === "Admin" && <SelectItem value="Admin">Admin</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={sendInvite}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Invite Code */}
        {canInviteUsers && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Invite Code</CardTitle>
              <CardDescription>Share this code with new members to join your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input value={inviteCode} readOnly className="font-mono" />
                <Button variant="outline" onClick={copyInviteCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members List */}
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>

                  {canManageUsers && user._id !== currentUser?._id && (
                    <div className="flex items-center space-x-2">
                      <Select value={user.role} onValueChange={(value) => updateUserRole(user._id, value)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeUser(user._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
            <p className="text-gray-600">Invite your first team member to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
