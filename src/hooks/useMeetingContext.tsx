"use client"

import { MeetingContext } from '@/context/meetingContext'
import { useContext } from 'react'

const useMeetingContext = () => {
  const context = useContext(MeetingContext)

  if(!context){
    throw new Error('MeetingContext must be used within a MeetingProvider')
  }
  return context
}

export default useMeetingContext