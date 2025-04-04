import { useUser } from '@clerk/clerk-react';
import RemoteVideo from './remote-video';
import useMeetingContext from '@/hooks/useMeetingContext';

const RemoteParticipants = () => {

  const { remoteParticipants } = useMeetingContext()
  console.log({remoteParticipants})
  const { user } = useUser()
  

  return (
    <>
      {
        remoteParticipants?.length ? remoteParticipants?.filter(participant => participant.user.id !== user?.id).map((participant, index) => (
          <RemoteVideo key={index} {...participant} />
        )) : null
      }
    </>
  )
}

export default RemoteParticipants