import { Share, MonitorOff, Smile } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogoutCurve } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';

const ShareScreenLogoutControls = () => {
  const navigate = useNavigate()
  // const call = useCall()

  // if(!call) throw new Error('Use Call must be used within StreamCallComponent')

  // const { useHasOngoingScreenShare } = useCallStateHooks()

  // const hasOngoingScreenShare = useHasOngoingScreenShare()

  const leaveCall = async () => {
    // await call.leave({ reason: "leave call" })
    navigate('/meeting')
  }

  const hasOngoingScreenShare = false

  const toggleShareScreen = async () => {
    if(hasOngoingScreenShare){
      // disable screen share
    } else {
      // enable screen share
    }
  }
  return (
    <div className='flex gap-3'>
      {/* SHARE SCREEN */}
      <div className='border border-white/30 flex divide-x divide-white/30 rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={toggleShareScreen}>
          {
            hasOngoingScreenShare ? (
              <MonitorOff color='white' size={20} />
            ) : (
              <Share color='white' size={20} />
            )
          }
        </span>  
      </div>

      <div className='border border-white/30 flex  rounded-lg'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='p-2 cursor-pointer'>
              <Smile color='white' size={20} />
            </span>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent className='bg-secondary border-none truncate'>
            <DefaultReactionsMenu reactions={defaultReactions} />
          </DropdownMenuContent> */}
          
        </DropdownMenu>
      </div>

      {/* LEAVE CALL */}
      <div className='bg-[#fa6037] flex rounded-lg'>
        <span className='p-2 cursor-pointer' onClick={leaveCall}>
          <LogoutCurve color='white' size={20} />
        </span>
      </div>
    </div>
  )
}

export default ShareScreenLogoutControls