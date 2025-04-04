import { useEffect, useState } from "react"
import MicVideoControls from "./mic_video_controls"
import { Setting2 } from "iconsax-react"
import { Button } from "../ui/button"
import logo from '@/assets/logo.png'
import { ClipLoader } from "react-spinners"
import VideoPreview from "./video-preview"
import { socket } from "@/socket"
import useMeetingContext from "@/hooks/useMeetingContext"

const MeetingSetup = ({setSetupComplete, callId}:{setSetupComplete: (value: boolean) => void, callId: string}) => {

  // const { data: meeting } = useGetMeetingQuery(callId)
  const meeting = {
    type: 'public',
    id: callId
  }
  const [pendingAccess, setPendingAccess] = useState(false)

  const { stream, getMediaDevices } = useMeetingContext()
  useEffect(() => {
    getMediaDevices()
    socket.on("acceptedPrivateCallAccess", async (_data) => {
      setSetupComplete(true)
    })

    return () => {
      stream?.getTracks().forEach(track => track.stop())
      socket.off("acceptedPrivateCallAccess")
    }
  }, [])


  const joinMeeting = async () => {
    if(!meeting) return
    if(meeting.type === 'private') {
      setPendingAccess(true)
      socket.emit('requestPrivateCallAccess', {roomId: meeting.id})
    } else{
      setSetupComplete(true)
    }
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-start mt-20 gap-14 text-white'>
      <div className='flex flex-col items-center gap-5'>
        <img src={logo} width={80} alt='blink-logo' />
        <div className='space-y-3'>
          <h1 className='text-2xl md:text-4xl font-light text-white/80 text-center'>Get Started</h1>
          <p className='text-gray-500 text-xs md:text-base'>Prepare your audio and video setup before connecting</p>
        </div>
      </div>

      <div className="w-[90%] lg:w-[50%]">
        <VideoPreview />
        <div className='flex justify-between items-center my-5'>

          {/* Left Options */}
          <MicVideoControls mode="setup" />

          {/* Right Options */}
          <div className='border border-white/30 flex rounded-lg'>
            <span className='p-2'>
              <Setting2 color='white' size={20} />
            </span>
          </div>
        </div>
        
        <div className='flex items-center group'>
          <Button size={'lg'} onClick={joinMeeting} className='m-auto hover:group-first:bg-red-500' disabled={pendingAccess}>{pendingAccess ? <ClipLoader color="#fff" size={15} /> : "Join Meeting"}</Button>
        </div>
      </div>
    </div>
  )
}


export default MeetingSetup