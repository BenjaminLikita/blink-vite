import { ICallLayout } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"
import ShareScreenLogoutControls from "./shareScreen_logout_controls"
import MenuParticipantsCount from "./menu_participants_controls"
import { Grid1, Grid5 } from "iconsax-react"
import { toast } from "sonner"
import RemoteParticipants from "./remote-participants"
import useMeetingContext from "@/hooks/useMeetingContext"
import { socket } from "@/socket"
import { useUser } from "@clerk/clerk-react"
import ParticipantVideo from "./participant-video"
import MicVideoControls from "./mic_video_controls"
import { useGetMeetingQuery } from "@/api/queries"

const MeetingRoom = ({callId}: {callId: string}) => {
  // const { data: meeting } = useGetMeetingQuery(callId)
  const meeting = {
    userId: 'userId'

  }
  const [layout, setLayout] = useState<ICallLayout>('speaker-left')


  const acceptUser = useCallback(async ({ userId, roomId }: { userId: string, roomId: string }) => {
    socket.emit('acceptedPrivateCallAccess', {roomId, userId})
  }, [])

  const { joinRoom, me, stream, addParticipantStream, updateParticipantCamera, updateParticipantMicrophone } = useMeetingContext()
  const { user } = useUser()

  useEffect(() => {
    joinRoom(callId)
  }, [callId])
  // }, [joinRoom, callId])

  useEffect(() => {
    if(!me) return
    if(!stream) return

    socket.on('enableCamera', (userId: string) => {
      updateParticipantCamera(userId, true)
    })
    
    socket.on('disableCamera', (userId: string) => {
      updateParticipantCamera(userId, false)
    })
    
    socket.on('enableMicrophone', (userId: string) => {
      updateParticipantMicrophone(userId, true)
    })
    
    socket.on('disableMicrophone', (userId: string) => {
      console.log(userId, "disableMicrophone")
      updateParticipantMicrophone(userId, false)
    })
    
    
    // socket.on('userJoined', ({ id, imageUrl, roomId, username }) => {
    socket.on('userJoined', ({ id }) => {
      if(user?.id === id) return
      
      const call = me.call(id, stream)
      
      if(!call) return

      call.on('stream', (peerStream) => {
        console.log(peerStream.getTracks(), "peer stream")
        addParticipantStream(id, peerStream)
      })
      call.on('close', () => {
        console.log("call closed")
      })
      
    });
    
    me.on('call', (call) => {
      call.answer(stream)
      call.on('stream', (remoteStream: MediaStream) => {
        console.log(remoteStream.getTracks(), "remote stream")
        addParticipantStream(call.peer, remoteStream)
      })
    });

    me.on('close', () => {
      console.log("me closed")
    })

    return () => {
      socket.off('enableCamera')
      socket.off('disableCamera')
      socket.off('userJoined');
    }
    
  // }, [me, camera, user?.id, microphone])
  }, [me, stream, user?.id, addParticipantStream, updateParticipantCamera, updateParticipantMicrophone])

  useEffect(() => {
    if(!socket) return
    
    socket.on('requestMessage', async (data: {username: string, roomId: string, userId: string}) => {
      const { userId, username, roomId } = data
      if(meeting?.userId === user?.id) {
        const audio = new Audio('/assets/record_start.mp3')
        audio.play().catch(error => console.error(error))
        toast(`${username} is trying to join in`,{
          action: {
            label: "Go to schedule to undo",
            onClick: () => acceptUser({userId, roomId})
          }
        })
      }
      
    })

    return () => {
      socket.off('requestMessage')
    }
  }, [acceptUser, meeting?.userId, user?.id])

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        // return <PaginatedGridLayout />
        return (
          <div className="bg-red-500 flex items-center justify-center  gap-4 overflow-hidden h-full">
            <ParticipantVideo />
            <RemoteParticipants />
          </div>
        )
              
      case 'speaker-right':
        // return <SpeakerLayout participantsBarPosition={'left'} />
        return <p>speaker right layout</p>
        
        default:
          // return <SpeakerLayout participantsBarPosition={'right'} />
          return <p>speaker left layout</p>
    }
  }


  
  // const { useHasOngoingScreenShare } = useCallStateHooks();
  // const hasOngoingScreenshare = useHasOngoingScreenShare();
  const hasOngoingScreenshare = false

  useEffect(() => {
    if(hasOngoingScreenshare){
      setLayout("speaker-left")
    } else{
      setLayout("grid")
    }
  }, [hasOngoingScreenshare]);

  return (
    <div className='relative h-screen w-full overflow-hidde pt-4 text-white p-5 flex flex-col items-center justify-between'>
      <div className='flex items-center gap-5'>
        <button onClick={() => setLayout('grid')}><Grid1 color={layout === 'grid' ? '#18e6de' : 'white'} variant={layout === 'grid' ? 'TwoTone' : 'Linear'} size={30} /></button>
        <button onClick={() => setLayout('speaker-left')}><Grid5 color={layout === 'speaker-left' ? '#18e6de' : 'white'} variant={layout === 'speaker-left' ? 'TwoTone' : 'Linear'} size={30} /></button>
        <button onClick={() => setLayout('speaker-right')}><Grid5 className='rotate-180' color={layout === 'speaker-right' ? '#18e6de' : 'white'} variant={layout === 'speaker-right' ? 'TwoTone' : 'Linear'} size={30} /></button>
      </div>
      {/* <div>
      </div> */}

      {/* <div className='w-full flex items-center max-w-screen-s h-full md:max-w-[calc(100vw-30%)] bg-blue-600'>
        <CallLayout />
      </div> */}
      <div className="w-[90%] lg:w-[80%] h-full flex items-center justify-center bg-blue-600">
        <CallLayout />
      </div>

      <div className='flex items-center w-full justify-between flex-wrap'>
        <MicVideoControls mode="room" roomId={callId} />
        {/* <RecordCallButton /> */}
        <p>rec</p>
        <ShareScreenLogoutControls />
        <MenuParticipantsCount />
      </div>
    </div>
  )
}


export default MeetingRoom