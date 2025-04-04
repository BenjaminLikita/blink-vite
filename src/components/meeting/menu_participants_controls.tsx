// import { useCallStateHooks } from '@stream-io/video-react-sdk'
import useMeetingContext from '@/hooks/useMeetingContext'
import { Menu, Users } from 'lucide-react'
import React from 'react'

const MenuParticipantsCount = () => {
  
  const { remoteParticipants } = useMeetingContext()
  return (
    <div className='flex gap-3'>
      {/* PARTICIPANT COUNT */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer flex items-center gap-3'>
          <Users color='white' size={20} />
          {remoteParticipants.length}
        </span>
      </div>

      {/* MENU BUTTON */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer'>
          <Menu color='white' size={20} />
        </span>  
      </div>
    </div>
  )
}

export default MenuParticipantsCount