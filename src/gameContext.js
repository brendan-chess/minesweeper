import { createContext, useContext, useState } from 'react'

const GameContext = createContext()

const GameProvider = ({ children }) => {
  const EASY_DIFFICULTY = 0, MEDIUM_DIFFICULTY = 1, HARD_DIFFICULTY = 2
  const EASY_SIZE = 9, MEDIUM_SIZE = 15, HARD_SIZE = 25 // Size refers to width/height of the grid in tiles
  const EASY_MINE_COUNT = 10, MEDIUM_MINE_COUNT = 40, HARD_MINE_COUNT = 60
  const READY_STATE = 0, PLAYING_STATE = 1, WON_STATE = 2, LOST_STATE = 3

  const [size, setSize] = useState(EASY_SIZE)
  const [mines, setMines] = useState(null)
  const [dangers, setDangers] = useState(null)
  const [gameState, setGameState] = useState(READY_STATE)
  const [flags, setFlags] = useState(null)
  const [minesReduced, setMinesReduced] = useState(null)
  const [revealedCount, setRevealedCount] = useState(0)
  const [difficulty, setDifficulty] = useState(EASY_DIFFICULTY)

  const value = {
    EASY_DIFFICULTY, MEDIUM_DIFFICULTY, HARD_DIFFICULTY,
    EASY_SIZE, MEDIUM_SIZE, HARD_SIZE,
    EASY_MINE_COUNT, MEDIUM_MINE_COUNT, HARD_MINE_COUNT,
    READY_STATE, PLAYING_STATE, WON_STATE, LOST_STATE,
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