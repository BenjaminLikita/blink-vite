import { Mic, MoreVerticalIcon, Video, Check, MicOff, VideoOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useMeetingContext from '@/hooks/useMeetingContext';

const MicVideoControls = ({mode, roomId}: {mode: 'room' | 'setup', roomId?: string}) => {

  
  const { toggleCamera, toggleMicrophone, micEnabled, camEnabled, microphoneDevices: microphones, cameraDevices: cameras, activeCamera, activeMicrophone, changeActiveDevice } = useMeetingContext()
  return (
    <div className='flex gap-3'>
      {/* MIC */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={() => toggleMicrophone(roomId!, mode)}>
          {
            // microphone?.getTracks().find(track => track.kind === 'audio')?.enabled ? (
            micEnabled ? (
              <Mic color='white' size={20} />
            ) : (
              <MicOff color='white' size={20} />
            )
          }
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='p-2 cursor-pointer'>
              <MoreVerticalIcon color='white' size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-secondary border-none w-[300px] truncate'>
            {
              microphones?.map((mic, index) => (
                <DropdownMenuItem key={index} onClick={() => changeActiveDevice(mic.deviceId, "mic")} className='hover:!bg-white/20 truncate cursor-pointer'>
                  <span className='flex items-center gap-2 text-white'>
                    {
                      mic.label === activeMicrophone?.label && (
                        <Check size={20} color='#fff' />
                      )
                    }
                    {mic.label}
                  </span>
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* VIDEO */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={() => toggleCamera(roomId!, mode)}>
          {
            // camera?.getTracks().find(track => track.kind === 'video')?.enabled ? (
            camEnabled ? (
              <Video color='white' size={20} />
            ) : (
              <VideoOff color='white' size={20} />
            )
          }
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='p-2 cursor-pointer'>
              <MoreVerticalIcon color='white' size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-secondary border-none w-[300px] truncate'>
            {
              cameras?.map((camera, index) => (
                <DropdownMenuItem key={index} onClick={() => changeActiveDevice(camera.deviceId, "cam")} className='hover:!bg-white/20 truncate cursor-pointer'>
                  <span className='flex items-center gap-2 text-white'>
                    {
                      camera.label === activeCamera?.label && (
                        <Check size={20} color='#fff' />
                      )
                    }
                    {camera.label}
                  </span>
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default MicVideoControls