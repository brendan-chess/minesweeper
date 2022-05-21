import { useEffect, useState } from 'react'
import './Field.css'
import Tile from '../Tile/Tile'
import { useGame } from '../../gameContext'

const initializeMines = (size) => {
  let count = 0

  switch(size) {
    case 9:
      count = 10
      break
    case 15:
      count = 40
      break
    case 25:
      count = 60
      break
  }

  let indices = []

  let i = 0
  while(i < count) {
    let randomIndex = Math.floor(Math.random() * size * size)
    if(!indices.includes(randomIndex)) {
      indices.push(randomIndex)
      i++
    }
  }

  let mines = new Array(size * size).fill(0)

  for(let j = 0; j < count; j++) {
    let index = indices[j]
    mines[index] = 1
  }

  return { mines, minesReduced: indices }
}

const initializeDangers = (size) => {
  return new Array(size * size).fill(-1)
}

const initializeFlags = (size) => {
  return new Array(size * size).fill(0)
}

const drawTiles = (size, mines, dangers, flags) => {
  let tiles = []

  for(let row = 0; row < size; row++) {
    let currentRow = []

    for(let column = 0; column < size; column++) {
      let index = (row * size) + column
      currentRow.push(<Tile key={index} id={index} mine={mines[index]} danger={dangers[index]} flag={flags[index]} />)
    }

    tiles.push(<div key={row} className='Field-row'>{currentRow}</div>)
  }

  return tiles
}

const Field = () => {
  const { size, mines, setMines, dangers, setDangers, gameState, setGameState, flags, setFlags, minesReduced, setMinesReduced, revealedCount } = useGame()
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    if(gameState === 'playing') {
      const { mines, minesReduced } = initializeMines(size)
      setMines(mines)
      setMinesReduced(minesReduced)
      setDangers(initializeDangers(size))
      setFlags(initializeFlags(size))
    }
  }, [setMines, setDangers, size, setFlags, gameState, setMinesReduced])

  const checkIfWon = () => {
    if(minesReduced) {
      let won = true
      // conditions for winning:
      // number of tiles - number of mines = number revealed (all tiles revealed or flagged)
      // flags = minesReduced
  
      if(!dangers.includes(-1)) {
        minesReduced.every(index => {
          const correctFlag = flags[index] === 1
          if(!correctFlag) won = false
          return correctFlag
        })
      } else won = false
  
      if(won) setGameState('won')
    }
  }
  
  useEffect(checkIfWon, [dangers, flags, minesReduced, revealedCount, setGameState, size])

  useEffect(() => setFadeIn(true))

  return mines && (
    <div 
      className='Field-container Field-fade-in'
      onAnimationEnd={() => setFadeIn(false)}
    >
      <div className={gameState === 'playing' ? null : 'Field-overlay'}>
        {drawTiles(size, mines, dangers, flags)}
      </div>
    </div>
  )
}

export default Field