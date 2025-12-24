import { createClient } from '@supabase/supabase-js'

// Environment variables for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Create Supabase client with security options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage (secure for web)
    storage: window.localStorage,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Persist session across tabs
    persistSession: true,
    // Detect session in URL for OAuth callbacks
    detectSessionInUrl: true
  }
})

// Database table names (centralized for consistency)
export const TABLES = {
  PROFILES: 'profiles',
  REWARD_TASKS: 'reward_tasks',
  USER_REWARDS: 'user_rewards',
  USER_TASKS: 'user_tasks'
}

// Auth providers configuration
export const AUTH_PROVIDERS = {
  GOOGLE: 'google'
} 