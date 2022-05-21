import { createContext, useContext, useState } from 'react'

const GameContext = createContext()

const GameProvider = ({ children }) => {
  const [size, setSize] = useState(9)
  const [mines, setMines] = useState(null)
  const [dangers, setDangers] = useState(null)
  const [gameState, setGameState] = useState('ready')
  const [flags, setFlags] = useState(null)
  const [minesReduced, setMinesReduced] = useState(null)
  const [revealedCount, setRevealedCount] = useState(0)
  const [difficulty, setDifficulty] = useState(0)

  const value = {
    size, setSize, 
    mines, setMines, 
    dangers, setDangers, 
    gameState, setGameState, 
    flags, setFlags,
    minesReduced, setMinesReduced,
    revealedCount, setRevealedCount,
    difficulty, setDifficulty
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

const useGame = () => {
  return useContext(GameContext)
}

export { GameProvider, useGame }