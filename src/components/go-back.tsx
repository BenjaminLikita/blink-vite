import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const GoBack = () => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)
  return (
    <Button onClick={goBack} className='rounded-full'><ArrowLeft color='white' /> Go Back</Button>
  )
}

export default GoBack