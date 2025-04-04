import { RedirectToSignIn, useAuth } from '@clerk/clerk-react'
import { Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { isSignedIn } = useAuth()

  return (
    isSignedIn ? <Outlet /> : <RedirectToSignIn />
  )
}

export default ProtectedRoute