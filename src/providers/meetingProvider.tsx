import Peer from 'peerjs'
import { useEffect, useReducer, useState } from 'react'
import { IUser } from '@/lib/types';
import { useUser } from '@clerk/clerk-react';
import { socket } from '@/socket';
import { MeetingContext } from '@/context/meetingContext';
import { Outlet } from 'react-router-dom';
import { participantsReducer } from '@/reducers/participantsReducer';
import { toast } from 'sonner';

export interface Participant{
  user: {
    id: string;
    imageUrl: string;
  }
  stream: MediaStream | null;
}

const MeetingProvider = () => {

  const { user, isLoaded } = useUser()
  const [me, setMe] = useState<Peer>()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([])
  const [activeCamera, setActiveCamera] = useState<MediaStreamTrack | undefined>()
  const [activeMicrophone, setActiveMicrophone] = useState<MediaStreamTrack | undefined>()
  const [camEnabled, setCamEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  
  const [remoteParticipants, dispatch] = useReducer(participantsReducer, [])

  const getMediaDevices = async () => {
    try {
      // CHECK IF DEVICES ALREADY HAVE PERMISSION (WORKS ON CHROME BUT NOT ON FIREFOX)
      // const devices = await navigator.mediaDevices.enumerateDevices()
      // console.log(devices)
      // if(devices.length) {
      //   return
      // }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setStream(stream)
      const activeCamera = stream.getVideoTracks().find(track => track.readyState === 'live')
      const activeMicrophone = stream.getAudioTracks().find(track => track.readyState === 'live')
      setActiveCamera(activeCamera)
      setActiveMicrophone(activeMicrophone)
      setMicEnabled(true)
      setCamEnabled(true)

      await getDevices()
    } catch (_error) {
      console.log({_error})
      toast.error('Error getting media devices', {
        description: 'Please check your device settings and try again.',
        richColors: true
      })
    }
  }

  const getDevices = async () => {
    try {
      const mics = await getConnectedDevices('audioinput')
      const cameras = await getConnectedDevices('videoinput')
      setCameraDevices(cameras)
      setMicrophoneDevices(mics)
      return [...mics, ...cameras]
    } catch (_error) {
      toast.error('Error getting devices list', {
        description: 'Please check your device settings and try again.',
        richColors: true
      })
    }
  }

  const changeActiveDevice = async (deviceId: string, deviceType: "cam" | "mic") => {
    if(!stream) return
    let constraints;
    try {
      if(deviceType === "mic"){
        constraints = {
          audio: { deviceId: { exact: deviceId } }
        }
      } else {
        constraints = {
          video: { deviceId: { exact: deviceId } }
        }
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if(deviceType === "mic"){
        newStream.getTracks().forEach(track => {
          if(track.kind === 'audio'){
            track.enabled = micEnabled
          }
        })
        newStream.addTrack(stream.getVideoTracks()[0])
        setStream(newStream)
        setActiveMicrophone(newStream.getAudioTracks().find(track => track.readyState === 'live'))
        console.log(newStream.getTracks())
      } else{
        newStream.getTracks().forEach(track => {
          if(track.kind === 'video'){
            track.enabled = camEnabled
          }
        })
        newStream.addTrack(stream.getAudioTracks()[0])
        setStream(newStream)
        setActiveCamera(newStream.getVideoTracks().find(track => track.readyState === 'live'))
      }
    } catch (_error) {
      toast.error('Error switching device', {
        description: 'Please check your device settings and try again.',
        richColors: true
      })
    }

  };
  // const changeActiveDevice = async (deviceId: string, deviceType: "cam" | "mic") => {
  //   if(!stream) return
  //   let constraints;
  //   try {
  //     if(deviceType === "mic"){
  //       constraints = {
  //         audio: { deviceId: { exact: deviceId } },
  //         video: { deviceId: { exact: activeCamera?.getSettings().deviceId } }
  //       }
  //     } else {
  //       constraints = {
  //         audio: { deviceId: { exact: activeMicrophone?.getSettings().deviceId } },
  //         video: { deviceId: { exact: deviceId } }
  //       }
  //     }
      
  //     const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
  //     if(deviceType === "mic"){
  //       newStream.getTracks().forEach(track => {
  //         if(track.kind === 'audio'){
  //           track.enabled = micEnabled
  //         }
  //         if(track.kind === 'video'){
  //           track.enabled = camEnabled
  //         }
  //       })
  //       setStream(newStream)
  //       setActiveMicrophone(newStream.getAudioTracks().find(track => track.readyState === 'live'))
  //       console.log(newStream.getTracks())
  //     } else{
  //       newStream.getTracks().forEach(track => {
  //         if(track.kind === 'video'){
  //           track.enabled = camEnabled
  //         }
  //         if(track.kind === 'audio'){
  //           track.enabled = micEnabled
  //         }
  //       })
  //       setStream(newStream)
  //       setActiveCamera(newStream.getVideoTracks().find(track => track.readyState === 'live'))
  //     }
  //   } catch (_error) {
  //     toast.error('Error switching device', {
  //       description: 'Please check your device settings and try again.',
  //       richColors: true
  //     })
  //   }

  // };
  
  const updateParticipantCamera = async (userId: string, enabled: boolean) => {
    dispatch({ type: 'UPDATE_PARTICIPANT_CAMERA', payload: {userId, enabled} })
  }

  const updateParticipantMicrophone = async (userId: string, enabled: boolean) => {
    dispatch({ type: 'UPDATE_PARTICIPANT_MIC', payload: {userId, enabled} })
  }
  
  const toggleCamera = async (roomId: string, mode: 'room' | 'setup') => {
    const videoTrack = stream?.getTracks().find(track => track.kind === 'video')
    if(!videoTrack) return
    if(mode === 'setup'){
      if(videoTrack.enabled){
        setCamEnabled(false)
        videoTrack.enabled = false
      } else{
        setCamEnabled(true)
        videoTrack.enabled = true
      }
    } else{
      if(videoTrack.enabled){
        setCamEnabled(false)
        socket.emit('disableCamera', user?.id, roomId)
      } else{
        setCamEnabled(true)
        socket.emit('enableCamera', user?.id, roomId)
      }
    }
  }
  
  const toggleMicrophone = async (roomId: string, mode: 'room' | 'setup') => {
    const micTrack = stream?.getTracks().find(track => track.kind === 'audio')
    if(!micTrack) return
    if(mode === 'setup'){
      if(micTrack.enabled){
        setMicEnabled(false)
        micTrack.enabled = false
      } else{
        setMicEnabled(true)
        micTrack.enabled = true
      }
    } else{
      if(micTrack.enabled){
        setMicEnabled(false)
        socket.emit('disableMicrophone', user?.id, roomId)
      } else{
        setMicEnabled(true)
        socket.emit('enableMicrophone', user?.id, roomId)
      }
    }
  }
  
  async function getConnectedDevices(type: 'videoinput' | 'audioinput' | 'audiooutput') {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
  }

  const joinRoom = async (roomId: string) => {
    socket.emit('joinRoom', roomId, {userId: user?.id, username: user?.username, imageUrl: user?.imageUrl})
  }

  const addParticipant = (participant: Participant) => {
    console.log("addParticipant", participant)
    // dispatch({ type: 'ADD_PARTICIPANT', payload: [participant] })
  }

  const addParticipantStream = (userId: string, stream: MediaStream) => {
    dispatch({ type: 'ADD_PARTICIPANT_STREAM', payload: {userId, stream} })
  }
  
  const removeParticipant = (userId: string) => {
    console.log("remove participant", {userId}, remoteParticipants)
    // const participants = remoteParticipants.filter(participant => participant.user.id !== userId)
    console.log("after remove participant")
    // dispatch({ type: 'REMOVE_PARTICIPANT', payload: participants })
  }
  const getUsers = (participants: IUser[]) => {
    const remoteParticipants = participants.map(participant => {
      return { user: { id: participant.id, imageUrl: participant.imageUrl }, stream: participant.id === user?.id ? stream : null }
    })
    dispatch({ type: 'ADD_PARTICIPANT', payload: {participants: remoteParticipants} })
  }
  
  useEffect(() => {
    if(!isLoaded || !user) return
    
    const peer = new Peer(user.id)
    peer.on('open', () => {
      console.log("peer open")
    })
    peer.on('error', (error) => {
      console.log("peer error", error)
    })
    peer.on('disconnected', () => {
      console.log("peer disconnected")
    })
    setMe(peer)

    socket.on('userLeft', (data) => {
      console.log(`${data.username} left the room`);
    });

    socket.on('updateUserList', (userList) => {
      const participants: Participant[] = userList.map((participant: IUser) => {
        return { user: { id: participant.id, imageUrl: participant.imageUrl }, stream: participant.id === user?.id ? stream : null }
      })
      dispatch({ type: 'UPDATE_PARTICIPANT', payload: {participants} })
    });


    return () => {
      peer.disconnect()
      socket.off('userLeft');
      socket.off('updateUserList');
    };
  }, [stream, isLoaded, user])

  return (
    <MeetingContext.Provider value={{ 
        joinRoom, micEnabled, camEnabled, me, getMediaDevices, 
        stream,
        toggleCamera, cameraDevices, microphoneDevices, toggleMicrophone, activeCamera, activeMicrophone, changeActiveDevice, remoteParticipants, getUsers, removeParticipant, addParticipant, addParticipantStream, updateParticipantCamera, updateParticipantMicrophone 
      }}>
      <Outlet />
    </MeetingContext.Provider>
  )
}

export default MeetingProvider