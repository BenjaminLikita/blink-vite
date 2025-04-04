import { useAuth } from '@clerk/clerk-react'
import { Outlet, useNavigate } from 'react-router-dom'

const AuthRoute = () => {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  return (
    isSignedIn ? <>{navigate(-1)}</> : <Outlet />
  )
}

export default AuthRoute