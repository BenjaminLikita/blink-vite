import '@/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from '@/pages/dashboard'
import ProtectedRoute from '@/components/protectedRoute'
import AuthRoute from '@/components/authRoute'
import SignInPage from '@/pages/auth/signIn'
import SignUpPage from '@/pages/auth/signUp'
import SideNavWrapper from '@/components/sideNavWrapper'
import NotFound from '@/pages/not-found'
import Meeting from '@/pages/meeting'
import AllMeetings from '@/pages/all-meetings'
import Recordings from '@/pages/recordings'
import MeetingId from '@/pages/meetingId'
import MeetingProvider from './providers/meetingProvider'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<div className='flex items-start text-white'><SideNavWrapper /></div>}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/meeting' element={<Meeting />} />

            <Route element={<MeetingProvider />}> 
              <Route path='/meeting/:id' element={<MeetingId />} />
            </Route>

            <Route path='/all-meetings' element={<AllMeetings />} />
            <Route path='/recordings' element={<Recordings />} />
          </Route>
        </Route>

        <Route element={<AuthRoute />}>
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
