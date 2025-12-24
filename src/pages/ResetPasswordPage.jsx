import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTranslation } from '../hooks/useTranslation'
import LoadingScreen from '../components/LoadingScreen'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Check if we have the necessary tokens from the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.')
      setLoading(false)
      return
    }

    // Set the session with the tokens from the URL
    const setSession = async () => {
      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (error) {
          setError('Invalid or expired reset link. Please request a new password reset.')
        }
      } catch (err) {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    setSession()
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validation
    if (passwords.password.length < 6) {
      setError(t('passwordTooShort'))
      setIsSubmitting(false)
      return
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to account page after 2 seconds
        setTimeout(() => {
          navigate('/account')
        }, 2000)
      }
    } catch (err) {
      setError(t('somethingWentWrong'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/')
  }

  if (loading) {
    return <LoadingScreen isVisible={true} />
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('passwordUpdated')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('passwordUpdateSuccess')}
          </p>
          <div className="text-sm text-gray-500">
            {t('redirectingToAccount')}...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('setNewPassword')}
          </h2>
          <p className="text-gray-600">
            {t('enterNewPassword')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            {error.includes('Invalid') && (
              <button
                onClick={handleBackToLogin}
                className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium"
              >
                {t('requestNewReset')}
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('newPassword')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwords.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder={t('enterNewPassword')}
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('confirmNewPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder={t('confirmNewPassword')}
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t('updatingPassword')}
              </div>
            ) : (
              t('updatePassword')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {t('backToHomePage')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage 