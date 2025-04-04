import SideNav from './sideNav'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

const SideNavWrapper = () => {
  const [isMeetingPage, setIsMeetingPage] = useState(false)

  useEffect(() => {
    const isMeetingPage = typeof window !== 'undefined' ? window.location.pathname.includes('/meeting/') : false
    setIsMeetingPage(isMeetingPage)
  }, [])

  return (
    <>
      {
        isMeetingPage ? (
          <div className='w-full min-h-screen'>
            <Outlet />
          </div>
        ) : (
          <>
            <SideNav />
            <div className='w-full min-h-screen'>
              <Outlet />
            </div>
          </>
        )
      }
    </>
  )
}

export default SideNavWrapper