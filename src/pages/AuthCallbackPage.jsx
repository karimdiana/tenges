import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LoadingScreen from '../components/LoadingScreen'

const AuthCallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during OAuth callback:', error)
          // Redirect to home with error
          navigate('/?auth=error', { replace: true })
          return
        }

        if (data?.session) {
          // Success! User is authenticated
          console.log('OAuth login successful')
          // Redirect to account page or where they came from
          const redirectTo = sessionStorage.getItem('authRedirect') || '/account'
          sessionStorage.removeItem('authRedirect')
          navigate(redirectTo, { replace: true })
        } else {
          // No session, redirect to home
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('Unexpected error during OAuth callback:', error)
        navigate('/?auth=error', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return <LoadingScreen isVisible={true} />
}

export default AuthCallbackPage 