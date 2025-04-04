import { SignUp } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const SignUpPage = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <SignUp appearance={{ 
        baseTheme: dark,
        elements: {
          card: {
            backgroundColor: "#1f272f"
          },
          input: {
            backgroundColor: "transparent",
          }
        } 
      }} />
    </div>
  )
}

export default SignUpPage