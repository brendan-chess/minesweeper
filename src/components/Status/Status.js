import { useEffect, useState } from 'react'
import { useGame } from '../../gameContext'
import './Status.css'

const Status = () => {
  const game = useGame()
  const [timer, setTimer] = useState(0)
  const [intervalId, setIntervalId] = useState(0)

  useEffect(() => {
    if(game.runTimer) {
      let start = Date.now()

      const interval = setInterval(() => {
        let change = Date.now() - start
        setTimer(Math.floor(change / 1000))
      }, 250)

      setIntervalId(interval)
    } else {
      clearInterval(intervalId)
    }
  }, [game.runTimer])

  useEffect(() => {
    // Reset timer to zero when player starts a new game
    if(game.revealedCount === 0) setTimer(0)
  }, [game.revealedCount])

  const getTime = () => {
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60

    if(seconds < 10) {
      return `${minutes}:0${seconds}`
    }

    return `${minutes}:${seconds}`
  }

  const getFlagsRemaining = () => {
    return game.minesReduced.length - game.flagsReduced.length
  }

  return game.gameState !== game.READY_STATE && (
    <div className='Status-container Field-fade-in'>
      <div className='Status-flag'>
        <div className='Status-flag-icon' />
        <div className='Status-flag-text'>{getFlagsRemaining()} remaining</div>
      </div>
      <div className='Status-timer'>
        <div className='Status-timer-icon' />
        <div className='Status-timer-text'>{getTime()}</div>
      </div>
    </div>
  )
}

export default Status
