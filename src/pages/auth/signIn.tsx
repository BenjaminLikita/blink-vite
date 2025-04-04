import { SignIn } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const SignInPage = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <SignIn appearance={{ 
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

export default SignInPage