import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Users, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="shadow-sm fixed w-full bg-[rgba(0,0,0,0.39)] backdrop-blur-xs">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/"><CheckCircle  className="h-8 w-8 text-blue-600" /></Link>
            
            <Link to="/" className="text-2xl font-bold text-gray-900">TaskFlow</Link>
          </div>
          <div className="space-x-4 ">
            <Link to="/login">
              <Button className="text-slate-800 bg-slate-200 hover:bg-slate-300">
                Login
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button className="text-white bg-blue-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Multi-Tenant Task Management
          <span className="text-blue-600"> Made Simple</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Organize your team, manage tasks efficiently, and boost productivity
          with our comprehensive task management platform designed for modern
          organizations.
        </p>
        <div className="space-x-4">
          <Link to="/sign-in">
            <Button
              size="lg"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-black">
          Key Features
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-700">
            <CardHeader>
              <Users className="h-10 w-10 text-blue-700 mb-2" />
              <CardTitle>Multi-Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete data isolation per organization with role-based access
                control.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-700">
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create, assign, and track tasks with priorities, categories, and
                due dates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-700">
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Auto Expiry</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated task status updates and overdue notifications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-700">
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-800 mb-2" />
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                JWT authentication with comprehensive role-based permissions.
              </CardDescription>
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
          <p className="text-gray-400">
            © 2024 TaskFlow. Built with MERN Stack for multi-tenant task
            management.
          </p>
        </div>
      </footer>
    </div>
  );
}
