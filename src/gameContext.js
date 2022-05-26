import { createContext, useContext, useState } from 'react'

const GameContext = createContext()

const GameProvider = ({ children }) => {
  const EASY_DIFFICULTY = 0, MEDIUM_DIFFICULTY = 1, HARD_DIFFICULTY = 2
  const EASY_SIZE = 9, MEDIUM_SIZE = 15, HARD_SIZE = 25 // Size refers to width/height of the grid in tiles
  const EASY_MINE_COUNT = 10, MEDIUM_MINE_COUNT = 40, HARD_MINE_COUNT = 60
  const READY_STATE = 0, PLAYING_STATE = 1, WON_STATE = 2, LOST_STATE = 3
  const ACTIVE_FLAG = 0, ACTIVE_DIG = 1

  const [size, setSize] = useState(EASY_SIZE)
  const [mines, setMines] = useState(null) // A size x size array of 0's and 1's signaling if a mine is on a tile
  const [dangers, setDangers] = useState(null)
  const [gameState, setGameState] = useState(READY_STATE)
  const [flags, setFlags] = useState(null) // A size x size array of 0's and 1's signaling if a flag is on a tile
  const [flagsReduced, setFlagsReduced] = useState([]) // The indices of where flags are placed by the player
  const [minesReduced, setMinesReduced] = useState([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [difficulty, setDifficulty] = useState(EASY_DIFFICULTY)
  const [runTimer, setRunTimer] = useState(false)
  const [activeControl, setActiveControl] = useState(ACTIVE_DIG)

  const value = {
    EASY_DIFFICULTY, MEDIUM_DIFFICULTY, HARD_DIFFICULTY,
    EASY_SIZE, MEDIUM_SIZE, HARD_SIZE,
    EASY_MINE_COUNT, MEDIUM_MINE_COUNT, HARD_MINE_COUNT,
    READY_STATE, PLAYING_STATE, WON_STATE, LOST_STATE,
    ACTIVE_FLAG, ACTIVE_DIG,
    size, setSize, 
    mines, setMines, 
    dangers, setDangers, 
    gameState, setGameState, 
    flags, setFlags,
    flagsReduced, setFlagsReduced,
    minesReduced, setMinesReduced,
    revealedCount, setRevealedCount,
    difficulty, setDifficulty,
    runTimer, setRunTimer,
    activeControl, setActiveControl
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

const useGame = () => {
  return useContext(GameContext)
}

export { GameProvider, useGame }