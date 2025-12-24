import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, AUTH_PROVIDERS } from '../lib/supabase'
import { useDatabase } from '../hooks/useDatabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Default reward tasks - will be seeded into database
const DEFAULT_REWARD_TASKS = [
  {
    id: 'birthday',
    title: 'Add Birthday',
    icon: '🎂',
    points: 500,
    description: 'Add your birthday to get special offers',
    action_type: 'birthday'
  },
  {
    id: 'instagram',
    title: 'Follow on Instagram',
    icon: '📸',
    points: 100,
    description: 'Follow us @iaxarte on Instagram',
    action_type: 'social'
  },
  {
    id: 'referral',
    title: 'Refer a Friend',
    icon: '🎁',
    points: 150,
    description: 'Invite friends and earn points',
    action_type: 'referral'
  },
  {
    id: 'newsletter',
    title: 'Subscribe to Mailing List',
    icon: '📬',
    points: 400,
    description: 'Get exclusive updates and offers',
    action_type: 'newsletter'
  },
  {
    id: 'tiktok',
    title: 'Follow on TikTok',
    icon: '🎥',
    points: 100,
    description: 'Follow us on TikTok @iaxarte',
    action_type: 'social'
  },
  {
    id: 'youtube',
    title: 'Follow on YouTube',
    icon: '🎬',
    points: 100,
    description: 'Subscribe to our YouTube channel',
    action_type: 'social'
  }
]

export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [rewardTasks, setRewardTasks] = useState([])
  const [userTasks, setUserTasks] = useState([])



  // Database operations
  const {
    upsertProfile,
    getProfile,
    getRewardTasks,
    getUserTasks,
    completeTask: dbCompleteTask,
    getUserPoints
  } = useDatabase()

  // Initialize auth state and listeners
  useEffect(() => {
    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (mounted && session) {
          setSession(session)
          setUser(session.user)
          await loadUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        setSession(session)
        setUser(session?.user || null)

        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
          setUserTasks([])
        }

        setLoading(false)
      }
    )

    initializeAuth()
    loadRewardTasks()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  /**
   * Load user profile from database
   * @param {string} userId - User ID
   */
  const loadUserProfile = async (userId) => {
    try {
      const { success, data } = await getProfile(userId)
      
      if (success && data) {
        setProfile(data)
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(userId)
      }

      // Load user's completed tasks
      const tasksResult = await getUserTasks(userId)
      if (tasksResult.success) {
        setUserTasks(tasksResult.data)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  /**
   * Create user profile after successful registration
   * @param {string} userId - User ID
   */
  const createUserProfile = async (userId) => {
    try {
      const profileData = {
        id: userId,
        email: user?.email,
        full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
        avatar_url: user?.user_metadata?.avatar_url || null,
        preferred_language: user?.user_metadata?.preferred_language || 'ru',
        points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { success, data } = await upsertProfile(profileData)
      
      if (success) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  /**
   * Load reward tasks from database
   */
  const loadRewardTasks = async () => {
    try {
      const { success, data } = await getRewardTasks()
      
      if (success && data.length > 0) {
        setRewardTasks(data)
      } else {
        // Use default tasks if none in database
        setRewardTasks(DEFAULT_REWARD_TASKS)
      }
    } catch (error) {
      console.error('Error loading reward tasks:', error)
      setRewardTasks(DEFAULT_REWARD_TASKS)
    }
  }

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User full name
   * @returns {Promise<Object>} Result with success/error
   */
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            preferred_language: 'ru'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // If email confirmation is disabled, user will be auto-logged in
      // If enabled, show message about checking email
      if (data.user && !data.session) {
        return { 
          success: true, 
          data,
          message: 'Please check your email to verify your account'
        }
      }

      setShowAuthModal(false)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result with success/error
   */
  const signIn = async (email, password) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      setShowAuthModal(false)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign in with social provider (Google/Facebook)
   * @param {string} provider - Social provider ('google' or 'facebook')
   * @returns {Promise<Object>} Result with success/error
   */
  const signInWithSocial = async (provider) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // OAuth will redirect, so we don't close the modal here
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign out user
   * @returns {Promise<Object>} Result with success/error
   */
  const signOut = async () => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      // Clear state
      setUser(null)
      setProfile(null)
      setSession(null)
      setUserTasks([])

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Complete a reward task
   * @param {string} taskId - Task ID to complete
   * @returns {Promise<Object>} Result with success/error
   */
  const completeTask = async (taskId) => {
    if (!user || !profile) {
      return { success: false, error: 'User not authenticated' }
    }

    const task = rewardTasks.find(t => t.id === taskId)
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    // Check if already completed
    const alreadyCompleted = userTasks.some(ut => ut.task_id === taskId)
    if (alreadyCompleted) {
      return { success: false, error: 'Task already completed' }
    }

    try {
      const { success, error } = await dbCompleteTask(user.id, taskId, task.points)

      if (success) {
        // Update local state
        setUserTasks(prev => [...prev, { 
          task_id: taskId, 
          completed_at: new Date().toISOString() 
        }])
        
        // Update profile points
        setProfile(prev => prev ? {
          ...prev,
          points: (prev.points || 0) + task.points
        } : prev)

        return { success: true }
      } else {
        return { success: false, error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Modal management
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  // Computed values
  const isAuthenticated = !!user
  const getTotalPoints = () => profile?.points || 0
  const getCompletedTasksCount = () => userTasks.length
  const getPendingTasks = () => rewardTasks.filter(task => 
    !userTasks.some(ut => ut.task_id === task.id)
  )

  // Enhanced reward tasks with completion status
  const enhancedRewardTasks = rewardTasks.map(task => ({
    ...task,
    completed: userTasks.some(ut => ut.task_id === task.id)
  }))

  const value = {
    // Auth state
    user,
    profile,
    session,
    isAuthenticated,
    loading,

    // Auth methods
    signUp,
    signIn,
    signOut,
    signInWithSocial,

    // Modal state
    showAuthModal,
    authMode,
    openAuthModal,
    closeAuthModal,

    // Rewards
    rewardTasks: enhancedRewardTasks,
    userTasks,
    completeTask,
    getTotalPoints,
    getCompletedTasksCount,
    getPendingTasks,

    // Auth providers
    AUTH_PROVIDERS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 