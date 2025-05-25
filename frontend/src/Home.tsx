import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Calendar, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div className="space-x-4">
            <a onClick={()=> window.location.href="/login"}>
              <Button variant="ghost">Login</Button>
            </a>
            <a onClick={()=> window.location.href="/sign-in"}>
              <Button>Get Started</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Multi-Tenant Task Management
          <span className="text-blue-600"> Made Simple</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Organize your team, manage tasks efficiently, and boost productivity with our comprehensive task management
          platform designed for modern organizations.
        </p>
        <div className="space-x-4">
          <a onClick={()=> window.location.href="/sign-in"}>
            <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
              Start Free Trial
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-blue-700 mb-2" />
              <CardTitle>Multi-Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete data isolation per organization with role-based access control.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create, assign, and track tasks with priorities, categories, and due dates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Auto Expiry</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Automated task status updates and overdue notifications.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-800 mb-2" />
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>JWT authentication with comprehensive role-based permissions.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6" />
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <p className="text-gray-400">© 2024 TaskFlow. Built with MERN Stack for multi-tenant task management.</p>
        </div>
      </footer>
    </div>
  )
}
