import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from "./components/theme-provider";

import LoginPage from './auth/Login.tsx'
import RegisterPage from './auth/Register.tsx'
import LandingPage from './Home'
import Dashboard from './dashboard/Dashboard.tsx'
import MembersPage from './dashboard/members/Members.tsx'
import SettingsPage from './dashboard/settings/Settings.tsx'
import TasksPage from './dashboard/tasks/Tasks.tsx'
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/dashboard/members' element={<MembersPage/>}/>
          <Route path='/dashboard/settings' element={<SettingsPage/>}/>
          <Route path='/dashboard/tasks' element={<TasksPage/>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-in" element={<RegisterPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App;
