import { useState, useEffect } from 'react'
import { supabase, TABLES } from '../lib/supabase'

/**
 * Custom hook for database operations
 * Provides CRUD operations with error handling and loading states
 */
export const useDatabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Clear error state
  const clearError = () => setError(null)

  /**
   * Create or update user profile
   * @param {Object} profileData - User profile data
   * @returns {Promise<Object>} Result with success/error
   */
  const upsertProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .upsert(profileData, { 
          onConflict: 'id',
          returning: 'minimal' 
        })

      if (error) throw error

      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  const getProfile = async (userId) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get all reward tasks
   * @returns {Promise<Array>} List of reward tasks
   */
  const getRewardTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(TABLES.REWARD_TASKS)
        .select('*')
        .order('points', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message, data: [] }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get user's completed tasks
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of completed task IDs
   */
  const getUserTasks = async (userId) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(TABLES.USER_TASKS)
        .select('task_id, completed_at')
        .eq('user_id', userId)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message, data: [] }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Complete a reward task
   * @param {string} userId - User ID
   * @param {string} taskId - Task ID
   * @param {number} points - Points to award
   * @returns {Promise<Object>} Result with success/error
   */
  const completeTask = async (userId, taskId, points) => {
    try {
      setLoading(true)
      setError(null)

      // Start a transaction-like operation
      const { error: taskError } = await supabase
        .from(TABLES.USER_TASKS)
        .insert({
          user_id: userId,
          task_id: taskId,
          completed_at: new Date().toISOString()
        })

      if (taskError) throw taskError

      // Update user points
      const { error: pointsError } = await supabase.rpc('increment_user_points', {
        user_id: userId,
        points_to_add: points
      })

      if (pointsError) throw pointsError

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get user's total points
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total points
   */
  const getUserPoints = async (userId) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .select('points')
        .eq('id', userId)
        .single()

      if (error) throw error

      return { success: true, points: data?.points || 0 }
    } catch (err) {
      setError(err.message)
      return { success: false, points: 0, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    clearError,
    upsertProfile,
    getProfile,
    getRewardTasks,
    getUserTasks,
    completeTask,
    getUserPoints
  }
} 