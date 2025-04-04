import useMeetingContext from '@/hooks/useMeetingContext'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useRef, useState } from 'react'

const ParticipantVideo = () => {
  const { user, isLoaded } = useUser()
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { stream } = useMeetingContext()
  const [camEnabled, setCamEnabled] = useState(false)

  useEffect(() => {
    if (stream && videoRef.current) {
      if(stream.getTracks().find(track => track.kind === 'video')?.enabled) {
        setCamEnabled(true)
      } else{
        setCamEnabled(false)
      }
      videoRef.current.srcObject = stream;
    }
  }, [stream])

  return (
    <div className='w-[100%] bg-gray-800 h-[100%] rounded-xl aspect-video flex items-center justify-center overflow-hidden'>
      {
        camEnabled ? (
          <video autoPlay ref={videoRef} className='w-full h-full object-cover' />
        ) : (isLoaded && user) && (
          <img src={user.imageUrl} alt='user-profile' className='bg-green-500 w-28 h-28 rounded-full' width={100} height={100} />
        )
      }
    </div>
  )
}

export default ParticipantVideo