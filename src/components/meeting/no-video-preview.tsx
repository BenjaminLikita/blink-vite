import { useUser } from "@clerk/clerk-react"

const NoVideoPreview = () => {
  const { user } = useUser()
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      {
        user && <img className='rounded-full' width={100} height={100} src={user.imageUrl.toString()} alt='preview-user' />
      }
      <p className='font-medium text-lg'>No Camera Found</p>
    </div>
  )
}

export default NoVideoPreview