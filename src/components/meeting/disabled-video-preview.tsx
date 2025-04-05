import { useUser } from "@clerk/clerk-react"

const DisabledVideoPreview = () => {
  const { user } = useUser()
  return (
    <>
      {
        user && <img width={100} height={100} className='rounded-full' src={user.imageUrl || '/user'} alt='preview-user' />
      }
    </>
  )
}

export default DisabledVideoPreview