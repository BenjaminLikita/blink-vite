import { useEffect, useRef, useState } from 'react'

type RemoteVideoProps = {
  stream: MediaStream | null;
  user: {
    id: string;
    imageUrl: string;
  }
}

const RemoteVideo = ({stream, user}:RemoteVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
        ) : user && (
          <img src={user.imageUrl} alt='user-profile' className='w-28 h-2w-28 rounded-full' width={100} height={100} />
        )
      }
    </div>
  )
}

export default RemoteVideo