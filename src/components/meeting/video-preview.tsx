import useMeetingContext from '@/hooks/useMeetingContext'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useRef } from 'react'

const VideoPreview = () => {
  const { user, isLoaded } = useUser()
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { stream, camEnabled } = useMeetingContext()

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play()
    }
  }, [stream, camEnabled])
  return (
    <div className='w-full relative bg-gray-800 rounded-xl aspect-video flex items-center justify-center overflow-hidden'>
      {
        camEnabled ? (
          <video autoPlay muted ref={videoRef} className='w-full h-full object-cover' />
        ) : (isLoaded && user) && (
          <img src={user.imageUrl} alt='user-profile' className='w-28 h-2w-28 rounded-full' width={100} height={100} />
        )
      }
    </div>
  )
}

export default VideoPreview