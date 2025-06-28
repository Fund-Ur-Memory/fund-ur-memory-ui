import { useState, useEffect } from 'react'
import type { FormattedVault } from '../types/contracts'

export const useVaultProgress = (vault: FormattedVault) => {
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    const calculateProgress = () => {
      if (!vault.unlockTime?.date || !vault.createdAt?.date) {
        setProgress(0)
        setTimeRemaining('No time data')
        return
      }

      const now = new Date()
      const createdAt = vault.createdAt.date
      const unlockTime = vault.unlockTime.date
      
      // Calculate total duration and elapsed time
      const totalDuration = unlockTime.getTime() - createdAt.getTime()
      const elapsedTime = now.getTime() - createdAt.getTime()
      
      // Calculate progress percentage
      let progressPercentage = 0
      if (totalDuration > 0) {
        progressPercentage = Math.min((elapsedTime / totalDuration) * 100, 100)
      }
      
      setProgress(Math.max(0, progressPercentage))
      
      // Calculate time remaining
      const timeLeft = unlockTime.getTime() - now.getTime()
      if (timeLeft <= 0) {
        setTimeRemaining('Unlocked!')
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`)
        } else {
          setTimeRemaining(`${minutes}m`)
        }
      }
    }

    // Calculate immediately
    calculateProgress()
    
    // Update every minute for real-time progress
    const interval = setInterval(calculateProgress, 60 * 1000)
    
    return () => clearInterval(interval)
  }, [vault.unlockTime?.date, vault.createdAt?.date])

  return {
    progress: Math.round(progress),
    timeRemaining,
    isUnlocked: progress >= 100
  }
}