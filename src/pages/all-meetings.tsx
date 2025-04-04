import { Link } from 'react-router-dom'
import { dateToTime, formatDate } from '@/utils/helpers'
import logo from '@/assets/logo.png'
import { useGetMeetingsQuery } from '@/api/queries'


const AllMeetings = () => {
  
  const { data: meetings, isLoading: loadingMeetings } = useGetMeetingsQuery()

  return (
    <main>
      <div className='mt-20'>
        <div className='flex items-center justify-between border-b pb-10 border-white/40 p-4'>
          <h1 className='font-medium text-3xl'>Meeting History</h1>
        </div>
        {
          loadingMeetings ? (
            <div className='h-[60vh] grid place-items-center'>
              <img width={50} className='animate-bounce' src={logo} alt='blink-logo' />
            </div>
          ) : !meetings || meetings?.length === 0 ? (
            <div className='h-[70vh] grid place-items-center'>
              <h1 className='font-semibold text-3xl'>No Meetings found</h1>
            </div>
          ) : meetings.map(({createdAt, name, id}) => (
            <div key={id} className='flex gap-5 items-center py-2 text-sm border-b border-white/40'>
              <h1>{dateToTime(createdAt)}</h1>
              <div className='flex-[1]'>
                <p>{formatDate(createdAt)}</p>
                <h1 className='font-semibold text-xl'>{name}</h1>
                <p>Meeting ID: {id}</p>
              </div>
              <Link to={`/meeting/${id}`} className='hover:underline text-base m-5'>Join</Link>
            </div>
          ))
        }
      </div>
    </main>
  )
}

export default AllMeetings