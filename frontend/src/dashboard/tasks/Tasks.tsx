import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Calendar, User, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import axios from 'axios';
import { useTheme } from "@/components/theme-provider"

interface Task {
  _id: string
  title: string
  description: string
  status: "Todo" | "In Progress" | "Completed" | "Expired"
  priority: "Low" | "Medium" | "High"
  category: string
  dueDate: string
  assignedTo?: {
    _id: string
    name: string
    email: string
  }
  createdBy: {
    _id: string
    name: string
  }
  createdAt: string
}

interface TaskUser {
  _id: string
  name: string
  email: string
  role: string
}

export default function TasksPage() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<TaskUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Feature",
    dueDate: "",
    assignedTo: "",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    fetchTasks()
    fetchUsers()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks/getTasks`,{params:{token:token}})

      if (response.status) {
        const data = await response.data
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getInfo`, {params:{token:token}});

      if (response.status) {
        const data = await response.data
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const createTask = async () => {
    try {
      const token = localStorage.getItem("token")
      console.log(newTask)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tasks/createTask`,{token,newTask})

      if (response.status) {
        setShowCreateDialog(false)
        setNewTask({
          title: "",
          description: "",
          priority: "Medium",
          category: "Feature",
          dueDate: "",
          assignedTo: "",
        })
        fetchTasks()
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Clicked")
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/tasks/updateTask`,{taskId,status,token})

      if(response.status===403){
        alert("Wait for Admin or Manager to Start the task")
      }
      else if (response.status===200) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const filteredTasks = tasks && tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-blue-50 text-blue-700"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-blue-100 text-blue-800"
      case "Low":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canCreateTask = currentUser?.role === "Admin" || currentUser?.role === "Manager"
  const canUpdateTask = (task: Task) => {
    return currentUser?.role === "Admin" || currentUser?.role === "Manager" || task.assignedTo?._id === currentUser?._id
  }

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
      <div className={`space-y-6 w-full ${theme === 'dark' ? 'bg-slate-900 text-white' : ''}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Manage and track your organization's tasks</p>
          </div>
          {canCreateTask && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to your organization</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bug">Bug</SelectItem>
                          <SelectItem value="Feature">Feature</SelectItem>
                          <SelectItem value="Improvement">Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createTask}>Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Todo">Todo</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4 " >
          {filteredTasks.map((task) => (
            <Card key={task._id} className={theme === 'dark' ? 'bg-slate-800 text-white' : 'hover:shadow-md transition-shadow'}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>{task.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className={`flex items-center space-x-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> 
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{task.assignedTo.name}</span>
                      </div>
                    )}
                    <Badge variant="outline">{task.category}</Badge>
                  </div>
                  {canUpdateTask(task) && task.status !== "Completed" && task.status !== "Expired" && (
                    <div className="flex space-x-2">
                      {task.status === "Todo" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => updateTaskStatus(task._id, "In Progress")}
                        >
                          Start
                        </Button>
                      )}
                      {task.status === "In Progress" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => updateTaskStatus(task._id, "Completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No tasks found</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
