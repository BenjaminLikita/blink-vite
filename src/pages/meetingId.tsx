import { useEffect, useState } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'iconsax-react';
import { Link, useParams } from 'react-router-dom';
import MeetingSetup from '@/components/meeting/meeting-setup';
import MeetingRoom from '@/components/meeting/meeting-room';
import useMeetingContext from '@/hooks/useMeetingContext';
import { useGetMeetingQuery } from '@/api/queries';

const MeetingId = () => {
  const { id } = useParams()
  
  const { getDevices } = useMeetingContext()

  useEffect(() => {
    navigator?.mediaDevices?.addEventListener('devicechange', getDevices)
  }, [id])
  
  // const { data: meeting, isLoading: isCallLoading } = useGetMeetingQuery(id as string)
  const meeting = {}
  const isCallLoading = false


  const [isSetupComplete, setIsSetupComplete] = useState(false)

  if(isCallLoading) return (
    <div className='h-[calc(100vh)] w-[calc(100vw-80px)] p-5 grid place-items-center'>
      <img src={logo} width={100} className='animate-bounce' alt={'blink-logo'} />
    </div>
  )
  
  if(!id) return null
  return (
    <main className='h-full w-full'>
      {
        !meeting ? (
          <div className='flex justify-center items-center h-screen flex-col gap-5'>
            <div className='relative'>
              <h1 className='font-extrabold text-white/30 text-9xl'>404!</h1>
              <p className='font-semibold text-3xl text-center absolute top-[50%] -translate-y-[50%] left-[50%] w-full -translate-x-[50%]'>Call Not found</p>
            </div>

            <Link to={'/meeting'}>
              <Button className='rounded-full'><ArrowLeft color='white' /> Go Back</Button>
            </Link>
          </div>
        ) : !isSetupComplete ? (
          <MeetingSetup setSetupComplete={setIsSetupComplete} callId={id} />
        ) : (
          <MeetingRoom callId={id} />
        )
      }
    </main>
  )
  
}

export default MeetingId





